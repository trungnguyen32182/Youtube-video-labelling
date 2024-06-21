"use client"
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from 'react';
import { getChannelDetail, getComment, getVideoDetail } from "../../action";
import AppBar from '../../components/AppBar';
import BackgroundGradientAnimation from '../../components/BackGroundGradientAnimation';
import DisplayInfo from '../../components/DisplayInfo';
import FormPage from '../../components/FormPage';

function Transcriptspage() {
    const containerRef = useRef(null);
    const [heightInVH, setHeightInVH] = useState(0);
    const [videoUrl, setVideoUrl] = useState('');
    const { data: session } = useSession();
    const [isLoading, setLoading] = useState(false);
    const [channel, setChannel] = useState({});
    const [video, setVideo] = useState({});
    const [result, setResult] = useState(null);
    const [transcripts, setTranscripts] = useState([]);
    const [transcriptData, setTranscriptData] = useState([]);

    const filterText = (inputText) => {
      if (inputText === "[Music]")
          return inputText
      // Remove emojis
      const noEmojis = inputText.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");
      // Remove special characters
      const noSpecialChars = noEmojis.replace(/[^\w\s]/gi, "");

      return noSpecialChars;
  };

    useEffect(() => {
        if (containerRef.current) {
            const heightInPixels = containerRef.current.clientHeight;
            const viewportHeight = window.innerHeight;
            const heightInVH = (heightInPixels / viewportHeight) * 100;
            setHeightInVH(heightInVH);
        }
    }, []);

    const handleScroll = () => {
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
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

    const saveTranscriptResults = async (videoData) => {
        try {
          const response = await fetch("http://localhost:8000/api/save_transcript", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(videoData),
          });
          const result = await response.json();
          console.log(result);
          return result;
        } catch (error) {
          console.error("Error saving results:", error);
          return { error: "Failed to save results" };
        }
      };


      const anazlyzeTranscripts = async (Transcript) => {
        try {
          const data = await fetch(`http://localhost:8000/api/analyzeTranscript`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ transcript_data: Transcript }),
          });
          const result = await data.json();
          return result;
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };

      const groupSegmentsByTotalDuration = (segments, totalTime = 30) => {
        let currentDuration = 0;
        const groupedObjects = [];
        let currentTextGroup = '';
        let currentStart;
      
        segments?.forEach((segment, index) => {
          if (currentDuration === 0) {
            currentStart = segment.start;
          }
      
          if (currentDuration + segment.duration <= totalTime) {
            currentTextGroup += segment.text + " ";
            currentDuration += segment.duration;
          } else {
            groupedObjects.push({
              start: currentStart,
              duration: currentDuration,
              text: currentTextGroup.trim()
            });
      
            currentTextGroup = segment.text + " ";
            currentDuration = segment.duration;
            currentStart = segment.start;
          }
    
          if (index === segments.length - 1) {
            groupedObjects.push({
              start: currentStart,
              duration: currentDuration,
              text: currentTextGroup.trim()
            });
          }
        });
      
        return groupedObjects;
      }
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoUrl.includes("youtube.com/watch?v=")) {
          return;
        }
        const videoId = videoUrl.split("v=")[1].split("&")[0];
    
        if (session) {
          setLoading(true);
          const transcriptData = await getTranscript(videoId)
          const trimText = groupSegmentsByTotalDuration(transcriptData, 30);
          const data = await getComment(videoId);
          const channelId = data[0].channelId;
          const videoData = await getVideoDetail(videoId);
          const channelData = await getChannelDetail(channelId);
          // const transcriptText = trimText.map((item) => item.text)
          const transcriptTextStart = trimText.map((item) => ({ text: item.text, start: item.start }));
          let filtered_transcriptText = transcriptTextStart?.map((item) => ({ text: filterText(item.text), start: item.start }));
          filtered_transcriptText = filtered_transcriptText?.filter((item) => ({ text: item.text !== "", start: item.start }));
    
          setChannel(channelData);  
          setVideo(videoData);

          setTranscriptData(filtered_transcriptText);
          if (filtered_transcriptText.length > 0) {
            const result = await anazlyzeTranscripts(filtered_transcriptText);
            
            setResult(result);
            console.log("handleTranscript ~ result:", result)
            const videoResultData = await { chanel: videoData.channelTitle, title: videoData.title, url: videoUrl, tags: result.result };
            const saveResult = await saveTranscriptResults(videoResultData);
          }
          console.log(transcriptData);
          setVideoUrl("");
          setLoading(false);
        } else {
          window.alert("Please login to continue");
        }
      };

    return (
        <>
            <AppBar/>
            <BackgroundGradientAnimation height={transcripts.length > 0 ? String(220 + heightInVH) : '100'} />
            <div>
                <div className='container mx-auto relative flex flex-row justify-between items-center px-4 z-50'>
                    <FormPage
                        title="Enter your url youtube"
                        desc="Analyze videos through transcript "
                        isHomePage={false}
                        videoUrl={videoUrl}
                        setVideoUrl={setVideoUrl}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            {transcriptData?.length > 0 && (
                <div ref={containerRef} className='container mx-auto relative block top-[87vh] flex flex-row justify-center items-center px-4 z-50'>
                    <div className=" display-result-comment">
                        <DisplayInfo
                            title={"Your results from the comments"}
                            isLoading={isLoading}
                            video={video}
                            channel={channel}
                            result={result}
                            component= "transcript"
                            data={transcriptData}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Transcriptspage;
