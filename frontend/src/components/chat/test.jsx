// {chats ? (
//             <div className="overflow-y-scroll">
//               {chats.map((chat) => {
//                 const lastMessage = chat.latestMessage || {};
//                 const isOnline = !chat.isGroupChat && isUserOnline(getSender(user, chat.users)._id);

//                 return (
//                   <div
//                     key={chat._id}
//                     onClick={() => setSelectedChat(chat)}
//                     className={`cursor-pointer my-2 px-3 py-2 rounded-lg ${selectedChat === chat ? 'bg-[#38B2AC] text-white' : 'bg-[#E8E8E8] text-black'}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <h1 className="font-bold">
//                         {!chat.isGroupChat
//                           ? getSender(user, chat.users).name
//                           : chat.chatName}
//                       </h1>
//                       {isOnline && (
//                         <span className="relative flex h-3 w-3">
//                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                           <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center mt-1">
//                       {lastMessage.sender?.avatar && (
//                         <img
//                           src={lastMessage.sender.avatar}
//                           alt="User Avatar"
//                           className="h-6 w-6 rounded-full mr-2"
//                         />
//                       )}
//                       <p className="text-sm truncate">
//                         {lastMessage.content || 'No messages yet'}
//                       </p>
//                     </div>
//                     {lastMessage.createdAt && (
//                       <p className="text-xs text-gray-500 mt-1">
//                         {format(new Date(lastMessage.createdAt), 'hh:mm a')} {/* Use 'HH:mm' for 24-hour format */}
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}