// ChannelHeader.js
import React from "react";

export const ChannelHeader = ({ channel }) => {
  return (
    <div className="mt-12 ml-12 flex items-center gap-4 w-[80%] ">
      <img
        src={channel?.thumbnails?.default?.url}
        alt={channel?.title}
        className="w-12 h-12 object-contain rounded-[50%]"
      />
      <p className="font-bold text-[1.25rem]" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{channel?.title}</p>
    </div>
  );
};

export const VideoHeader = ({ video }) => {
  return (
    <div className="mt-12 ml-12 flex-col justify-center ">
      <img
        src={video?.thumbnails?.maxres?.url}
        alt={"video thumbnail"}
        className="object-cover w-[500px] rounded-md"
      />
    </div>
  );
};
