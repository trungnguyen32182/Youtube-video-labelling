import React from 'react'


const Comments = ({ comments, result }) => {
    return (
        <div className="mt-4">
            {result?.comment_with_emotion?.map((comment, index) => (
                <div key={index} className=" mb-6 mr-12 ml-12 flex flex-col items-start gap-4 border-1.5 border-black p-2 rounded-md w-[95%] shadow-[0_1px_1px_1px_rgba(0,0,0,0.4)]">
                    <p className="text-over font-semibold text-[1.25rem]">{comment[0]}</p>
                    <div className="flex gap-4 items-start">
                        {comment[1].map((emotion, index) => (
                            <div key={index} className="flex flex-col ">
                                <p className="text-sm font-semibold">{emotion.name}</p>
                                <p className=" emotion-value text-center text-sm font-semibold  rounded-lg p-1 w-[48px] bg-[#353535]">{parseFloat(emotion.score).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Comments