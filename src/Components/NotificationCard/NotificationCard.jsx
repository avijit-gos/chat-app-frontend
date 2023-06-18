/** @format */

import { Avatar, Box, Button } from "@chakra-ui/react";
import React from "react";
import { BiUserCheck, BiUserX } from "react-icons/bi";
import timeDifference from "../../Utils/getTime";
import axios from "axios";

const NotificationCard = ({ data }) => {
  const [isView, setIsView] = React.useState(data.isViewed || false);

  // *** Remove in group chat
  const handleRemoveGroup = (id, userId, notiId) => {
    setIsView(true);
    let data = JSON.stringify({
      userId: userId,
      notiId: notiId,
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
        setIsView(false);
      });
  };

  // *** Accept in group chat
  const handleAcceptGroup = (id, userId, notiId) => {
    setIsView(true);
    let data = JSON.stringify({
      userId: userId,
      notiId: notiId,
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
        setIsView(false);
      });
  };

  return (
    <Box className={isView ? "noti_card active_noti_card" : "noti_card"}>
      <Avatar src={data.sender.profilePic || ""} className='noti_avatar' />
      <Box className='noti_info_box'>
        <span className='sender_name'>{data.sender.name} </span>
        <span className='noti_text'>is wanted to join your </span>
        <span className='noti_chat_name'>{data.chat.name}</span>
        <br />
        <Box className='noti_time'>
          {timeDifference(new Date(), new Date(data.createdAt))}
        </Box>
      </Box>

      {!isView && (
        <Box className='noti_button_group'>
          <Button
            className='noti_btn accept_request'
            onClick={() =>
              handleAcceptGroup(data.chat._id, data.sender._id, data._id)
            }>
            <BiUserCheck />
          </Button>

          <Button
            className='noti_btn remove_request'
            onClick={() =>
              handleRemoveGroup(data.chat._id, data.sender._id, data._id)
            }>
            <BiUserX />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NotificationCard;
