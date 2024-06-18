"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getChannelDetail, getComment, getVideoDetail } from "./action";
import Appbar from "./components/AppBar";
import Loading from "./components/Loading";
import { ChannelHeader, VideoHeader } from "./components/ChannelHeader";
import Result from "./components/Result";
import Comments from "./components/Comments";

export default function Home() {
  const { data: session } = useSession();
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [transcriptData, setTranscriptData] = useState([]);
  const [result, setResult] = useState(null);
  const [resultTranscript, setResultTranscript] = useState(null);
  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({});

  const filterText = (inputText) => {
    // Remove emojis
    const noEmojis = inputText.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");
    // Remove special characters
    const noSpecialChars = noEmojis.replace(/[^\w\s]/gi, "");

    return noSpecialChars;
  };

  const anazlyzeComments = async (comments) => {
    try {
      const data = await fetch(`http://localhost:8000/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment_data: comments }),
      });
      const result = await data.json();
      return result;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTranscript = async (videoId) => {
    try {
      const data = await fetch(`http://localhost:8000/api/getTranscript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId: videoId }),
      });
      const result = await data.json();
      return result;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const anazlyzeTranscripts = async (Transcripts) => {
    try {
      const data = await fetch(`http://localhost:8000/api/analyzeTranscript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript_data: Transcripts }),
      });
      const result = await data.json();
      return result;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl.includes("youtube.com/watch?v=")) {
      return;
    }
    const videoId = videoUrl.split("v=")[1].split("&")[0];

    if (session) {
      setLoading(true);
      const data = await getComment(videoId);
      const channelId = data[0].channelId;
      const videoData = await getVideoDetail(videoId);
      const channelData = await getChannelDetail(channelId);

      setChannel(channelData);
      setVideo(videoData);

      const comment = data.map(
        (item) => item.topLevelComment.snippet.textDisplay
      );
      let filtered_comments = comment.map((item) => filterText(item));
      filtered_comments = filtered_comments.filter((item) => item !== "");
      setComments(filtered_comments);
      if (filtered_comments.length > 0) {
        const result = await anazlyzeComments(filtered_comments);
        setResult(result);
      }
      setVideoUrl("");
      setLoading(false);
    } else {
      window.alert("Please login to continue");
    }
  };

  const handleTranscript = async (e) => {
    e.preventDefault();
    if (!videoUrl.includes("youtube.com/watch?v=")) {
      return;
    }
    const videoId = videoUrl.split("v=")[1].split("&")[0];

    if (session) {
      setLoading(true);
      const transcriptData = await getTranscript(videoId)
      const transcriptText = transcriptData.map((item) => item.text)
      let filtered_transcriptText = transcriptText.map((item) => filterText(item));
      filtered_transcriptText = filtered_transcriptText.filter((item) => item !== "");

      setTranscriptData(filtered_transcriptText);
      if (filtered_transcriptText.length > 0) {
        const result = await anazlyzeTranscripts(filtered_transcriptText);

        console.log("handleTranscript ~ result:", result)

        setResult(result);
      }
      setVideoUrl("");
      setLoading(false);
    } else {
      window.alert("Please login to continue");
    }
  };
  return (
    <main className="bg-main-grey flex flex-col min-h-screen text-black">
      <Appbar />
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-main-grey min-h-screen">
          <p className="m-4 text-[4rem] font-bold font-mono text-center"> Bỉ ngạn đỏ </p>
          <p className="ml-4 text-[1.5rem] font-normal font-mono">
            Youtube Video Comment Sentiment Explorer
          </p>
          <form onSubmit={handleSubmit}>
            <p className="ml-4 mt-12 text-[1.25rem]">Paste Youtube Video URL</p>
            <input
              className="m-4 p-2 rounded-lg border-2 border-black"
              type="text"
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v="
              value={videoUrl}
            />
            {isLoading ? (
              <button className="m-4 p-2 rounded-lg border-2 border-black">
                <Loading />
              </button>
            ) : (
              <>
                <button
                  className="m-4 p-2 rounded-lg border-2 border-black"
                  type="submit"
                >
                  Let's go
                </button>
                <button
                  className="m-4 p-2 rounded-lg border-2 border-black"
                  onClick={(e) => handleTranscript(e)}
                >
                  Let's go transcript
                </button>
              </>

            )}
          </form>
        </div>
        <div className="min-h-screen col-span-2 bg-gradient-to-br from-main-pink">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-3 border-2 border-black mt-16 ml-12 mr-24 rounded-md p-4 bg-white/30 backdrop-blur-md">
              <div className="col-span-2">
                <ChannelHeader channel={channel} />
                <VideoHeader video={video} />
              </div>
              <div className="mt-12">
                <p className="font-mono font-bold text-[1.25rem]"> Result </p>
                <Result result={result} />
              </div>
            </div>
          )}
          <div className="ml-12 mt-8">
            <p className="font-mono font-bold text-2xl "> Where the result comes from </p>
            <Comments comments={comments} result={result} />
          </div>
        </div>
      </div>
    </main>
  );
}
