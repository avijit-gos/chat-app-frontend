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
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../Context/Context";

const ProfileNavbar = () => {
  const navigate = useNavigate();
  const { setProfileId } = GlobalContext();
  const [width, setWidth] = React.useState(0);

  // *** Handle LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // *** Handle redirect to profile
  const handleRedirectProfile = () => {
    navigate(`/profile/${JSON.parse(localStorage.getItem("user"))._id}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  React.useEffect(() => {
    setWidth(window.innerWidth);
  }, [width]);

  return (
    <Box className='navbar_section'>
      {/* Back button */}
      <Button className='back_button' onClick={goBack}>
        <BiArrowBack />
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
  );
};

export default ProfileNavbar;
