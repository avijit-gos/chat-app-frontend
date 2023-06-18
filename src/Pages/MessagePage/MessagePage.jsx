/** @format */

import React from "react";
import { GlobalContext } from "../../Context/Context";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import MessageSekeleton from "../../Components/Skeleton/MessageSekeleton";
import ChatPageHeader from "../../Components/ChatPageComp/ChatPageHeader";
import ChatPageBody from "../../Components/ChatPageComp/ChatPageBody";
import ChatPageFooter from "../../Components/ChatPageComp/ChatPageFooter";
import { useSocket, socket, isConnected } from "../../socket/Socket";

const MessagePage = () => {
  const { selectChatId, setSelectChatId } = GlobalContext();
  const [chat, setChat] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [socketConnected, setSocketConnected] = React.useState(false);
  const { id } = useParams();

  useSocket();

  // *** Fetch chat details
  React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/chat/${id}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setSelectChatId(id);
          setChat(response.data);
          socket.emit("join chat", response.data._id);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  return (
    <Box className='message_page_section'>
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

export default MessagePage;
