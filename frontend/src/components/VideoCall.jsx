
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PhoneOff, Mic, Video, Repeat } from "lucide-react";

const VideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure data from location.state (sent when navigating to call)
  const { otherUserId, fullName } = location.state || {};

  const localVideoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigate("/");
  };

  return (
    <div className="relative w-full h-screen bg-black text-white flex items-center justify-center">
    
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

     
      <div className="absolute  w-full flex justify-center">
        <div className="text-center bg-black bg-opacity-40 px-6 py-2 rounded-xl">
          <h1 className="text-xl font-semibold">{fullName || otherUserId}</h1>
          <p className="text-sm  text-gray-300 animate-pulse">Calling...</p>
        </div>
      </div>

      
      <div className="absolute bottom-6 w-full flex justify-center gap-6">
        <button className="bg-gray-800 p-3 rounded-full">
          <Mic className="text-white" />
        </button>
        <button
          onClick={endCall}
          className="bg-red-600 p-3 rounded-full hover:bg-red-700"
        >
          <PhoneOff className="text-white" />
        </button>
        <button className="bg-gray-800 p-3 rounded-full">
          <Repeat className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;

