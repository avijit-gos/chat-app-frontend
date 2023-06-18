/** @format */

import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import memberUser from "../../Utils/memberUser";

const AddMemberCard = ({ user, members, handleClick }) => {
  return (
    <React.Fragment>
      {!memberUser(members, user._id) ? (
        <>
          <Box className='user_card' onClick={() => handleClick(user)}>
            <Avatar src={user.profilePic} className='user_card_avatar' />
            <span className='user_card_name'>{user.name}</span>
            {/* <span className='user_card_username'>@{user.username}</span> */}
          </Box>
        </>
      ) : null}
    </React.Fragment>
  );
};

export default AddMemberCard;
