
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Mic, Smile, Paperclip, FileText, Camera, User, BarChart2, Pencil, Lock } from "lucide-react";
import { FaPaperPlane, FaImage } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const fileInputRef = useRef(null);
  const micButtonRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Handle touch/mouse events for slide-to-cancel
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !audioBlob) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        audio: audioBlob,
      });

      setText("");
      setImagePreview(null);
      setAudioBlob(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Audio recording failed:", err);
      toast.error("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = (send = true) => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      
      if (!send) {
        setAudioBlob(null);
        toast("Recording cancelled", { icon: "🗑️" });
      }
    }
  };

  const handleRecordingTouchStart = (e) => {
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setCurrentX(e.touches ? e.touches[0].clientX : e.clientX);
    startRecording();
  };

  const handleRecordingTouchMove = (e) => {
    if (!isRecording) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setCurrentX(x);
    
    // Show cancel if dragged left enough
    const dragDistance = startX - x;
    setShowCancel(dragDistance > 50);
  };

  const handleRecordingTouchEnd = () => {
    if (showCancel && !isLocked) {
      stopRecording(false);
    }
    setShowCancel(false);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".attachment-menu")) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 w-full relative">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Recording UI */}
      {isRecording && (
        <div className="absolute bottom-16 left-0 right-0 flex items-center justify-between px-4 py-2 bg-red-500/10 rounded-lg mx-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
          </div>
          
          {showCancel ? (
            <div className="text-sm text-red-500">Slide to cancel</div>
          ) : (
            <button 
              onClick={toggleLock}
              className={`p-1 rounded-full ${isLocked ? 'bg-red-500/20' : ''}`}
            >
              <Lock size={16} className={isLocked ? "text-red-500" : "text-zinc-500"} />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-zinc-500"
        >
          <Smile size={22} />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
          </div>
        )}

        <div className="relative top-1 attachment-menu">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu((prev) => !prev)}
            className="text-zinc-500"
          >
            <Paperclip size={22} />
          </button>

          {showAttachmentMenu && (
            <div className="absolute bottom-12 left-0 z-20 w-48 bg-base-100 rounded-lg shadow-md border border-zinc-700 p-2 space-y-2 text-sm">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 w-full hover:bg-zinc-800 p-2 rounded">
                <FaImage size={16} />
                Photos & Videos
              </button>
              <button className="flex items-center gap-2 w-full hover:bg-zinc-800 p-2 rounded">
                <Camera size={16} />
                Camera
              </button>
              <button className="flex items-center gap-2 w-full hover:bg-zinc-800 p-2 rounded">
                <FileText size={16} />
                Document
              </button>
              <button className="flex items-center gap-2 w-full hover:bg-zinc-800 p-2 rounded">
                <User size={16} />
                Contact
              </button>
              <button className="flex items-center gap-2 w-full hover:bg-zinc-800 p-2 rounded">
                <BarChart2 size={16} />
                Poll
              </button>
              <button className="flex items-center gap-2 w-full hover:bg-zinc-800 p-2 rounded">
                <Pencil size={16} />
                Drawing
              </button>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {isRecording ? (
          <div 
            className="flex-1 bg-red-500/10 rounded-full py-2 px-4"
            onTouchStart={handleRecordingTouchStart}
            onTouchMove={handleRecordingTouchMove}
            onTouchEnd={handleRecordingTouchEnd}
            onMouseDown={handleRecordingTouchStart}
            onMouseMove={handleRecordingTouchMove}
            onMouseUp={handleRecordingTouchEnd}
            onMouseLeave={handleRecordingTouchEnd}
            style={{
              transform: showCancel ? `translateX(-${startX - currentX}px)` : 'none',
              transition: showCancel ? 'none' : 'transform 0.2s ease'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">Recording...</span>
              {showCancel && (
                <div className="text-red-500 text-sm">Release to cancel</div>
              )}
            </div>
          </div>
        ) : (
          <input
            type="text"
            className="flex-1 input input-bordered rounded-full input-sm sm:input-md"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {text.trim() || imagePreview || audioBlob ? (
          <button type="submit" className="text-primary">
            <FaPaperPlane size={20} />
          </button>
        ) : (
          <button 
            type="button" 
            ref={micButtonRef}
            onTouchStart={handleRecordingTouchStart}
            onMouseDown={handleRecordingTouchStart}
            onTouchEnd={handleRecordingTouchEnd}
            onMouseUp={handleRecordingTouchEnd}
            className={`p-2 rounded-full ${isRecording ? 'bg-red-500/20 text-red-500' : 'text-zinc-500'}`}
          >
            <Mic size={22} className={isRecording ? "animate-pulse" : ""} />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;