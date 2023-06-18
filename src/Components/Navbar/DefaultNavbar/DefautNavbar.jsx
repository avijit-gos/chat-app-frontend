/** @format */

import {
  Box,
  Img,
  Menu,
  Avatar,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import React from "react";
import Logo from "../../../Assets/mail.png";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../Context/Context";
import { AiOutlineBell, AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import NotificationLoader from "../../Skeleton/NotificationLoader";
import NotificationCard from "../../NotificationCard/NotificationCard";

const DefautNavbar = () => {
  const { notifications, setNotifications, notificationCount } =
    GlobalContext();
  const navigate = useNavigate();
  const { setProfileId } = GlobalContext();
  const [width, setWidth] = React.useState(0);
  const [openNotificationMenu, setOpenNotificationMenu] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // *** Handle LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // *** Handle redirect to profile
  const handleRedirectProfile = () => {
    navigate(`/profile/${JSON.parse(localStorage.getItem("user"))._id}`);
  };

  React.useEffect(() => {
    // console.log(window.innerWidth);
    setWidth(window.innerWidth);
  }, [width]);

  const handleFetchNotification = () => {
    setOpenNotificationMenu(true);
    setIsLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/notification`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setNotifications(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className='navbar_section'>
      <Img src={Logo} className='navbar_logo' />
      <Box>
        <Button className='bell_btn' onClick={handleFetchNotification}>
          <AiOutlineBell />
          {notificationCount > 0 ? (
            <Box className='notification_dot'></Box>
          ) : null}
        </Button>
        {width <= 1000 ? (
          <Menu>
            <MenuButton as={Button} className='menu_btn'>
              <Avatar
                className='navbar_avatar'
                src={JSON.parse(localStorage.getItem("user")).profilePic || ""}
              />
            </MenuButton>
            <MenuList>
              <MenuItem
                className='navbar_menu_item'
                onClick={handleRedirectProfile}>
                Profile
              </MenuItem>
              <MenuItem className='navbar_menu_item'>Settings</MenuItem>
              <MenuItem
                className='navbar_menu_item logout'
                onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Menu>
            <MenuButton as={Button} className='menu_btn'>
              <Avatar
                className='navbar_avatar'
                src={JSON.parse(localStorage.getItem("user")).profilePic || ""}
              />
            </MenuButton>
            <MenuList>
              <MenuItem
                className='navbar_menu_item'
                onClick={() =>
                  setProfileId(JSON.parse(localStorage.getItem("user"))._id)
                }>
                Profile
              </MenuItem>
              <MenuItem
                className='navbar_menu_item logout'
                onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>

      {/* Notification */}
      {openNotificationMenu && (
        <Box className='notification_section'>
          <Box className='notification_wrapper'>
            <Box className='menu_btn_section'>
              <span className='notofication_wrapper_header'>Notifications</span>
              <Button
                className='menu_close_btn'
                onClick={() => setOpenNotificationMenu(false)}>
                <AiOutlineClose />
              </Button>
            </Box>
            {isLoading ? (
              <NotificationLoader />
            ) : (
              <React.Fragment>
                {(notifications || []).length > 0 ? (
                  <Box className='notification_cards'>
                    {notifications.map((data) => (
                      <NotificationCard key={data._id} data={data} />
                    ))}
                  </Box>
                ) : (
                  <Box className='empty_notification'>
                    No active notification available
                  </Box>
                )}
              </React.Fragment>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DefautNavbar;
