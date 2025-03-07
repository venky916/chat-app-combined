import React, { useEffect, useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatState } from '@/context/ChatProvider';
import ProfileModal from '../user/ProfileModal';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../user/UserListItem';
import Spinner from './Spinner';
import { generateRandomColor, getInitials, getSender } from '@/utils/helper';
import NotificationBadge from './NotificationBadge';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Control Sheet state

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    setUser,
  } = ChatState();
  const navigate = useNavigate();
  const { toast } = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        description: 'Please enter something to search',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      // console.log(searchResult)
    } catch (error) {
      toast({
        description: 'Failed to load the search results',
      });
    } finally {
      setLoading(false); // This will run whether or not the try block succeeds
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      // console.log(data);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([...chats, data]);
      }

      setLoadingChat(false);
      setSelectedChat(data);
      setIsSheetOpen(false);
    } catch (error) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-between items-center bg-white w-full px-1 py-2 border-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
              <FaSearch /> <p className="hidden md:block"> Search User</p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search Users to chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <h1 className="text-2xl font-workSans">Let's Chat</h1>
      <div className="flex items-center space-x-1">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <NotificationBadge count={notification.length} />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                {!notification.length && 'No New Messages'}
              </MenubarItem>
              {notification.map((notify) => (
                <>
                  <MenubarItem
                    key={notify._id}
                    onClick={() => {
                      setSelectedChat(notify.chat);
                      setNotification(notification.filter((n) => n !== notify));
                    }}
                  >
                    {notify.chat.isGroupChat
                      ? `New Message in ${notify.chat.name}`
                      : `New Message from ${getSender(user, notify.chat.users)}`}
                  </MenubarItem>
                  <MenubarSeparator />
                </>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Menubar>
          <MenubarMenu className="py-3">
            <MenubarTrigger>
              <Avatar>
                <AvatarImage
                  src={user.photoUrl}
                  className="hover:rounded-full rounded-full"
                />
                <AvatarFallback
                  style={{
                    backgroundColor: generateRandomColor(),
                    color: '#FFF', // Ensure the initials are visible
                  }}
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <FaChevronDown />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setIsProfileOpen(true)}>
                Profile
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={logoutHandler}>Logout</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Search Users</SheetTitle>
          </SheetHeader>
          <Separator className="my-2" />
          <div className="flex w-full max-w-sm items-center space-x-2 ">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search by name or email"
            />
            <Button type="button" onClick={handleSearch}>
              Go
            </Button>
          </div>
          {loadingChat && <Spinner />}
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SideDrawer;
