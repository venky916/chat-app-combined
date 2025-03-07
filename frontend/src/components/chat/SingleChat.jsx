import { ChatState } from '@/context/ChatProvider';
import { getSender, getSenderFull } from '@/utils/helper';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaRegEye } from 'react-icons/fa6';
import ProfileModal from '../user/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { AiFillRightCircle } from 'react-icons/ai';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Spinner from '../miscellaneous/Spinner';
import ScrollableChat from './ScrollableChat';
import animationData from '../../animations/typing.json';

import Lottie from 'react-lottie';
import { useSocket } from '@/context/SocketProvider';

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    notification,
    setNotification,
  } = ChatState();
  const { socket } = useSocket();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGroupModal, setIsGroupModal] = useState(false);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const [socketConnected, setSockedConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserverAspectRation: 'xMidYMid slice',
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'error Occurred',
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config,
        );
        setNewMessage('');
        // setMessages((prevMessages) => [...prevMessages, data]); // Add the new message
        setMessages([...messages, data]);
        socket.emit('new message', data); // Emit to other users
        // console.log(messages);
      } catch (error) {
        toast({
          title: 'Error Occurred!',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3 * 1000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      // var timeNow2 = new Date().now();
      // console.log(timeNow, timeNow2);
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket.emit('setup', user);
    socket.on('connected', () => {
      setSockedConnected(true);
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    console.log('checking fetch messages');
  }, [selectedChat]);
  // console.log(notification, '-------------------------------')

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes[newMessageReceived]) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <div className="text-[24px] md:test-[30px] px-2 pb-3 w-full font-workSans flex justify-between items-center">
            <FaArrowLeft
              className="flex md:hidden "
              onClick={() => setSelectedChat(null)}
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}
                <FaRegEye onClick={() => setIsGroupModal(true)} />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                <FaRegEye onClick={() => setIsProfileOpen(true)} />
              </>
            )}
          </div>
          <div className="flex flex-col gap-1 justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-y-hidden">
            {loading ? (
              <Spinner />
            ) : (
              <div className="flex flex-col overflow-y-scroll ">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping && (
              <div className="mr-auto mt-2">
                <Lottie width={70} options={defaultOptions} />
              </div>
            )}
            <div
              className="flex w-full items-center space-x-2"
              onKeyDown={sendMessage}
            >
              <Input
                type="text"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                className="bg-white text-black font-workSans"
              />
              <Button
                onClick={() => {
                  if (newMessage) {
                    sendMessage({ key: 'Enter' }); // Simulate an "Enter" keypress
                  }
                }}
              >
                <AiFillRightCircle />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-3xl font-workSans pb-3">
            Click on a user to start chatting
          </p>
        </div>
      )}
      {selectedChat && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={getSenderFull(user, selectedChat?.users)}
        />
      )}
      <UpdateGroupChatModal
        isOpen={isGroupModal}
        onClose={() => setIsGroupModal(false)}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        fetchMessages={fetchMessages}
      />
    </>
  );
};

export default SingleChat;
