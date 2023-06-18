/** @format */

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineMoreVert } from "react-icons/md";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { BiUserCheck } from "react-icons/bi";
import {
  AiOutlineClose,
  AiOutlineCamera,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { checkUser } from "../../Utils/checkUser";
import React from "react";
import { useNavigate } from "react-router-dom";
import ModalComp from "../ModalComp/ModalComp";
import InputComp from "../InputComp/InputComp";
import TextareaComp from "../InputComp/TextareaComp";
import ButtonComp from "../ButtonComp/ButtonComp";
import MemebsrsCard from "../UserCard/MemebsrsCard";
import UserSkeleton from "../Skeleton/UserSkeleton";
import axios from "axios";
import AddMemberCard from "../UserCard/AddMemberCard";
import memberUser from "../../Utils/memberUser";
import RequestUser from "../UserCard/RequestUser";
import { BiRadioCircleMarked, BiRadioCircle } from "react-icons/bi";
import { useSocket, socket } from "../../socket/Socket";
import { GlobalContext } from "../../Context/Context";

const ChatPageHeader = ({ chat, setSelectChatId }) => {
  const toast = useToast();
  const { isTyping, setIsTyping } = GlobalContext();
  const [chatId, setChatId] = React.useState(chat._id);
  const [name, setName] = React.useState(chat.name);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bio, setBio] = React.useState(chat.bio);
  const [profilePic, setProfilePic] = React.useState(chat.profilePic);
  const [members, setMemebers] = React.useState(chat.mem);
  const [isUserLoading, setUserIsLoading] = React.useState(false);
  const [messagePrivacy, setMessagePrivacy] = React.useState(
    chat.msg_prvacy || "all"
  );

  // *** Updating state
  const [updatedName, setUpdatedName] = React.useState(chat.name);
  const [updatedBio, setUpdatedBio] = React.useState(chat.bio);
  const [updatedProfilePic, setUpdatedProfilePic] = React.useState(
    chat.profilePic
  );
  const [PrevImage, setPrevImage] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [joinusers, setJoinUsers] = React.useState([]);
  const [requestToJoin, setRequestToJoin] = React.useState(
    chat.request.includes(JSON.parse(localStorage.getItem("user"))._id)
  );

  // *** Modal state
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openGroupModal, setOpenGroupModal] = React.useState(false);
  const [openMemberModal, setOpenMemberModal] = React.useState(false);
  const [openNewMemberModal, setOpenNewMemberModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openJoinRequestModal, setOpenJoinRequestModal] = React.useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = React.useState(false);
  const [openLeaveGroupModal, setOpenLeaveGroupModal] = React.useState(false);

  const navigate = useNavigate();
  useSocket();

  // *** Handle close modal
  const handleCloseModal = () => {
    setOpenEditModal(false);
    setOpenGroupModal(false);
    setOpenMemberModal(false);
    setOpenNewMemberModal(false);
    setOpenDeleteModal(false);
    setOpenJoinRequestModal(false);
    setOpenPrivacyModal(false);
    setOpenLeaveGroupModal(false);
  };
  // *** Back to chat page
  const handleBackeToChat = () => {
    setSelectChatId("");
    if (window.innerWidth <= 780) {
      navigate("/");
      setSelectChatId("");
    }
  };

  // *** Handle open edit modal
  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  // *** Handle change input image
  const handleImageChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setUpdatedProfilePic(e.target.files[0]);
  };

  React.useEffect(() => {
    if (chat.isGroup) {
      if (!updatedName.trim() || (updatedName === name && bio === updatedBio)) {
        setIsDisable(true);
      } else {
        setIsDisable(false);
      }
    }
  }, [updatedName, PrevImage, updatedBio]);

  // *** Handle update chat
  const handleUpdateChat = () => {
    setIsLoading(true);
    setIsDisable(true);
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    var formdata = new FormData();
    formdata.append("image", updatedProfilePic);
    formdata.append("name", updatedName);
    formdata.append("bio", updatedBio);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_BASE_URL}api/chat/update/${chatId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          toast({
            title: "Error",
            description: `${result.error.message}`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success",
            description: `${result.msg}`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setName(result.data.name);
          setProfilePic(result.data.profilePic);
          setBio(result.data.bio);
          setUpdatedProfilePic(result.data.profilePic);
          setUpdatedName(result.data.name);
          setUpdatedBio(result.data.bio);
          setIsLoading(true);
          setOpenEditModal(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  // *** Remove user fronm chat group
  const handleRemoveUser = (userId) => {
    let data = JSON.stringify({
      userId: userId,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/remove/members/${chatId}`,
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
        const temp = members;
        const arr = temp.filter((data) => data._id !== response.data.user._id);
        setMemebers(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle search user
  React.useEffect(() => {
    if (search.trim()) {
      setUserIsLoading(true);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/user/search/user?search=${search}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setUsers(response.data);
          setUserIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [search]);

  // *** Handle delete chat modal
  const handleDeleteChatModal = (id) => {
    setOpenDeleteModal(true);
    setChatId(id);
  };

  // *** Add new members into group
  const handleToAddMemebers = (user) => {
    let data = JSON.stringify({
      userId: user._id,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/add/members/${chatId}`,
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
        setMemebers((prev) => [...prev, response.data.user]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Delete chat details
  const handleDeleteChat = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/delete/${chatId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setSelectChatId("");
        if (window.innerWidth <= 780) {
          navigate("/");
        }
        setOpenDeleteModal(false);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle to join the group
  const handleToJoinGroup = (id) => {
    setRequestToJoin((p) => !p);
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/request/join/${id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        socket.emit("notification", response.data.notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle join request modal
  const handleJoinRequestModal = (id) => {
    setChatId(id);
    setOpenJoinRequestModal(true);
    fetchJoiningRequest(id);
  };

  // *** Fetch all users who are requested to join group
  const fetchJoiningRequest = (id) => {
    setIsLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/request/join/${id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setJoinUsers(response.data.request);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle open Chat privacy settings
  const handleOpenPrivacySettings = (id) => {
    setOpenPrivacyModal(true);
    setChatId(id);
  };

  // *** Handle Update group privacy
  const updatePrivacy = () => {
    let data = JSON.stringify({
      privacy: "mem",
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/update/privacy/${chatId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setMessagePrivacy(response.data.msg_prvacy);
        setOpenPrivacyModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    socket.on("typing going", (data) => {
      setIsTyping(data);
    });
    socket.on("stop typing", (data) => {
      setIsTyping(data);
    });
  });

  // *** Handle leave group chat
  const handleLeaveGroup = () => {
    let data = JSON.stringify({
      userId: JSON.parse(localStorage.getItem("user"))._id,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/remove/members/${chatId}`,
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
        const temp = members;
        const arr = temp.filter((data) => data._id !== response.data.user._id);
        setMemebers(arr);
        setOpenLeaveGroupModal(false);
        if (window.innerWidth > 780) {
          setSelectChatId("");
        } else {
          navigate(`/`);
          setSelectChatId("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {/* Chat privacy modal */}
      {openPrivacyModal && (
        <ModalComp
          isOpen={openPrivacyModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Update Privacy</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='chat_modal_body'>
              <Box className='radion_text_section'>
                <span className='radio_header'>Read message privacy</span>
                <br />
                <span className='radio_subheader'>
                  Who can read the group messages?
                </span>
              </Box>
              <Box className='radio_section'>
                <Box
                  className='radio_btn'
                  onClick={() => setMessagePrivacy("all")}>
                  {messagePrivacy === "all" ? (
                    <BiRadioCircleMarked className='radio_icon checked' />
                  ) : (
                    <BiRadioCircle className='radio_icon' />
                  )}
                  <span className='radio_text'>All</span>
                </Box>

                <Box
                  className='radio_btn'
                  onClick={() => setMessagePrivacy("mem")}>
                  {messagePrivacy === "mem" ? (
                    <BiRadioCircleMarked className='radio_icon checked' />
                  ) : (
                    <BiRadioCircle className='radio_icon' />
                  )}
                  <span className='radio_text'>Memebers</span>
                </Box>
              </Box>
            </Box>
          }
          footer={
            <Box>
              <ButtonComp
                text='Update'
                className='modal_btn'
                disableClassName='disable_modal_btn'
                isLoading={false}
                isDisable={false}
                handleClick={updatePrivacy}
              />
            </Box>
          }
        />
      )}

      {/* Chat edit modal */}
      {openEditModal && (
        <ModalComp
          isOpen={openEditModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Update Group</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='chat_modal_body'>
              {/* Image container */}
              <Box className='modal_image_section'>
                <Avatar
                  src={PrevImage ? PrevImage : profilePic}
                  className='modal_avatar'
                />
                <label htmlFor='modal_file'>
                  <AiOutlineCamera className='modal_input_label' />
                  <Input
                    type='file'
                    id='modal_file'
                    className='file_input'
                    onChange={(e) => handleImageChange(e)}
                  />
                </label>
              </Box>

              {/* Update group name and Bio */}
              <Box className='modal_group_info_section'>
                <InputComp
                  type='text'
                  placeholder='Update group name'
                  className='auth_input'
                  handleChange={(e) =>
                    setUpdatedName(e.target.value.slice(0, 30))
                  }
                  value={updatedName}
                />
                <TextareaComp
                  type='text'
                  placeholder='Update group bio'
                  className='textarea_input'
                  value={updatedBio}
                  handleChange={(e) => setUpdatedBio(e.target.value)}
                />
              </Box>
            </Box>
          }
          footer={
            <Box>
              <ButtonComp
                text='Update'
                className='modal_btn'
                disableClassName='disable_modal_btn'
                isLoading={isLoading}
                isDisable={isDisable}
                handleClick={handleUpdateChat}
              />
            </Box>
          }
        />
      )}

      {/* Chat group info modal */}
      {openGroupModal && (
        <ModalComp
          isOpen={openGroupModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Group details</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='chat_modal_body'>
              {/* Image container */}
              <Box className='modal_image_section'>
                <Avatar
                  src={PrevImage ? PrevImage : profilePic}
                  className='modal_avatar'
                />
              </Box>

              {/* Update group name and Bio */}
              <Box className='modal_group_detalils_section'>
                <span className='chat_name'>{name}</span>
                <br />
                <span className='chat_bio'>{bio}</span>
                <br />
                <span className='chat_members'>Members: {chat.mem.length}</span>
              </Box>
            </Box>
          }
        />
      )}

      {/* Open remove member modal */}
      {openMemberModal && (
        <ModalComp
          isOpen={openMemberModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Remove members</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='chat_modal_body'>
              {(members || []).length > 0 ? (
                <>
                  {members.map((data) => (
                    <MemebsrsCard
                      key={data._id}
                      user={data}
                      handleClick={handleRemoveUser}
                      chat={chat}
                    />
                  ))}
                </>
              ) : (
                <Box className='empty_members'>No active memebrs</Box>
              )}
            </Box>
          }
        />
      )}

      {/* Open Add new memebers in group */}
      {openNewMemberModal && (
        <ModalComp
          isOpen={openNewMemberModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Add new members</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='modal_body'>
              <Box className='modal_header'>
                <InputComp
                  type='search'
                  placeholder='Search user'
                  className='auth_input'
                  value={search}
                  handleChange={(e) => setSearch(e.target.value)}
                />
              </Box>

              <Box className='model_search_body'>
                {isLoading ? (
                  <UserSkeleton />
                ) : (
                  <React.Fragment>
                    {(users || []).length > 0 ? (
                      <>
                        {users.map((data) => (
                          <AddMemberCard
                            key={data._id}
                            user={data}
                            members={members}
                            handleClick={handleToAddMemebers}
                          />
                        ))}
                      </>
                    ) : (
                      <Box className='empty'>No user found</Box>
                    )}
                  </React.Fragment>
                )}
              </Box>
            </Box>
          }
        />
      )}

      {/* Open delete modal for chat */}
      {openDeleteModal && (
        <ModalComp
          isOpen={openDeleteModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Delete chat</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={<Box>Do you want to delete this chat?</Box>}
          footer={
            <Button className='delete_btn' onClick={handleDeleteChat}>
              Delete
            </Button>
          }
        />
      )}

      {/* Open Add new memebers join request */}
      {openJoinRequestModal && (
        <ModalComp
          isOpen={openJoinRequestModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Joining requests</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box className='modal_body'>
              <Box className='model_search_body'>
                {isLoading ? (
                  <UserSkeleton />
                ) : (
                  <React.Fragment>
                    {(joinusers || []).length > 0 ? (
                      <>
                        {joinusers.map((data) => (
                          <RequestUser
                            key={data._id}
                            user={data}
                            handleClick={handleToAddMemebers}
                            chat={chat}
                          />
                        ))}
                      </>
                    ) : (
                      <Box className='empty'>No user found</Box>
                    )}
                  </React.Fragment>
                )}
              </Box>
            </Box>
          }
        />
      )}

      {/* Open leave group modal */}
      {openLeaveGroupModal && (
        <ModalComp
          isOpen={openLeaveGroupModal}
          onClose={handleCloseModal}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Leave group chat</span>
              <Button className='modal_title_btn' onClick={handleCloseModal}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={<Box>Do you want to leave this group?</Box>}
          footer={
            <Button className='delete_btn' onClick={handleLeaveGroup}>
              Leave
            </Button>
          }
        />
      )}

      <Box className='chat_page_header'>
        <Box className='chat_page_box'>
          <Button className='back_button' onClick={handleBackeToChat}>
            <MdOutlineKeyboardBackspace />
          </Button>
          {chat.isGroup ? (
            <Box className='chat_info_box'>
              <Avatar src={profilePic} className='chat_avatar' />
              <Box className='chat_info_inner_box'>
                <span className='chat_name'>{name}</span>
                <br />
                <span className='chat_bio'>
                  {bio ? (
                    <>
                      {isTyping ? (
                        <span className='chat_bio'>Typing...</span>
                      ) : (
                        <>
                          {bio.length > 30 ? (
                            <>{bio.slice(0, 30)}</>
                          ) : (
                            <>{bio}</>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
              </Box>
            </Box>
          ) : (
            <Box className='chat_info_box'>
              <Avatar
                src={
                  checkUser(chat.mem, JSON.parse(localStorage.getItem("user")))
                    .profilePic
                }
                className='chat_avatar'
              />
              <Box className='chat_info_inner_box'>
                <span className='chat_name'>
                  {
                    checkUser(
                      chat.mem,
                      JSON.parse(localStorage.getItem("user"))
                    ).name
                  }
                </span>
                <br />
                {/* Typing indicator */}
                {isTyping && <span className='chat_bio'>Typing...</span>}
              </Box>
            </Box>
          )}
        </Box>

        {chat.isGroup ? (
          <>
            {!memberUser(
              members,
              JSON.parse(localStorage.getItem("user"))._id
            ) ? (
              <Button
                className='join_btn'
                onClick={() => handleToJoinGroup(chat._id)}>
                {requestToJoin ? <BiUserCheck /> : <AiOutlineUserAdd />}
              </Button>
            ) : (
              <Menu>
                <MenuButton as={Button} className='menu_btn'>
                  <MdOutlineMoreVert />
                </MenuButton>
                <MenuList>
                  {/* Chat edit menuitem */}
                  {JSON.parse(localStorage.getItem("user"))._id ===
                    chat.creator && (
                    <MenuItem
                      className='menu_item'
                      onClick={handleOpenEditModal}>
                      Edit group info
                    </MenuItem>
                  )}

                  {/* View chat group info menuitem */}
                  <MenuItem
                    className='menu_item'
                    onClick={() => setOpenGroupModal(true)}>
                    View group details
                  </MenuItem>

                  {/* Add new members in chat group */}
                  {chat.isGroup && (
                    <>
                      {JSON.parse(localStorage.getItem("user"))._id ===
                        chat.creator && (
                        <MenuItem
                          className='menu_item'
                          onClick={() => setOpenNewMemberModal(true)}>
                          Add new member
                        </MenuItem>
                      )}
                    </>
                  )}

                  {/* Remove member from chat group */}
                  {chat.isGroup && (
                    <>
                      {JSON.parse(localStorage.getItem("user"))._id ===
                        chat.creator && (
                        <MenuItem
                          className='menu_item'
                          onClick={() => setOpenMemberModal(true)}>
                          Remove member
                        </MenuItem>
                      )}
                    </>
                  )}

                  {/* Requeste users to join the group */}
                  {JSON.parse(localStorage.getItem("user"))._id ===
                    chat.creator && (
                    <MenuItem
                      className='menu_item join_menu_item'
                      onClick={() => handleJoinRequestModal(chat._id)}>
                      Join request{" "}
                      <>
                        {chat.request.length > 0 ? (
                          <span className='join_request_text'>
                            {chat.request.length}
                          </span>
                        ) : (
                          ""
                        )}
                      </>
                    </MenuItem>
                  )}

                  {/* Privacy Settings */}
                  {JSON.parse(localStorage.getItem("user"))._id ===
                    chat.creator && (
                    <MenuItem
                      className='menu_item join_menu_item'
                      onClick={() => handleOpenPrivacySettings(chat._id)}>
                      Privacy settings
                    </MenuItem>
                  )}

                  {chat.isGroup && (
                    <>
                      {JSON.parse(localStorage.getItem("user"))._id !==
                        chat.creator && (
                        <MenuItem
                          className='menu_item delete'
                          onClick={() => setOpenLeaveGroupModal(true)}>
                          Leave group
                        </MenuItem>
                      )}
                    </>
                  )}

                  {/* Delete chat group */}
                  {JSON.parse(localStorage.getItem("user"))._id ===
                    chat.creator && (
                    <MenuItem
                      className='menu_item delete'
                      onClick={() => setOpenDeleteModal(true)}>
                      Delete
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            )}
          </>
        ) : (
          <Menu>
            <MenuButton as={Button} className='menu_btn'>
              <MdOutlineMoreVert />
            </MenuButton>
            <MenuList>
              <MenuItem
                className='menu_item delete'
                onClick={() => handleDeleteChatModal(chat._id)}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
    </React.Fragment>
  );
};

export default ChatPageHeader;
