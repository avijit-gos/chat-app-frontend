/** @format */

import { Box } from "@chakra-ui/react";
import React from "react";
import DefautNavbar from "../Components/Navbar/DefaultNavbar/DefautNavbar";
import ProfileNavbar from "../Components/Navbar/ProfileNavbar/ProfileNavbar";
import { GlobalContext } from "../Context/Context";

const Navbar = ({ pageType }) => {
  if (pageType === "profile") {
    return <ProfileNavbar />;
  } else {
    return <DefautNavbar />;
  }
};

const Layout = ({ children }) => {
  const { pageType } = GlobalContext();
  return (
    <Box className='layout'>
      <Navbar pageType={pageType} />
      {children}
    </Box>
  );
};

export default Layout;
