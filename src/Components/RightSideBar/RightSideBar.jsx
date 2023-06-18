/** @format */

import { Box, Avatar, Button, Img } from "@chakra-ui/react";
import React from "react";
import { GlobalContext } from "../../Context/Context";
import UserLogo from "../../Assets/user.json";
import lottie from "lottie-web";
import axios from "axios";
import ProfileSkeleton from "../Skeleton/ProfileSkeleton";
import { AiOutlineClose } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import InputComp from "../InputComp/InputComp";
import ButtonComp from "../ButtonComp/ButtonComp";
import ModalComp from "../ModalComp/ModalComp";
import TextareaComp from "../InputComp/TextareaComp";
import { AiOutlineLink } from "react-icons/ai";
import InputGroupComp from "../InputComp/InputGroupComp";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { isValidUrl } from "../../Utils/checkURL";

const RightSideBar = () => {
  const { profileId, setProfileId } = GlobalContext();
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);
  const [prevImage, setPrevImage] = React.useState("");
  const [image, setImage] = React.useState("");
  const [isLoadingPage, setIsLoadingPage] = React.useState(false);
  const [updateUser, setUpdateUser] = React.useState(null);

  const [openNameModal, setOpenNameModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [isNameLoading, setIsNameLoading] = React.useState(false);
  const [isNameDisable, setIsNameDisable] = React.useState(true);

  const [openBioModal, setOpenBioModal] = React.useState(false);
  const [bio, setBio] = React.useState("");
  const [isBioLoading, setIsBioLoading] = React.useState(false);
  const [isBioDisable, setIsBioDisable] = React.useState(true);

  const [openLinkModal, setOpenLinkModal] = React.useState(false);
  const [twLink, setTwLink] = React.useState("");
  const [error1, setError1] = React.useState(false);

  const [fbLink, setFbLink] = React.useState("");
  const [error2, setError2] = React.useState(false);

  const [linkedInLink, setLinkedinLink] = React.useState("");
  const [error3, setError3] = React.useState(false);

  const [customLink, setCustomLink] = React.useState("");
  const [error4, setError4] = React.useState(false);

  const [isLinkBtnDisable, setIsLinkBtnDisable] = React.useState(true);
  const [isLinkBtnLoading, setIsLinkBtnLoading] = React.useState(false);

  // *** Lottie animation image
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#react-logo"),
      animationData: UserLogo,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }, []);

  // *** Fetch profile details
  React.useEffect(() => {
    if (profileId) {
      setIsLoadingPage(true);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/user/${profileId}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setUser(response.data);
          setTwLink(response.data.tw);
          setFbLink(response.data.fb);
          setLinkedinLink(response.data.link);
          setCustomLink(response.data.c_link);
          setIsLoadingPage(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [profileId, updateUser]);

  // *** Handle close modal
  const onClose = () => {
    setOpenModal(false);
    setOpenNameModal(false);
    setOpenBioModal(false);
    setOpenLinkModal(false);
  };

  // *** Handle image file input
  const handleImage = (e) => {
    setIsDisable(false);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  // *** Handle close image
  const handleCloseImage = () => {
    setPrevImage("");
    setImage("");
    setIsDisable(true);
  };

  // *** Handle open profile image upload modal
  const handleOpenModal = () => {
    if (profileId === JSON.parse(localStorage.getItem("user"))._id) {
      setOpenModal(true);
    }
  };

  // *** Handle upload profile image
  const handleUploadProfileImage = () => {
    setIsLoading(true);
    setIsDisable(true);
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    var formdata = new FormData();
    formdata.append("image", image);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_BASE_URL}api/user/upload/picture/${profileId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        // console.log(result);
        setIsLoading(false);
        setPrevImage("");
        setImage("");
        setOpenModal(false);
        setUpdateUser(result.user);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Handle disable name update button
  React.useEffect(() => {
    if (!name.trim()) {
      setIsNameDisable(true);
    } else {
      setIsNameDisable(false);
    }
  }, [name]);

  // *** Handle update profile name
  const handleUpdateName = () => {
    setIsNameDisable(true);
    setIsNameLoading(true);
    let data = JSON.stringify({
      name: name,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/update/name`,
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
        setIsNameLoading(false);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setName("");
        setOpenNameModal(false);
        setUpdateUser(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle update profile bio
  const handleUpdateBio = () => {
    setIsBioDisable(true);
    setIsBioLoading(true);
    let data = JSON.stringify({
      bio: bio,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/update/bio`,
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
        setIsBioLoading(false);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setBio("");
        setOpenBioModal(false);
        setUpdateUser(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle disable bio update button
  React.useEffect(() => {
    if (!bio.trim()) {
      setIsBioDisable(true);
    } else {
      setIsBioDisable(false);
    }
  }, [bio]);

  // *** Handle change twitter link
  const handleTwitterLink = (e) => {
    console.log("Change: ", e.target.value);
    setTwLink(e.target.value);
  };

  // *** Handle check input link for twitter
  React.useEffect(() => {
    const result = isValidUrl(twLink);
    if (!result) {
      setIsLinkBtnDisable(true);
      setError1(true);
    } else {
      setIsLinkBtnDisable(false);
      setError1(false);
    }
  }, [twLink]);

  // *** Handle change facebook link
  const handleFacebookLink = (e) => {
    setFbLink(e.target.value);
  };

  // *** Handle check input link for facebook
  React.useEffect(() => {
    const result = isValidUrl(fbLink);
    if (!result) {
      setIsLinkBtnDisable(true);
      setError2(true);
    } else {
      setIsLinkBtnDisable(false);
      setError2(false);
    }
  }, [fbLink]);

  // *** Handle change linkedin link
  const handleLinkedInLink = (e) => {
    setLinkedinLink(e.target.value);
  };

  // *** Handle check input link for linkedin
  React.useEffect(() => {
    if (!linkedInLink.includes("linkedin")) {
      setIsLinkBtnDisable(true);
      setError3(true);
    } else {
      const result = isValidUrl(linkedInLink);
      if (!result) {
        setIsLinkBtnDisable(true);
        setError3(true);
      } else {
        setIsLinkBtnDisable(false);
        setError3(false);
      }
    }
  }, [linkedInLink]);

  // *** Handle change linkedin link
  const handleCustomLink = (e) => {
    setCustomLink(e.target.value);
  };

  // *** Handle check input link for custom
  React.useEffect(() => {
    const result = isValidUrl(linkedInLink);
    if (!result) {
      setIsLinkBtnDisable(true);
      setError4(true);
    } else {
      setIsLinkBtnDisable(false);
      setError4(false);
    }
  }, [customLink]);

  // *** Handle update profile links
  const updateProfileLink = () => {
    setIsLinkBtnDisable(true);
    setIsLinkBtnLoading(true);
    let data = JSON.stringify({
      tw: twLink,
      fb: fbLink,
      link: linkedInLink,
      c_link: customLink,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/update/links`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setUpdateUser(response.data);
        setTwLink(response.data.tw);
        setFbLink(response.data.fb);
        setLinkedinLink(response.data.link);
        setCustomLink(response.data.c_link);
        setIsLinkBtnLoading(false);
        setOpenLinkModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className='right_section'>
      {/* Profile image modal */}
      {openModal && (
        <ModalComp
          isOpen={openModal}
          onClose={onClose}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Upload profile image</span>
              <Button className='modal_title_btn' onClick={onClose}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <React.Fragment>
              {prevImage ? (
                <Box className='modal_image_section'>
                  <Img src={prevImage} className='prev_image' />
                  <Button
                    className='prv_image_close_btn'
                    onClick={handleCloseImage}>
                    <AiOutlineClose />
                  </Button>
                </Box>
              ) : (
                <Box className='profile_upload_section'>
                  <label htmlFor='profile_file' className='input_label'>
                    <BsCloudUpload className='upload_icon' />
                    <input
                      type='file'
                      id='profile_file'
                      className='file_input'
                      onChange={(e) => handleImage(e)}
                    />
                  </label>
                </Box>
              )}
            </React.Fragment>
          }
          footer={
            <Box className='modal_upload_btn_section'>
              <ButtonComp
                text='Upload'
                className='upload_btn'
                disableClassName='disable_upload_btn'
                isLoading={isLoading}
                isDisable={isDisable}
                handleClick={handleUploadProfileImage}
              />
            </Box>
          }
        />
      )}

      {/* Handle open name modal */}
      {openNameModal && (
        <ModalComp
          isOpen={openNameModal}
          onClose={onClose}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Update profile name</span>
              <Button className='modal_title_btn' onClick={onClose}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box>
              <InputComp
                type='text'
                placeholder={"Enter your name"}
                className='auth_input'
                value={name}
                handleChange={(e) => setName(e.target.value)}
              />
            </Box>
          }
          footer={
            <Box>
              <ButtonComp
                text='Update'
                className='upload_btn'
                disableClassName='disable_upload_btn'
                isLoading={isNameLoading}
                isDisable={isNameDisable}
                handleClick={handleUpdateName}
              />
            </Box>
          }
        />
      )}

      {/* Handle open name modal */}
      {openBioModal && (
        <ModalComp
          isOpen={openBioModal}
          onClose={onClose}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Update profile bio</span>
              <Button className='modal_title_btn' onClick={onClose}>
                <AiOutlineClose />
              </Button>
            </Box>
          }
          body={
            <Box>
              <TextareaComp
                type='text'
                placeholder={"Enter your profile bio"}
                className='textarea_input'
                value={bio}
                handleChange={(e) => setBio(e.target.value)}
              />
            </Box>
          }
          footer={
            <Box>
              <ButtonComp
                text='Update'
                className='upload_btn'
                disableClassName='disable_upload_btn'
                isLoading={isBioLoading}
                isDisable={isBioDisable}
                handleClick={handleUpdateBio}
              />
            </Box>
          }
        />
      )}

      {/* Profile link modal */}
      {openLinkModal && (
        <ModalComp
          isOpen={openLinkModal}
          onClose={onClose}
          title={
            <Box className='modal_title'>
              <span className='modal_title_text'>Profile links</span>
              {isLinkBtnDisable ? (
                <Button className='modal_title_btn' onClick={onClose}>
                  <AiOutlineClose />
                </Button>
              ) : (
                <ButtonComp
                  text='Update'
                  className='upload_btn'
                  disableClassName='disable_upload_btn'
                  isLoading={isLinkBtnLoading}
                  handleClick={updateProfileLink}
                  isDisable={isLinkBtnDisable}
                />
              )}
            </Box>
          }
          body={
            <Box>
              {/* Twitter */}
              <InputGroupComp
                icon={<FaTwitter className='twitter' />}
                className={"input_icon_box"}
                isError={error1}
                placeholder='Twiiter profile link'
                value={twLink}
                handleChange={handleTwitterLink}
              />

              {/* facebook */}
              <InputGroupComp
                icon={<FaFacebookF className='facebook' />}
                className={"input_icon_box"}
                isError={error2}
                placeholder='Facebook profile link'
                value={fbLink}
                handleChange={handleFacebookLink}
              />

              {/* linkedin */}
              <InputGroupComp
                icon={<FaLinkedinIn className='linkedin' />}
                className={"input_icon_box"}
                isError={error3}
                placeholder='Linkedin profile link'
                value={linkedInLink}
                handleChange={handleLinkedInLink}
              />

              {/* custom */}
              <InputGroupComp
                icon={<AiOutlineLink className='custom' />}
                className={"input_icon_box"}
                isError={error4}
                placeholder='Custom profile link'
                value={customLink}
                handleChange={handleCustomLink}
              />
            </Box>
          }
        />
      )}

      {profileId ? (
        <Box className='user_profile_section'>
          {isLoadingPage ? (
            <>
              <ProfileSkeleton />
            </>
          ) : (
            <>
              {user && (
                <Box className='profile_container'>
                  <Button
                    className='close_page_btn'
                    onClick={() => window.location.reload(false)}>
                    <AiOutlineClose />
                  </Button>
                  {/* Avatar */}
                  <Box className='avatar_section'>
                    <Avatar
                      onClick={handleOpenModal}
                      src={user.profilePic || ""}
                      className='profile_avatar'
                    />
                  </Box>

                  {/* User name */}
                  <Box className='user_name_section'>
                    <span className='profile_name'>{user.name}</span>
                    {profileId ===
                      JSON.parse(localStorage.getItem("user"))._id && (
                      <button
                        className='edit_btn'
                        onClick={() => setOpenNameModal(true)}>
                        <BiEditAlt />
                      </button>
                    )}
                  </Box>

                  {/* User Bio */}
                  <Box className='user_bio_section'>
                    <span className='profile_bio'>
                      {user.bio ? (
                        <>{user.bio}</>
                      ) : (
                        <>No profile bio has been set</>
                      )}
                    </span>
                    {profileId ===
                      JSON.parse(localStorage.getItem("user"))._id && (
                      <button
                        className='edit_btn'
                        onClick={() => setOpenBioModal(true)}>
                        <BiEditAlt />
                      </button>
                    )}
                  </Box>

                  {/* Links */}
                  <Box className='profile_links_section'>
                    <Box className='links_section'>
                      {/* Twitter */}
                      <a href={user.tw || ""} className='link_btn twitter_btn'>
                        <FaTwitter className='link_icon' />
                      </a>

                      {/* Facebook */}
                      <a href={user.fb || ""} className='link_btn facebook_btn'>
                        <FaFacebookF className='link_icon' />
                      </a>

                      {/* Linkedin */}
                      <a
                        href={user.link || ""}
                        className='link_btn linkedin_btn'>
                        <FaLinkedinIn className='link_icon' />
                      </a>

                      {/* Custom link */}
                      <a
                        href={user.c_link || ""}
                        className='link_btn custom_link'>
                        <AiOutlineLink className='link_icon' />
                      </a>
                    </Box>

                    {profileId ===
                      JSON.parse(localStorage.getItem("user"))._id && (
                      <button
                        className='edit_btn'
                        onClick={() => setOpenLinkModal(true)}>
                        <BiEditAlt />
                      </button>
                    )}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      ) : (
        <Box className='empty_user'>
          <Box id='react-logo' />
        </Box>
      )}
    </Box>
  );
};

export default RightSideBar;
