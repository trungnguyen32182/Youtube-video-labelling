import React from "react";

const Result = ({ result }) => {
  return (
    <div className="mt-4 mb-2 mr-12 grid grid-cols-3 gap-6">
  {result?.result?.map((item, index) => (
    <div
      key={index}
      className=" flex justify-center items-center gap-4 border-2 border-black p-2 rounded-md shadow-[0_2px_1px_1px_rgba(0,0,0,0.3)]"
    >
      <p className="font-bold text-[1rem]" >{item[0]}</p>
      <p className="font-bold text-[1rem] ">{item[1]}</p>
    </div>
  ))}
</div>

  );
};

export default Result;
