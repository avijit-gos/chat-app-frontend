/** @format */

import { Input } from "@chakra-ui/react";
import React from "react";

const InputComp = ({ type, placeholder, className, value, handleChange }) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={(e) => handleChange(e)}
    />
  );
};

export default InputComp;
