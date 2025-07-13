import React from 'react';

const VideoFeed = () => {
    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <img
                id="opencv-video"
                src="http://192.168.137.105:5000/video_feed"
                alt="Video Feed"
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default VideoFeed;