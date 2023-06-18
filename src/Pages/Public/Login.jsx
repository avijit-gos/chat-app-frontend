/** @format */

import { Box, Button, Img } from "@chakra-ui/react";
import React from "react";
import InputComp from "../../Components/InputComp/InputComp";
import ButtonComp from "../../Components/ButtonComp/ButtonComp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";
import LoginImage from "../../Assets/bird.png";

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [logUser, setLogUser] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // *** Handle USERNAME input
  const handleUsername = (e) => {
    setLogUser(e.target.value);
    setErrorMsg("");
  };

  // *** Handle PASSWORD input
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMsg("");
  };

  React.useEffect(() => {
    if (!logUser.trim() || !password.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [logUser, password]);

  const handleLogin = () => {
    setIsDisable(true);
    setIsLoading(true);
    let data = JSON.stringify({
      logUser: logUser,
      password: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setLogUser("");
        setPassword("");
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setErrorMsg(error.response.data.error.message);
        setIsLoading(false);
      });
  };

  return (
    <Box className='auth_container'>
      <Box className='auth_info_section'>
        <Box className='auth_info_box'>
          <Box className='auth_info_header'>Welcome back</Box>
          <Box className='auth_sub_header'>
            Connecting Conversations, Uniting the World.{" "}
          </Box>

          <Button
            className='auth_secondary_btn'
            onClick={() => navigate("/register")}>
            SignUp <AiOutlineRight className='auth_btn_icon' />
          </Button>
        </Box>
      </Box>

      {/* Form section */}
      <Box className='auth_form'>
        <Box className='mobile_auth_section'>
          <Img src={LoginImage} className='auth_image' />
        </Box>
        <Box className='auth_form_section'>
          <Box className='auth_text_section'>
            <Box className='auth_text_header'>SignIn</Box>
            {errorMsg && <Box className='error_msg'>{errorMsg}</Box>}
          </Box>

          <Box className='auth_input_section'>
            {/* Username input */}
            <InputComp
              type='text'
              placeholder='Enter username or email'
              className='auth_input'
              value={logUser}
              handleChange={handleUsername}
            />

            {/* Password Input */}
            <InputComp
              type='password'
              placeholder='Enter password'
              className='auth_input'
              value={password}
              handleChange={handlePassword}
            />
          </Box>

          <Box className='auth_button_section'>
            <ButtonComp
              text='SignIn'
              className='auth_btn'
              disableClassName='disable_auth_btn'
              isLoading={isLoading}
              isDisable={isDisable}
              handleClick={handleLogin}
            />

            <Box
              className='redirect_link'
              onClick={() => navigate("/register")}>
              Don't have an account? SignUp
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
