/** @format */

import React from "react";
import { Box, Avatar } from "@chakra-ui/react";
import { checkUser } from "../../Utils/checkUser";
import { GlobalContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { useSocket, socket } from "../../socket/Socket";
import useSound from "use-sound";
import MessageTone from "../../Assets/berdie.mp3";
const ChatComp = ({ chat }) => {
  useSocket();
  const navigate = useNavigate();
  const [play] = useSound(MessageTone);
  const {
    selectChatId,
    setSelectChatId,
    reciveMessageChatId,
    setReciveMessageChatId,
  } = GlobalContext();
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    // console.log(window.innerWidth);
    setWidth(window.innerWidth);
  }, [width]);

  const handleSelectChat = (id) => {
    const arr = reciveMessageChatId;
    const temp = arr.filter((data) => data !== id);
    setReciveMessageChatId(temp);
    if (window.innerWidth > 780) {
      setSelectChatId(id);
    } else {
      navigate(`/message/${id}`);
    }
  };

  // *** message notification system
  React.useEffect(() => {
    socket
      .off("message recieved")
      .on("message recieved", (newMessageReceived) => {
        if (!selectChatId || selectChatId !== newMessageReceived.chatId._id) {
          // Give message notification notification
          console.log("Give message notification notification");
          setReciveMessageChatId((prev) => [
            ...prev,
            newMessageReceived.chatId._id,
          ]);
          play();
        }
      });
  });

  return (
    <React.Fragment>
      {chat.isGroup ? (
        <Box
          className={selectChatId === chat._id ? " select_chat" : "chat_card"}
          onClick={() => handleSelectChat(chat._id)}>
          <Avatar src={chat.profilePic} className='chat_card_avatar' />
          <Box className='chat_card_box'>
            <span className='chat_card_name'>{chat.name}</span>
            <br />
            <span className='chat_card_message'>
              {chat.latestMsg ? chat.latestMsg.text.slice(0, 50) : ""}
            </span>

            {/* If new message receive then only this indicator will show */}
            {reciveMessageChatId.includes(chat._id) && (
              <Box className='receive_new_chat'></Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          className={selectChatId === chat._id ? " select_chat" : "chat_card"}
          onClick={() => handleSelectChat(chat._id)}>
          <Avatar
            src={
              checkUser(chat.mem, JSON.parse(localStorage.getItem("user")))
                .profilePic
            }
            className='chat_card_avatar'
          />
          <Box className='chat_card_box'>
            <span className='chat_card_name'>
              {
                checkUser(chat.mem, JSON.parse(localStorage.getItem("user")))
                  .name
              }
            </span>
            <br />
            <span className='chat_card_message'>
              {chat.latestMsg ? chat.latestMsg.text.slice(0, 50) : ""}
            </span>

            {/* If new message receive then only this indicator will show */}
            {reciveMessageChatId.includes(chat._id) && (
              <Box className='receive_new_chat'></Box>
            )}
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ChatComp;
