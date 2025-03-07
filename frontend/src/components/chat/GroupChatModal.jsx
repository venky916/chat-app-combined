import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ChatState } from '@/context/ChatProvider';
import { Input } from '@/components/ui/input';

import axios from 'axios';
import UserListItem from '../user/UserListItem';
import Spinner from '../miscellaneous/Spinner';
import UserBadgeItem from '../user/UserBadgeItem';

const GroupChatModal = ({ isOpen, onClose }) => {
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (name) => {
    const query = name.trim();
    setSearch(query);
    if (!query) {
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
      //   console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: error.message,
        description: 'Failed to Load the Search Results',
        variant: 'destructive',
      });
    }
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        description: 'User already added',
        variant: 'destructive',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (user) => {
    const users = selectedUsers.filter((u) => u._id !== user._id);
    setSelectedUsers(users);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        description: 'Please fill all the fields',
        variant: 'destructive',
      });

      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: selectedUsers,
        },
        config,
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        description: 'New Group Chat Created',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: error.message,
        description: 'Something went wrong',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="dialog-description"
      >
        <DialogHeader className="flex justify-center items-center m-5">
          <DialogTitle className="text-4xl font-workSans">
            Create Group Chat
          </DialogTitle>
          <DialogDescription id="dialog-description"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <Input
            type="text"
            placeholder="Chat Name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Add Users eg: John, Piyush, Jane"
            value={search}
            onChange={ (e) => handleSearch(e.target.value) }
            className="mt-2"
          />
        </div>
        <div className="flex flex-wrap">
          {selectedUsers.map((user) => (
            <UserBadgeItem
              key={user._id}
              user={user}
              handleFunction={() => handleDelete(user)}
            />
          ))}
        </div>
        {loading ? (
          <Spinner />
        ) : (
          searchResults
            ?.slice(0, 4)
            .map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleGroup(user)}
              />
            ))
        )}
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleSubmit}>
            Create Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
