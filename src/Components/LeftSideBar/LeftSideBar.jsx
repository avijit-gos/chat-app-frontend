/** @format */

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React from "react";
import InputComp from "../InputComp/InputComp";
import { FiMoreVertical } from "react-icons/fi";
import ModalComp from "../ModalComp/ModalComp";
import axios from "axios";
import UserSkeleton from "../Skeleton/UserSkeleton";
import UserCard from "../UserCard/UserCard";
import ChatComp from "../ChatComp/ChatComp";
import { AiOutlineClose } from "react-icons/ai";
import SkeletonChatLoading from "../Skeleton/SkeletonChatLoading";

const LeftSideBar = () => {
  const [openSingleChatModal, setOpenSingleChatModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const [isChatLoading, setIsChatLoading] = React.useState(false);

  // Group
  const [openGroupModal, setOpenGroupModal] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [selectUsers, setSelectUsers] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const [searchChat, setSearchChat] = React.useState("");
  const [searchChats, setSearchChats] = React.useState([]);

  // close modal
  const onClose = () => {
    setOpenSingleChatModal(false);
    setSearch("");
    setIsLoading(false);
    setIsDisable(true);
    setOpenGroupModal(false);
  };

  // *** Handle search user
  React.useEffect(() => {
    if (search.trim()) {
      setIsLoading(true);
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
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [search]);

  // *** Handle to create one to one single chat
  const handleOneToOneChat = (user) => {
    let data = JSON.stringify({
      profileId: user._id,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/`,
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
        setChats((prev) => [response.data, ...prev]);
        setOpenSingleChatModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Fetch all chats
  React.useEffect(() => {
    setIsChatLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setChats(response.data);
        setIsChatLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // **** Handle to add group
  const handleToAddinGroup = (user) => {
    console.log("ADD >>> ", user._id);
    if (!usersList.includes(user._id)) {
      setUsersList((prev) => [...prev, user._id]);
      setSelectUsers((prev) => [...prev, user]);
    }
  };

  // *** Handle Remove from group
  const handleRemoveUser = (id) => {
    const temp = usersList;
    var filterTemp = temp.filter((data) => data !== id);
    setUsersList(filterTemp);

    const arr = selectUsers;
    var filterArr = arr.filter((data) => data._id !== id);
    setSelectUsers(filterArr);
  };

  React.useEffect(() => {
    if (!groupName.trim() || usersList.length <= 1) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [groupName, usersList]);

  // *** Create a new group
  const createNewGroup = () => {
    setIsBtnLoading(true);
    let data = JSON.stringify({
      name: groupName,
      members: JSON.stringify(usersList),
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/group`,
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
        setChats((prev) => [response.data, ...prev]);
        setOpenGroupModal(false);
        setIsBtnLoading(false);
        setIsDisable(true);
        setGroupName("");
        setSearch("");
        setSelectUsers([]);
        setUsersList([]);
      })
      .catch((error) => {
        console.log(error);
        setOpenGroupModal(false);
        setIsBtnLoading(false);
        setIsDisable(true);
        setGroupName("");
        setSearch("");
        setSelectUsers([]);
        setUsersList([]);
      });
  };

  React.useEffect(() => {
    if (searchChat.trim()) {
      setIsChatLoading(true);

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/chat/search_chat?search=${searchChat}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response);
          setSearchChats(response.data);
          setIsChatLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setSearchChats([]);
    }
  }, [searchChat]);

  return (
    <Box className='left_side_section'>
      {/* Single chat modal */}
      {openSingleChatModal && (
        <ModalComp
          isOpen={openSingleChatModal}
          onClose={onClose}
          isDisable={isDisable}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Create new chat</span>
              <Button className='modal_title_btn' onClick={onClose}>
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
                          <UserCard
                            key={data._id}
                            user={data}
                            handleClick={handleOneToOneChat}
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

      {/* Group chat modal */}
      {openGroupModal && (
        <ModalComp
          isOpen={openGroupModal}
          onClose={onClose}
          isDisable={isDisable}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Create new chat</span>
              {isDisable ? (
                <Button className='modal_title_btn' onClick={onClose}>
                  <AiOutlineClose />
                </Button>
              ) : (
                <Button className='modal_create_btn' onClick={createNewGroup}>
                  Create
                </Button>
              )}
            </Box>
          }
          body={
            <Box className='modal_body'>
              <Box className='modal_header'>
                <InputComp
                  type='text'
                  placeholder='Enter group name'
                  className='auth_input'
                  value={groupName}
                  handleChange={(e) => setGroupName(e.target.value)}
                />
                {/* Select user lists */}
                {(selectUsers || []).length > 0 && (
                  <Box className='select_user_section'>
                    {selectUsers.map((data) => (
                      <Box
                        className='select_user_tag'
                        key={data._id}
                        onClick={() => handleRemoveUser(data._id)}>
                        {data.name}
                      </Box>
                    ))}
                  </Box>
                )}
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
                          <UserCard
                            key={data._id}
                            user={data}
                            handleClick={handleToAddinGroup}
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

      <Box className='left_side_section_header'>
        <InputComp
          type='search'
          placeholder='Search'
          className='search_input'
          value={searchChat}
          handleChange={(e) => setSearchChat(e.target.value)}
        />
        <Menu>
          <MenuButton as={Button} className='menu_btn'>
            <FiMoreVertical />
          </MenuButton>
          <MenuList>
            <MenuItem
              className='menu_item'
              onClick={() => setOpenSingleChatModal(true)}>
              Create new chat
            </MenuItem>
            <MenuItem
              className='menu_item'
              onClick={() => setOpenGroupModal(true)}>
              Create new group
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <React.Fragment>
        <Box className='chat_card_section'>
          {isChatLoading ? (
            <SkeletonChatLoading />
          ) : (
            <>
              {(searchChats || []).length > 0 ? (
                <>
                  {searchChats.map((data) => (
                    <ChatComp key={data._id} chat={data} />
                  ))}
                </>
              ) : (
                <>
                  {(chats || []).length > 0 ? (
                    <>
                      {chats.map((data) => (
                        <ChatComp key={data._id} chat={data} />
                      ))}
                    </>
                  ) : (
                    <div className='empty_chats'>No chat available</div>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </React.Fragment>
    </Box>
  );
};

export default LeftSideBar;
