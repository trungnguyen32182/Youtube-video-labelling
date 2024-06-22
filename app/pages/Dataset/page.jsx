"use client";
import React, { useEffect, useState } from "react";
import DatasetTable from "../../components/Dataset";
import Logo from "../../components/Logo";
import SignIn from "../../components/SignIn";
import Link from "next/link";

const Dataset = () => {
    const [data, setData] = useState([]);
    const [isTranscriptData, setIsTranscriptData] = useState(false);
  
    // Function to fetch results from API
    const fetchResults = async (apiEndpoint) => {
      try {
        const response = await fetch(`http://localhost:8000${apiEndpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        if (!data.results) {
          throw new Error('No results found in the response');
        }
    
        return data.results;
      } catch (error) {
        console.error("Error fetching results:", error);
        return [];
      }
    };
  
    useEffect(() => {
      const getData = async () => {
        const apiEndpoint = isTranscriptData ? "/api/get_transcript_results" : "/api/get_results";
        const results = await fetchResults(apiEndpoint);
        setData(results);
      };
      getData();
    }, [isTranscriptData]);
  
    return (
      <div className="dataset-container">
        <header className="relative dataset-appbar flex flex-row justify-between items-center px-4 py-2 z-50 top-0">
          <Link href={'/'} className='bg-transparent flex flex-row justify-between items-center'>
              <img src='../logoDataset.png' alt='logo' className='w-[3.5rem] h-[3.5rem]' />
              <span className='h-5 text-[1.5rem] leading-[1rem] font-bold'>Bingando</span>
          </Link>
          <button 
            onClick={() => setIsTranscriptData(prev => !prev)}
            className="bg-blue-500 mr-12 text-white px-4 py-2 rounded"
          >
            {isTranscriptData ? "Show Comments Data" : "Show Transcript Data"}
          </button>
        </header>
        <DatasetTable data={data} isTranscriptData={isTranscriptData}/>
      </div>
    );
  };
  
  export default Dataset;