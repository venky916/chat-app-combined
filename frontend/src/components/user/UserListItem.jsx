import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      className="bg-[#E8E8E8] hover:bg-[#38B2AC] hover:text-white w-full flex items-center text-black px-1 py-[1px]  rounded-lg hover:cursor-pointer"
      onClick={() => handleFunction(user._id)}
    >
      <Avatar>
        <AvatarImage
          src={user.photoUrl}
          alt={user.name}
          className="cursor-pointer rounded-sm mr-1 "
        />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      <div>
        <p>{user.name}</p>
        <p className="text-sm">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
