"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import AppBar from '../../components/AppBar';
import BackgroundGradientAnimation from '../../components/BackGroundGradientAnimation';
import FormPage from '../../components/FormPage';
import DisplayInfo from '../../components/DisplayInfo';
import { getChannelDetail, getComment, getVideoDetail } from "../../action";

function Commentspage() {
    const containerRef = useRef(null);
    const [heightInVH, setHeightInVH] = useState(0);
    const [videoUrl, setVideoUrl] = useState('');
    const { data: session } = useSession();
    const [isLoading, setLoading] = useState(false);
    const [channel, setChannel] = useState({});
    const [video, setVideo] = useState({});
    const [comments, setComments] = useState([]);
    const [result, setResult] = useState(null);


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
            handleScroll();
            const comment = data?.map(
                (item) => item.topLevelComment.snippet.textDisplay
            );

            let filtered_comments = comment?.map((item) => filterText(item));
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

    return (
        <>
            <AppBar />
            <BackgroundGradientAnimation height={comments?.length > 0 ? String(220 + heightInVH) : '100'} />
            <div>
                <div className='container mx-auto relative flex flex-row justify-between items-center px-4 z-50'>
                    <FormPage
                        title="Enter your url youtube"
                        desc="Analyze videos through comments "
                        isHomePage={false}
                        videoUrl={videoUrl}
                        setVideoUrl={setVideoUrl}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            {comments?.length > 0 && (
                <div ref={containerRef} className='container mx-auto relative block top-[100vh] flex flex-row justify-between items-center px-4 z-50'>
                    <div className="h-full w-full flex flex-col">
                        <DisplayInfo
                            title={"Your results from the comments"}
                            isLoading={isLoading}
                            video={video}
                            channel={channel}
                            result={result}
                            component={true}
                            data={comments}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Commentspage;
