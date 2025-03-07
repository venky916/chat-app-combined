import React from 'react'
import { IoIosClose } from 'react-icons/io';
const UserBadgeItem = ({user,handleFunction}) => {
  return (
      <div className='px-2 py-2 rounded-lg cursor-pointer bg-sky-400 text-white hover:text-black border-1 flex items-center justify-center' onClick={handleFunction}>
          {user.name} <IoIosClose className='text-2xl'/>
    </div>
  )
}

export default UserBadgeItem