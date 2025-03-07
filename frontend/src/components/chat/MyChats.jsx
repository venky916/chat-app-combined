import { ChatState } from '@/context/ChatProvider';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { IoAddOutline } from 'react-icons/io5';
import ChatLoading from '../miscellaneous/ChatLoading';
import { formatDateWithOrdinal, getSender, getSenderId } from '@/utils/helper';
import GroupChatModal from './GroupChatModal';
import { useSocket } from '@/context/SocketProvider';

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { toast } = useToast();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/chat`,
        config,
      );
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchChats();
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });
  }, [fetchAgain]);

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  // console.log(chats,selectedChat)

  return (
    <>
      <div
        className={`${selectedChat ? 'hidden' : 'flex'} md:flex flex-col p-3  bg-white w-full  md:w-1/3 rounded-lg border-1 `}
      >
        <div className="pb-3 px-3 text-[25px] md:text-[28px]  font-workSans flex w-full justify-between items-center">
          My Chats
          <Button onClick={() => setIsGroupModalOpen(true)}>
            New Group Chat <IoAddOutline />
          </Button>
        </div>
        <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-y-hidden">
          {chats ? (
            <div className="overflow-y-scroll ">
              {chats.map((chat) => {
                const lastMessage = chat.latestMessage;
                const senderId = getSenderId(user, chat.users);
                const isOnline = !chat.isGroupChat && isUserOnline(senderId);
                return (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`cursor-pointer my-2 px-3 py-2 rounded-lg ${selectedChat === chat ? 'bg-[#38B2AC] text-white' : 'bg-[#E8E8E8] text-black'}`}
                  >
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold">
                        {!chat.isGroupChat
                          ? getSender(user, chat.users)
                          : chat.chatName}
                      </h1>
                      {isOnline && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-2">
                        <img
                          src={lastMessage?.sender?.photoUrl}
                          alt="User Avatar"
                          className="h-6 w-6 rounded-full mr-2"
                        />
                        <p className="text-sm truncate">
                          {lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {lastMessage?.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateWithOrdinal(lastMessage?.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ChatLoading />
          )}
        </div>
      </div>
      <GroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </>
  );
};

export default MyChats;
