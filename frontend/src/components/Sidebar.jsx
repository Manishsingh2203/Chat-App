
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const isOnline = onlineUsers.includes(user._id);
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return (showOnlineOnly ? isOnline : true) && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full  px-5 py-4 ">
        <div className="flex items-center  gap-2 mb-2">
        <Users className="size-5 " />
          <span className="font-semibold hidden lg:block text-xl">Chats</span>

        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 mb-3">
  <div className="relative w-full">
    <Search className="absolute left-2 top-2.5 size-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search or Communicate"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
    />
  </div>
</div>


        {/* Online Filter */}
        <div className="hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            Show online only
          </label>
          <span className="text-xs text-gray-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-2 px-1 flex-1 scrollbar-thin scrollbar-thumb-gray-300">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`group w-full flex items-center gap-4 px-3 py-2 rounded-lg transition-all duration-150 
                hover:bg-base-200 ${isSelected ? "ring-1 ring-primary" : ""}`}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* User Info */}
              <div className="hidden lg:block text-left flex-1 min-w-0">
                <p className="font-medium text-sm text-white-800 truncate">{user.fullName}</p>
                <p className={`text-xs ${isOnline ? "text-green-500" : "text-white-400"}`}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
