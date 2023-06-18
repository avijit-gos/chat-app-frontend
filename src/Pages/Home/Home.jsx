/** @format */

import React from "react";
import Layout from "../../Layout/Layout";
import { Box } from "@chakra-ui/react";
import { GlobalContext } from "../../Context/Context";
import LeftSideBar from "../../Components/LeftSideBar/LeftSideBar";
import MiddleSideBar from "../../Components/MiddleSideBar/MiddleSideBar";
import RightSideBar from "../../Components/RightSideBar/RightSideBar";

const Home = () => {
  const { setPageType } = GlobalContext();

  // *** Setting page Type
  React.useLayoutEffect(() => {
    setPageType("home");
  }, []);
  return (
    <Layout>
      <Box className='child_container'>
        <LeftSideBar />
        <MiddleSideBar />
        <RightSideBar />
      </Box>
    </Layout>
  );
};

export default Home;
