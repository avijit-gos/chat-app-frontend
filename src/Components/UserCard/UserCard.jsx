/** @format */

import { Avatar, Box } from "@chakra-ui/react";
import React from "react";

const UserCard = ({ user, handleClick }) => {
  return (
    <Box className='user_card' onClick={() => handleClick(user)}>
      <Avatar src={user.profilePic} className='user_card_avatar' />
      <span className='user_card_name'>{user.name}</span>
      <span className='user_card_username'>@{user.username}</span>
    </Box>
  );
};

export default UserCard;
