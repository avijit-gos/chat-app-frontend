/** @format */

import React from "react";
import { Textarea } from "@chakra-ui/react";

const TextareaComp = ({
  type,
  placeholder,
  className,
  value,
  handleChange,
}) => {
  return (
    <Textarea
      type={type}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={handleChange}
    />
  );
};

export default TextareaComp;
