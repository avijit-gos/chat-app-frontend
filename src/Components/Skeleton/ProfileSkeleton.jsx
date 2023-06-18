/** @format */

import { Box } from "@chakra-ui/react";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <Box className='profile_skeleton_section'>
      {/* Image section */}
      <Box className='skeleton_image_section'>
        <Box className='sekeleton_image skeleton'></Box>
      </Box>

      <Box className='profile_skeleton_box skeleton'></Box>
      <Box className='profile_skeleton_box skeleton'></Box>
      <Box className='profile_skeleton_box skeleton'></Box>
      <Box className='profile_skeleton_box skeleton'></Box>
      <Box className='profile_skeleton_box skeleton'></Box>
      <Box className='profile_skeleton_box skeleton'></Box>
    </Box>
  );
};

export default ProfileSkeleton;
