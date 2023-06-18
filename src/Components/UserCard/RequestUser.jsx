/** @format */

import { Box, Avatar } from "@chakra-ui/react";
import React from "react";
import ButtonComp from "../ButtonComp/ButtonComp";
import { BiUserCheck, BiUserX } from "react-icons/bi";
import axios from "axios";

const RequestUser = ({ user, handleClick, chat }) => {
  // *** Accept in group chat
  const handleAcceptGroup = (id, userId) => {
    let data = JSON.stringify({
      userId: userId,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/accept/join/${id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Remove in group chat
  const handleRemoveGroup = (id, userId) => {
    alert(userId);
    let data = JSON.stringify({
      userId: userId,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/remove/join/${id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className='members_card'>
      <Box className='memebers_info'>
        <Avatar src={user.profilePic} className='user_card_avatar' />
        <span className='user_card_name'>{user.name}</span>
        {/* <span className='user_card_username'>@{user.username}</span> */}
      </Box>

      {/* Accept button */}
      <ButtonComp
        text=<BiUserCheck />
        className='accpt_remove_btn'
        isDisable={false}
        isLoading={false}
        handleClick={() => handleAcceptGroup(chat._id, user._id)}
      />

      {/* Remove button */}
      <ButtonComp
        text=<BiUserX />
        className='member_remove_btn'
        isDisable={false}
        isLoading={false}
        handleClick={() => handleRemoveGroup(chat._id, user._id)}
      />
    </Box>
  );
};

export default RequestUser;
