

import { MessageSquare, Plus } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full flex flex-1  min-h-[calc(100vh-64px)] bg-base-100/50 p-4 sm:p-6">
      <div className="text-center max-w-md space-y-4 sm:space-y-6 animate-fade-in">
        {/* Icon with subtle animation */}
        <div className="flex justify-center ml-[-55px] ">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-lg animate-float">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
          </div>
        </div>

<h2 className="text-2xl sm:text-3xl font-extrabold">
  <span className="text-transparent  bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#EC4899] to-[#F59E0B] animate-gradient bg-[length:200%_200%]">
    Hello
  </span>
  <span> 👋</span>
</h2>


<p className="text-sm sm:text-base leading-relaxed tracking-wide max-w-prose mx-auto">
  
  
  <span className="
  block mt-3 sm:mt-4 
  text-sm sm:text-base lg:text-lg
  italic
  font-medium
  bg-gradient-to-r
 from-blue-500 via-indigo-500 to-purple-500
  bg-clip-text
  text-transparent
  animate-gradient-flow
  tracking-wide
  px-1
  transition-all
  duration-500
  hover:scale-[1.02]
  hover:tracking-wider
">
  Stay connected with your team and friends in real-time.
</span>

</p>
        {/* CTA with icon and better hover effects */}
       
       
  <button className="btn btn-primary btn-50 rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 group">
    <span className="flex items-center gap-2">
      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
      Start New Chat
    </span>
  </button>


        {/* Optional decorative elements */}
        <div className="hidden sm:block opacity-10">
          <div className="absolute bottom-10 left-1/4 w-16 h-16 rounded-full bg-primary blur-xl"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-secondary blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;