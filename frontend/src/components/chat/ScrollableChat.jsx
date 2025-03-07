import { ChatState } from '@/context/ChatProvider';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '@/utils/helper';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg, idx) => (
          <div key={msg._id} className="flex">
            {(isSameSender(messages, msg, idx, user._id) ||
              isLastMessage(messages, idx, user._id)) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src={msg.sender.photoUrl}
                        alt={msg.sender.name}
                        className="cursor-pointer rounded-sm mr-1 "
                      />
                      <AvatarFallback>{msg.sender.name}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white bg-transparent">
                      {msg.sender.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span
              className={`
                ${msg.sender._id === user._id ? 'bg-[#bee3f8]' : 'bg-[#b9f5d0]'} 
              rounded-md px-2 py-1 max-w-sm
               ml-${isSameSenderMargin(messages, msg, idx, user._id)} 
               mt-[${isSameUser(messages, msg, idx) ? 3 : 10}]`}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
