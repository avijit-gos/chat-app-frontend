/** @format */

import { Box, Avatar } from "@chakra-ui/react";
import React from "react";
import ButtonComp from "../ButtonComp/ButtonComp";
import { BiUserX } from "react-icons/bi";

const MemebsrsCard = ({ user, handleClick, chat }) => {
  return (
    <Box className='members_card'>
      <Box className='memebers_info'>
        <Avatar src={user.profilePic} className='user_card_avatar' />
        <span className='user_card_name'>{user.name}</span>
        {/* <span className='user_card_username'>@{user.username}</span> */}
      </Box>
      {chat.creator !== user._id && (
        <ButtonComp
          text=<BiUserX />
          className='member_remove_btn'
          isDisable={false}
          isLoading={false}
          handleClick={() => handleClick(user._id)}
        />
      )}
    </Box>
  );
};

export default MemebsrsCard;
