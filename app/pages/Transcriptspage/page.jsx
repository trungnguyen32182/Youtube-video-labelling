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

    const filterText = (inputText) => {
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

    const saveResults = async (videoData) => {
        try {
            const response = await fetch("http://localhost:8000/api/save_results", {
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


    const anazlyzeTranscripts = async (Transcript_data) => {
        try {
            const data = await fetch(`http://localhost:8000/api/analyzeTranscript`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ transcript_data: Transcript_data }),
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
            const transcriptData = await getTranscript(videoId)
            if (transcriptData.length === 0) {
                window.alert("This youtube link does not have a transcript");
                return;
            }
            handleScroll()
            const transcriptText = transcriptData?.map((item) => item.text)
            let filtered_transcriptText = transcriptText?.map((item) => filterText(item));
            filtered_transcriptText = filtered_transcriptText?.filter((item) => item !== "");

            setChannel(channelData);
            setVideo(videoData);
            setTranscripts(filtered_transcriptText);

            if (filtered_transcriptText.length > 0) {
                const result = await anazlyzeTranscripts(filtered_transcriptText);
                setResult(result);
                // Lưu kết quả vào cơ sở dữ liệu
                const videoresultData = await { chanel: videoData?.channelTitle, title: videoData?.title, url: videoUrl, tags: result?.result };
                const saveResult = await saveResults(videoresultData);
            }

            setVideoUrl("");
            setLoading(false);
        } else {
            window.alert("Please login to continue");
        }
    };

    return (
        <>
            <AppBar />
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
            {transcripts.length > 0 && (
                <div ref={containerRef} className='container mx-auto relative block top-[100vh] flex flex-row justify-between items-center px-4 z-50'>
                    <div className="h-full w-full flex flex-col">
                        <DisplayInfo
                            title={"Your results from the lyrics"}
                            isLoading={isLoading}
                            video={video}
                            channel={channel}
                            result={result}
                            component={false}
                            data={transcripts}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Transcriptspage;
