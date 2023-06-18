/** @format */

import { Box } from "@chakra-ui/react";
import React from "react";
import { GlobalContext } from "../../Context/Context";
import axios from "axios";
import MessageCard from "../MessageCard/MessageCard";
import memberUser from "../../Utils/memberUser";
import { useSocket, socket } from "../../socket/Socket";
import useSound from "use-sound";
import MessageTone from "../../Assets/berdie.mp3";
import lottie from "lottie-web";
import Typing from "../../Assets/typing.json";

const ChatPageBody = ({ chat }) => {
  const {
    messages,
    selectChatId,
    setMessages,
    setReciveMessageChatId,
    isTyping,
  } = GlobalContext();
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [play] = useSound(MessageTone);
  useSocket();

  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#typing-logo"),
      animationData: Typing,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }, []);

  const bottomRef = React.useRef(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // *** Fetch all chat messages
  React.useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/message/${selectChatId}?page=${page}&limit=${limit}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (page === 0) {
          scrollToBottom();
          setMessages(response.data);
        } else {
          console.log(response.data);
          setMessages((prev) => [...response.data, ...prev]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  React.useEffect(() => {
    if (page === 0) {
      scrollToBottom();
    }
    socket
      .off("message recieved")
      .on("message recieved", (newMessageReceived) => {
        if (!selectChatId || selectChatId !== newMessageReceived.chatId._id) {
          // Give message notification
          console.log("GIVE NOTI");
          setReciveMessageChatId((prev) => [
            ...prev,
            newMessageReceived.chatId._id,
          ]);
          play();
        } else {
          setMessages((prev) => [...prev, newMessageReceived]);
          scrollToBottom();
        }
      });
  });

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      console.log("Page incremented");
      setPage((prev) => prev + 1);
    }
  };

  return (
    <React.Fragment>
      {chat.msg_prvacy === "all" ? (
        <Box className='chat_page_body_section'>
          <Box className='chat_page_body' onScroll={(e) => handleScroll(e)}>
            {(messages || []).length > 0 ? (
              <>
                {messages.map((data) => (
                  <Box key={data._id}>
                    <MessageCard message={data} chat={chat} />
                  </Box>
                ))}
              </>
            ) : (
              <Box className='empty_message'>No message found</Box>
            )}
            <Box ref={bottomRef} />
          </Box>
        </Box>
      ) : (
        <React.Fragment>
          {memberUser(
            chat.mem,
            JSON.parse(localStorage.getItem("user"))._id
          ) ? (
            <Box className='chat_page_body_section'>
              <Box className='chat_page_body' onScroll={(e) => handleScroll(e)}>
                {(messages || []).length > 0 ? (
                  <>
                    {messages.map((data) => (
                      <Box key={data._id}>
                        <MessageCard message={data} chat={chat} />
                      </Box>
                    ))}
                  </>
                ) : (
                  <Box className='empty_message'>No message found</Box>
                )}
                <Box ref={bottomRef} />
              </Box>
            </Box>
          ) : (
            <Box className='chat_page_body not_member_text'>
              This is a private group
            </Box>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ChatPageBody;
