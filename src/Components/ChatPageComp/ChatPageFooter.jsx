/** @format */

import { Box, Button, Input, Img } from "@chakra-ui/react";
import React from "react";
import InputComp from "../InputComp/InputComp";
import {
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineClose,
} from "react-icons/ai";
import { BsEmojiSmile, BsArrowRightCircleFill } from "react-icons/bs";
import ButtonComp from "../ButtonComp/ButtonComp";
import { GlobalContext } from "../../Context/Context";
import memberUser from "../../Utils/memberUser";
import { useSocket, socket } from "../../socket/Socket";
import EmojiPicker from "emoji-picker-react";

const ChatPageFooter = ({ chat, selectChatId }) => {
  const { setMessages, typing, setTyping, isTyping, setIsTyping } =
    GlobalContext();
  const [text, setText] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  useSocket();

  // *** Handle message image file
  const handleImageFileChange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  // *** Handle close preview image
  const handleClosePreviewImage = () => {
    setImage("");
    setPrevImage("");
  };

  // *** Send Message
  const sendMessage = () => {
    setIsLoading(true);
    setIsDisable(true);
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    var formdata = new FormData();
    formdata.append("image", image);
    formdata.append("text", text);
    formdata.append("chatId", chat._id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_BASE_URL}api/message/create`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMessages((prev) => [...prev, result]);
        socket.emit("new message", result);

        setText("");
        setPrevImage("");
        setImage("");
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    if (!text.trim() && !image) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [text, image]);

  const dropDownRef = React.useRef(null);
  const handleClickOutside = (event) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setOpenEmoji(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (event, emojiObject) => {
    // console.log(event.emoji, emojiObject);
    setText((prev) => prev + event.emoji);
  };

  const setInputHandler = (e) => {
    setText(e.target.value);
    if (!typing) {
      // setIsTyping(true);
      socket.emit("typing", chat._id);
    }
    const lastTypeTime = new Date().getTime();
    const timer = 7000;
    setTimeout(() => {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastTypeTime;
      if (timeDifference >= timer && !isTyping) {
        socket.emit("stop typing", chat._id);
      }
    }, timer);
  };

  return (
    <React.Fragment>
      {memberUser(chat.mem, JSON.parse(localStorage.getItem("user"))._id) ? (
        <Box className='chat_footer_section'>
          {/* Preview Image */}
          {image && (
            <Box className='prev_image_section'>
              <Button
                className='close_preview_image'
                onClick={handleClosePreviewImage}>
                <AiOutlineClose />
              </Button>
              <Img src={prevImage} className='chat_preview_image' />
            </Box>
          )}

          {/* Emoji container */}
          {openEmoji && (
            <Box className='emoji_section' ref={dropDownRef}>
              <EmojiPicker
                className='emoji_section'
                height={400}
                width={300}
                onEmojiClick={onEmojiClick}
              />
            </Box>
          )}
          <Box className='chat_page_footer'>
            <InputComp
              type='text'
              placeholder='Message...'
              className='message_input'
              value={text}
              handleChange={(e) => setInputHandler(e)}
            />

            {/* Image Icon */}
            <label htmlFor='image' className='file_label'>
              <AiOutlineFileImage className='file_icon' />
              <Input
                type='file'
                id='image'
                className='file_input'
                onChange={(e) => handleImageFileChange(e)}
              />
            </label>

            {/* File Icon */}
            <label htmlFor='image' className='file_label'>
              <AiOutlineFilePdf className='file_icon' />
              <Input
                type='file'
                id='image'
                className='file_input'
                onChange={(e) => handleImageFileChange(e)}
              />
            </label>

            {/* Emoji Icon */}
            <Box className='file_label' onClick={() => setOpenEmoji(true)}>
              <BsEmojiSmile className='file_icon' />
            </Box>

            {/* Send Icon */}
            <ButtonComp
              text={<BsArrowRightCircleFill />}
              className={"message_send_btn"}
              disableClassName={"disable_message_send_btn"}
              isLoading={isLoading}
              isDisable={isDisable}
              handleClick={sendMessage}
            />
          </Box>
        </Box>
      ) : (
        <Box className='chat_page_footer not_member_text'>
          Only group members can send messages
        </Box>
      )}
    </React.Fragment>
  );
};

export default ChatPageFooter;
