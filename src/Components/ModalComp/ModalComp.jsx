/** @format */

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const ModalComp = ({ isOpen, onClose, title, body, footer }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className='modal'>
      <ModalOverlay />
      <ModalContent className='modal_content'>
        <ModalHeader>{title}</ModalHeader>

        <ModalBody>{body}</ModalBody>

        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalComp;
