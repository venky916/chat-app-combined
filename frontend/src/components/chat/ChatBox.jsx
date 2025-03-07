import { ChatState } from '@/context/ChatProvider';
import React from 'react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { chats, selectedChat } = ChatState();
  return (
    <div
      className={`${selectedChat ? 'flex ' : 'hidden'} md:flex flex-col w-full md:w-2/3  items-center rounded-lg border-1 p-2 bg-white  `}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
