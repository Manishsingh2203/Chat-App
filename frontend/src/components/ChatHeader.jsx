
import {
  Phone,
  Video,
  Search,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // 🔍 Hook this up to chat message search logic
  };

  const handleVoiceCall = () => {
    if (selectedUser) {
      navigate("/voice-call", {
        state: {
          otherUserId: selectedUser._id,
          fullName: selectedUser.fullName,
         
        },
      });
    }
  };
  
  const handleVideoCall = () => {
    if (selectedUser) {
      navigate("/Video-call", { state: 
        { otherUserId: selectedUser._id ,  fullName: selectedUser.fullName,  } 
        
      });
    }
  };

  return (
    <div className="border-b border-base-300 ">
      {/* Top Header */}
      <div className="p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full overflow-hidden">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-base-content">
              {selectedUser.fullName}
            </h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 text-base-content/70">
          <button onClick={handleVoiceCall} className="hover:text-primary">
            <Phone size={20} />
          </button>
          <button onClick={handleVideoCall} className="hover:text-primary">
            <Video size={20} />
          </button>
          <button
            className="hover:text-primary transition-colors"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-3 pb-2 relative">
          <div className="flex items-center gap-2 bg-base-100 border border-base-300 rounded-md px-3 py-1">
            <input
              type="text"
              placeholder="Search within chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  e.preventDefault();
                }
              }}
              className="flex-grow bg-transparent outline-none text-sm py-1"
              ref={inputRef}
            />
            <button title="Previous">
              <ChevronUp size={18} />
            </button>
            <button title="Next">
              <ChevronDown size={18} />
            </button>

            <div className="relative">
              <button onClick={() => setShowCalendar((prev) => !prev)}>
                <CalendarDays size={18} />
              </button>

              {showCalendar && (
                <div className="absolute right-0 z-50 mt-2">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                      console.log("Selected date:", date);
                      // Optionally filter messages by selected date here
                    }}
                    inline
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
