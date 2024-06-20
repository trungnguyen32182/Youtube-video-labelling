// DisplayInfo.js
import React from 'react';
import { ChannelHeader, VideoHeader } from './ChannelHeader';
import Loading from './Loading';
import Result from './Result';
import Comments from '../components/Comments';
import Transcripts from '../components/Transcripts';

const DisplayInfo = ({ title, isLoading, video, channel, result, component, data }) => {
    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <div className="text-[4rem] text-center font-[600]"
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{title}</div>
            <div className='mt-5'>
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="flex flex-col w-full justify-center mt-6  p-4 bg-white/30 backdrop-blur-md shadow-[0_4px_8px_0_rgba(0,0,0,0.3)]">
                        <p className="ml-12 mt-4 font-bold text-[2.5rem]" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{video?.title}</p>
                        <div className='grid grid-cols-3 w-full justify-center '>
                            <div className="col-span-2">
                                <VideoHeader video={video} />
                                <ChannelHeader channel={channel} />
                            </div>
                            <div className="mt-8">
                                <Result result={result} />
                            </div>
                            <div className="mt-8">
                                <p className="font-mono font-bold text-2xl ml-12" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}> Where the result comes from </p>
                                {
                                    component ?
                                        (
                                            <Comments comments={data} result={result} />
                                        ) :
                                        (
                                            <Transcripts transcripts={data} result={result} />
                                        )
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default DisplayInfo;
