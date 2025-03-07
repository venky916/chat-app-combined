import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChatState } from '@/context/ChatProvider';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Spinner from '../miscellaneous/Spinner';
import axios from 'axios';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../user/UserBadgeItem';

const UpdateGroupChatModal = ({
  isOpen,
  onClose,
  fetchMessages,
  fetchAgain,
  setFetchAgain,
}) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { toast } = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config,
      );
      // console.log(data._id);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: error.message,
      });
      setRenameLoading(false);
    }
    setGroupChatName('');
  };

  const handleSearch = async (query) => {
    setSearch(query.trim());
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user?search=${search}`,
        config,
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        description: error.message,
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (addingUser) => {
    if (selectedChat.users.find((u) => u._id === addingUser._id)) {
      toast({
        title: 'User Already in group!',
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group-add`,
        {
          chatId: selectedChat._id,
          userId: addingUser._id,
        },
        config,
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: error.message,
      });
      setLoading(false);
    }
  };

  const handleRemove = async (removingUser) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can remove someone!',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group-remove`,
        {
          chatId: selectedChat._id,
          userId: removingUser._id,
        },
        config,
      );
      removingUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred!',
      });
      setLoading(false);
    }
  };
  console.log(selectedChat?.groupAdmin)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="justify-center font-workSans text-[35px]">
            {selectedChat?.chatName}
            <h1 className="flex justify-start font-normal">
              Admin:
              <span className=" ml-2 font-bold text-sky-400">
                {selectedChat?.groupAdmin?.name}
              </span>
            </h1>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="w-full flex flex-wrap gap-1 ">
            {selectedChat &&
              selectedChat?.users &&
              selectedChat?.users.map(
                (u) =>
                  u?._id !== user._id && (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleRemove(u)}
                    />
                  ),
              )}
          </div>
          <div className="flex w-full  items-center space-x-2">
            <Input
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button type="button" onClick={handleRename}>
              Update
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Add User to group"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <Spinner />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            onClick={() => handleRemove(user)}
            className="bg-red-500"
          >
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroupChatModal;
