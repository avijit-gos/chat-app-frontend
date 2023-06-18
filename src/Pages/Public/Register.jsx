/** @format */

import { Box, Button, Img } from "@chakra-ui/react";
import React from "react";
import InputComp from "../../Components/InputComp/InputComp";
import ButtonComp from "../../Components/ButtonComp/ButtonComp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";
import RegisterImage from "../../Assets/discussion.png";

const Register = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUserName] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // *** Handle NAME input
  const handleName = (e) => {
    setName(e.target.value);
    setErrorMsg("");
  };

  // *** Handle EMAIL input
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrorMsg("");
  };

  // *** Handle USERNAME input
  const handleUsername = (e) => {
    setUserName(e.target.value);
    setErrorMsg("");
  };

  // *** Handle PASSWORD input
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMsg("");
  };

  React.useEffect(() => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name, email, username, password]);

  // *** Handle REGISTER NEW USER
  const handleRegister = async () => {
    setIsDisable(true);
    setIsLoading(true);
    let data = JSON.stringify({
      email: email,
      username: username,
      name: name,
      password: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/register`,
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
        setName("");
        setEmail("");
        setPassword("");
        setUserName("");
        setIsLoading(false);
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMsg(error.response.data.error.message);
      });
  };

  return (
    <Box className='auth_container'>
      <Box className='auth_info_section'>
        <Box className='auth_info_box'>
          <Img src={RegisterImage} className='auth_image' />
          <Box className='auth_info_header'>Welcome to our app</Box>
          <Box className='auth_sub_header'>
            Connecting Conversations, Uniting the World.{" "}
          </Box>

          <Button
            className='auth_secondary_btn'
            onClick={() => navigate("/login")}>
            SignIn <AiOutlineRight className='auth_btn_icon' />
          </Button>
        </Box>
      </Box>
      {/* Form section */}
      <Box className='auth_form'>
        <Box className='mobile_auth_section'>
          <Img src={RegisterImage} className='auth_image' />
        </Box>
        <Box className='auth_form_section'>
          <Box className='auth_text_section'>
            <Box className='auth_text_header'>SignUn</Box>
            {errorMsg && <Box className='error_msg'>{errorMsg}</Box>}
          </Box>

          <Box className='auth_input_section'>
            {/* Name input */}
            <InputComp
              type='text'
              placeholder='Enter name'
              className='auth_input'
              value={name}
              handleChange={handleName}
            />

            {/* Email input */}
            <InputComp
              type='email'
              placeholder='Enter email'
              className='auth_input'
              value={email}
              handleChange={handleEmail}
            />

            {/* Username input */}
            <InputComp
              type='text'
              placeholder='Enter username'
              className='auth_input'
              value={username}
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
              text='SignUp'
              className='auth_btn'
              disableClassName='disable_auth_btn'
              isLoading={isLoading}
              isDisable={isDisable}
              handleClick={handleRegister}
            />
            <Box className='redirect_link' onClick={() => navigate("/login")}>
              Already have an account? SignIn
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
