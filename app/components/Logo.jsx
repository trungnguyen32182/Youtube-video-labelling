import Link from 'next/link'
import React from 'react'

export default function Logo() {
    return (
        <Link href={'/'} className='bg-transparent flex flex-row justify-between items-center'>
            <img src='../bingandoLogo.png' alt='logo' className='w-[4.75rem] h-[3.5rem]'/>
            <span className='h-5 text-[1.5rem] leading-[1rem] font-bold'>Bingando</span>
        </Link>
    )
}
