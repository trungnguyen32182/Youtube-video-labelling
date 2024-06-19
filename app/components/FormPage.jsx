"use client"
import React from 'react'
import Link from 'next/link'

function FormPage({ title, desc, isHomePage }) {
    return (
        <div className='grid place-items-center absolute top-[40vh] left-0 right-0 transform -translate-y-1/2'>
            <div className='text-center font-extrabold text-[5rem]' style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{title}</div>
            <div className="py-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{desc}</div>
            {isHomePage ?
                (
                    <Link href='pages/Commentspage/' passHref>
                        <button className='text-[2.5rem] leading-[2.5rem] bg-white bg-opacity-50 text-white text-shadow rounded-full px-10 py-4 border border-white border-opacity-50 hover:bg-opacity-75 flex items-center justify-center mt-5'>
                            Start
                        </button>
                    </Link>
                ) :
                (
                    <div>
                        <input class="max-w-xs bg-gray-100 text-gray-900 p-1 px-2 min-h-[40px] rounded-md outline-none border-none leading-snug shadow-input focus:border-b-2 focus:border-indigo-500 focus:rounded-b-sm hover:outline hover:outline-1 hover:outline-gray-300 mx-[1rem]"
                            name="text"
                            placeholder="https://www.youtube.com/watch?v=LLYrzpt8fPA..." />
                        <button class="text-gray-900 py-2 px-6 text-lg rounded-md bg-gray-200 cursor-pointer border border-gray-200 transition-all duration-300 shadow-neu hover:border-white active:shadow-neu-active">
                            Submit
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default FormPage