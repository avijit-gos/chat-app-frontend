/** @format */

import React from "react";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Img,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { RiMoreLine } from "react-icons/ri";
import timeDifference from "../../Utils/getTime";
import ModalComp from "../ModalComp/ModalComp";
import { AiOutlineClose } from "react-icons/ai";
import ButtonComp from "../ButtonComp/ButtonComp";
import { GlobalContext } from "../../Context/Context";
import TextareaComp from "../InputComp/TextareaComp";
import axios from "axios";

const MessageCard = ({ message, chat }) => {
  const toast = useToast();
  const { setMessages, messages } = GlobalContext();
  const [text, setText] = React.useState(message.text || "");
  const [image, setImage] = React.useState(message.image || "");
  const [toggle, setToggle] = React.useState(false);
  const [messageId, setMessageId] = React.useState("");

  // *** profile state modal
  const [openVisitModal, setOpenVisitModal] = React.useState(false);

  // *** Message Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [loadingDeleteBtn, setLoadingDeleteBtn] = React.useState(false);

  // *** Message Edit modal state
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [content, setContent] = React.useState(message.text || "");
  const [loadingEditBtn, setLoadingEditBtn] = React.useState(false);

  // *** Handle close modal
  const handleCloseModal = () => {
    setMessageId("");
    setOpenVisitModal(false);
    setOpenDeleteModal(false);
    setOpenEditModal(false);
    setContent(message.text || "");
  };

  // *** Handle open DELETE modal
  const handleOpenDeleteModal = (id) => {
    setMessageId(id);
    setOpenDeleteModal(true);
  };

  // *** Handle delete message
  const handleDeleteMessage = () => {
    setLoadingDeleteBtn(true);
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/message/delete/${messageId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        const temp = messages;
        const data = temp.filter((result) => result._id !== messageId);
        setMessages(data);
        toast({
          title: "Success",
          description: `${response.msg}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: `${error.response.data.error.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setOpenDeleteModal(false);
      });
  };

  // *** Handle open message Edit modal
  const handleOpenEditModal = (id) => {
    setMessageId(id);
    setOpenEditModal(true);
  };

  // *** Handle EDIT message
  const handleUpdateMessage = () => {
    setLoadingEditBtn(true);
    setText(content);
    let data = JSON.stringify({
      content: content,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/message/edit/${messageId}`,
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
        setLoadingEditBtn(false);
        toast({
          title: "Success",
          description: `${response.data.msg}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setOpenEditModal(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: `${error.response.data.error.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Box
      className={
        JSON.parse(localStorage.getItem("user"))._id === message.sender._id
          ? "message_card_section my_message"
          : "message_card_section"
      }>
      {/* Visit profile modal */}
      {openVisitModal && (
        <ModalComp
          isOpen={openVisitModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>View profile</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='message_modal_body'>
              <Avatar
                src={message.sender.profilePic}
                className='modal_avatar'
              />
              <Box className='modal_sender_name'>{message.sender.name}</Box>
              <Box className='modal_sender_bio'>
                {message.sender.bio || "Profile bio did not set by user"}
              </Box>
            </Box>
          }
        />
      )}

      {/* Delete Message modal */}
      {openDeleteModal && (
        <ModalComp
          isOpen={openDeleteModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Delete message</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='message_body_text'>
              Do you want to delete this message?{" "}
            </Box>
          }
          footer={
            <ButtonComp
              text='Delete'
              className='delete_btn'
              isLoading={loadingDeleteBtn}
              isDisable={false}
              handleClick={handleDeleteMessage}
            />
          }
        />
      )}

      {/* Edit Message modal */}
      {openEditModal && (
        <ModalComp
          isOpen={openEditModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Edit message</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='edit_modal_body'>
              <TextareaComp
                type='text'
                placeholder='Update your message'
                className='textarea_input'
                value={content}
                handleChange={(e) => setContent(e.target.value)}
              />
            </Box>
          }
          footer={
            <Box className='modal_footer'>
              <ButtonComp
                text='Update'
                className='modal_btn'
                disableClassName='disable_modal_btn'
                isLoading={loadingEditBtn}
                isDisable={text === content}
                handleClick={handleUpdateMessage}
              />
            </Box>
          }
        />
      )}
      <Box>
        <Box
          className={
            JSON.parse(localStorage.getItem("user"))._id === message.sender._id
              ? "message_card"
              : "message_card other_message_card"
          }>
          {/* Message Header */}
          <Box className='message_card_header'>
            {chat.isGroup && (
              <>
                {JSON.parse(localStorage.getItem("user"))._id !==
                  message.sender._id && (
                  <span className='message_name'>{message.sender.name}</span>
                )}
              </>
            )}
          </Box>

          {/* Message body */}
          <Box className='message_body'>
            <Box className='message_body_text'>
              {text.length > 200 ? (
                <>
                  {toggle ? (
                    <>
                      {text} ...
                      <button
                        className='read_more_btn'
                        onClick={() => setToggle(false)}>
                        read less
                      </button>
                    </>
                  ) : (
                    <>
                      {text.slice(0, 200)} ...
                      <button
                        className='read_more_btn'
                        onClick={() => setToggle(true)}>
                        read more
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>{text}</>
              )}
            </Box>
            {image && <Img src={image} className='message_body_image' />}
          </Box>

          {/* Message footer */}
        </Box>
        <Box className='message_time'>
          <span className='message_time'>
            {timeDifference(new Date(), new Date(message.createdAt))}
          </span>
        </Box>
      </Box>

      {chat.isGroup && (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<RiMoreLine />}
            className='message_menu_btn'></MenuButton>
          <MenuList>
            {JSON.parse(localStorage.getItem("user"))._id ===
              message.sender._id && (
              <MenuItem
                className='menu_item'
                onClick={() => handleOpenEditModal(message._id)}>
                Edit
              </MenuItem>
            )}

            {JSON.parse(localStorage.getItem("user"))._id !==
              message.sender._id && (
              <MenuItem
                className='menu_item'
                onClick={() => setOpenVisitModal(true)}>
                Visit profile
              </MenuItem>
            )}
            {/* <MenuItem className='menu_item'>Pinn</MenuItem> */}

            {JSON.parse(localStorage.getItem("user"))._id ===
              message.sender._id && (
              <MenuItem
                className='menu_item delete'
                onClick={() => handleOpenDeleteModal(message._id)}>
                Delete
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
    </Box>
  );
};

export default MessageCard;
