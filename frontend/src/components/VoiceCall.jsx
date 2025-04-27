
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PhoneOff, Mic, Volume2 } from "lucide-react";

const VoiceCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { otherUserId, fullName } = location.state || {};
  const [stream, setStream] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const startAudio = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing microphone.", error);
      }
    };

    startAudio();

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
    <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-xl font-semibold">{fullName || "User"}</h1>
      <p className="text-sm text-gray-300">Calling...</p>

      <audio ref={audioRef} autoPlay muted />

      <div className="mt-10 flex gap-6">
        <button className="bg-gray-700 p-3 rounded-full">
          <Mic />
        </button>
        <button
          onClick={endCall}
          className="bg-red-600 p-3 rounded-full hover:bg-red-700"
        >
          <PhoneOff />
        </button>
        <button className="bg-gray-700 p-3 rounded-full">
          <Volume2 />
        </button>
      </div>
    </div>
  );
};

export default VoiceCall;

