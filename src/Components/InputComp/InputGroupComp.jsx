/** @format */

import React from "react";
import { Input, Box } from "@chakra-ui/react";

const InputGroupComp = ({
  icon,
  className,
  isError,
  placeholder,
  value,
  handleChange,
}) => {
  return (
    <Box className='input_group'>
      <Box className='inpu_icon'>{icon}</Box>
      <Input
        type='link'
        placeholder={placeholder}
        className={isError ? `${className} error_input` : className}
        value={value}
        onChange={(e) => handleChange(e)}
      />
    </Box>
  );
};

export default InputGroupComp;
