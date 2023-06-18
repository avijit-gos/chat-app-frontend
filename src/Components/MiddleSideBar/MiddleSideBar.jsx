/** @format */

import { Box } from "@chakra-ui/react";
import React from "react";
import { GlobalContext } from "../../Context/Context";
import axios from "axios";
import MessageSekeleton from "../Skeleton/MessageSekeleton";
import ChatPageHeader from "../ChatPageComp/ChatPageHeader";
import ChatPageBody from "../ChatPageComp/ChatPageBody";
import ChatPageFooter from "../ChatPageComp/ChatPageFooter";
import io from "socket.io-client";
import { useSocket, socket, isConnected } from "../../socket/Socket";

const MiddleSideBar = () => {
  const { selectChatId, setSelectChatId } = GlobalContext();
  const [chat, setChat] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useSocket();

  // *** Fetch chat details
  React.useEffect(() => {
    if (selectChatId) {
      setIsLoading(true);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/chat/${selectChatId}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          // console.log(response.data);
          setChat(response.data);
          socket.emit("join chat", response.data._id);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectChatId]);

  return (
    <Box className='middle_section'>
      {selectChatId && chat ? (
        <Box>
          {isLoading ? (
            <MessageSekeleton />
          ) : (
            <>
              <ChatPageHeader chat={chat} setSelectChatId={setSelectChatId} />
              <ChatPageBody chat={chat} />
              <ChatPageFooter chat={chat} selectChatId={selectChatId} />
            </>
          )}
        </Box>
      ) : (
        <Box className='empty_select_chat'>No chat has been selected</Box>
      )}
    </Box>
  );
};

export default MiddleSideBar;
