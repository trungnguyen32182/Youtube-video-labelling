import React from 'react';

const Transcripts = ({ transcripts, result }) => {
    return (
        <div className="mt-4">
            {result?.transcript_with_emotion?.map((transcript, index) => (
                <div key={index} className=" mb-6 mr-12 ml-12 flex flex-col items-start gap-4 border-1.5 border-black p-2 rounded-md w-[95%] shadow-[0_1px_1px_1px_rgba(0,0,0,0.4)]">
                    <p className="text-over font-semibold text-[1.25rem]">Time: {transcript.start}s</p>
                    <p className=" text-over font-semibold text-[1.25rem]">Text: {transcript.text}</p>
                    <div className="flex flex-wrap gap-4 items-start">
                        {transcript.emotions.map((emotion, emotionIndex) => (
                            <div key={emotionIndex} className="flex flex-col gap-2">
                                <p className="text-sm font-semibold">{emotion.name}</p>
                                <p className="emotion-value text-center text-sm font-semibold  rounded-lg p-1 w-[48px] bg-[#353535]">{parseFloat(emotion.score).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Transcripts;
