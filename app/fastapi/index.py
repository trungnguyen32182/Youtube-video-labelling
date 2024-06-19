from fastapi import FastAPI, HTTPException
from hume import HumeStreamClient
from hume.models.config import LanguageConfig
from collections import defaultdict
from pymongo import MongoClient
from bson import ObjectId
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi

from fastapi.logger import logger


# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=dotenv_path)


# Define Pydantic models for request bodies
MONGO_CONNECT_STRING = os.getenv("MONGO_CONNECT_STRING")
client = MongoClient(MONGO_CONNECT_STRING)


class Comment(BaseModel):
    comment_data: List[str]

class TranscriptRequest(BaseModel):
    videoId: str
    
class Transcript(BaseModel):
    transcript_data: List[str]


# Initialize FastAPI app


class Video(BaseModel):
    chanel: str
    title: str
    url: str
    tags: List[List] = []


app = FastAPI()

# Define allowed origins for CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:8000",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def hello():
    return {"message": "hello world"}

@app.post("/api/analyze")
async def analyze(comment: Comment):
    client = HumeStreamClient(os.getenv("HUME_API_KEY"))
    config = LanguageConfig()
    res = []
    comment_with_emotion = []

    try:
        async with client.connect([config]) as socket:
            for sample in comment.comment_data:
                result = await socket.send_text(sample)
                emotions = result["language"]["predictions"][0]["emotions"]
                comment_with_emotion.append([sample, emotions])
                aggregated_scores = defaultdict(float)
                count_per_emotion = defaultdict(int)

                for emotion in emotions:
                    aggregated_scores[emotion["name"]] += emotion["score"]
                    count_per_emotion[emotion["name"]] += 1

                # Calculate mean scores
                mean_scores = {
                    emotion: aggregated_scores[emotion] /
                    count_per_emotion[emotion]
                    for emotion in aggregated_scores
                }

                # Rank emotions based on mean scores
                ranked_emotions = sorted(
                    mean_scores.items(), key=lambda x: x[1], reverse=True
                )

                top_emotions = ranked_emotions[0]
                # round the score to 2 decimal places
                top_emotions = (top_emotions[0], round(top_emotions[1], 2))
                res.append(list(top_emotions))

        # Sort the emotions based on the score
        # Create a dictionary to store the highest score for each emotion
        emotion_dict = {}
        for emotion, score in res:
            if emotion not in emotion_dict or score > emotion_dict[emotion]:
                emotion_dict[emotion] = score

        # Convert the dictionary back to a list
        result = [[emotion, score] for emotion, score in emotion_dict.items()]
        result.sort(key=lambda x: x[1], reverse=True)
        # Sort the emotions based on the score, only take the top 3
        for emotion in comment_with_emotion:
            title, properties = emotion
            properties.sort(key=lambda x: x["score"], reverse=True)
            emotion[1] = properties[:5]
        return {"result": result, "comment_with_emotion": comment_with_emotion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/api/getTranscript")
async def analyzeTranscript(request: TranscriptRequest):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(request.videoId, languages=['de', 'en'])
        return transcript
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch transcript: {e}")
    
@app.post("/api/analyzeTranscript")
async def analyzeTranscript(transcript: Transcript):
    client = HumeStreamClient(os.getenv("HUME_API_KEY"))
    config = LanguageConfig()
    res = []
    transcript_with_emotion = []
    try:
        async with client.connect([config]) as socket:
            for sample in transcript.transcript_data:
                result = await socket.send_text(sample)
                emotions = result["language"]["predictions"][0]["emotions"]
                transcript_with_emotion.append([sample, emotions])
                aggregated_scores = defaultdict(float)
                count_per_emotion = defaultdict(int)

                for emotion in emotions:
                    aggregated_scores[emotion["name"]] += emotion["score"]
                    count_per_emotion[emotion["name"]] += 1

                # Calculate mean scores
                mean_scores = {
                    emotion: aggregated_scores[emotion] /
                    count_per_emotion[emotion]
                    for emotion in aggregated_scores
                }

                # Rank emotions based on mean scores
                ranked_emotions = sorted(
                    mean_scores.items(), key=lambda x: x[1], reverse=True
                )

                top_emotions = ranked_emotions[0]
                # round the score to 2 decimal places
                top_emotions = (top_emotions[0], round(top_emotions[1], 2))
                res.append(list(top_emotions))

        # Sort the emotions based on the score
        # Create a dictionary to store the highest score for each emotion
        emotion_dict = {}
        for emotion, score in res:
            if emotion not in emotion_dict or score > emotion_dict[emotion]:
                emotion_dict[emotion] = score

        # Convert the dictionary back to a list
        result = [[emotion, score] for emotion, score in emotion_dict.items()]
        result.sort(key=lambda x: x[1], reverse=True)
        # Sort the emotions based on the score, only take the top 3
        for emotion in transcript_with_emotion:
            title, properties = emotion
            properties.sort(key=lambda x: x["score"], reverse=True)
            emotion[1] = properties[:5]
        return {"result": result, "transcript_with_emotion": transcript_with_emotion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/api/save_results")
async def save_results(video: Video):
    video_dict = video.dict()

    video_results_collection = client['dataset']['results']

    insert_result = video_results_collection.insert_one(video_dict)
    
    if insert_result.inserted_id:
        return {"message": "Successfully saved the analysis results", "id": str(insert_result.inserted_id)}
    else:
        return {"error": "Failed to save the analysis results"}

@app.get("/api/get_results")
async def get_results():
    video_results_collection = client['dataset']['results']
    results = video_results_collection.find()

    results_list = []
    for result in results:
        result["_id"] = str(result["_id"])  # Convert ObjectId to string
        results_list.append(result)

    if results_list:
        return {"results": results_list}
    else:
        raise HTTPException(status_code=404, detail="No results found")


@app.get("/api/get_result/{result_id}")
async def get_result_by_id(result_id: str):
    video_results_collection = client['dataset']['results']

    try:
        result = video_results_collection.find_one({"_id": ObjectId(result_id)})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid ID: {str(e)}")
        
    if result:
        result["_id"] = str(result["_id"])
        return result
    else:
        raise HTTPException(status_code=404, detail="Result not found")

