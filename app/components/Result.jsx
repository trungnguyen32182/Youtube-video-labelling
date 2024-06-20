import React from 'react'

const Result = ({ result }) => {
    return (
        <div className="mt-4 mb-2 flex flex-col gap-6 max-w-[420px]">
            {result?.result?.map((item, index) => (
                <div key={index} className="truncate flex items-center gap-4 bg-white bg-opacity-50 p-2 rounded-full w-[80%] border-white border-opacity-50 shadow-[0_4px_1px_1px_rgba(0,0,0,0.3)] hover:bg-opacity-75 flex items-center justify-center">
                    <p className="font-bold text-[1.25rem]">{item[0]}</p>
                    <p className="font-bold text-[1.25rem]">{item[1]}</p>
                </div>
            ))}
        </div>
    )
}

export default Result