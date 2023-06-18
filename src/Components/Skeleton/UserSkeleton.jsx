/** @format */

import React from "react";
import { Box } from "@chakra-ui/react";
import "./UserSkeleton.css";

const userSkeleton = () => {
  return (
    <Box className='sekelton_loader_section'>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
      <Box className='user_loader_card skeleton'></Box>
    </Box>
  );
};

export default userSkeleton;
