/** @format */

import { Button, Spinner } from "@chakra-ui/react";
import React from "react";

const ButtonComp = ({
  text,
  className,
  disableClassName,
  isLoading,
  handleClick,
  isDisable,
}) => {
  return (
    <React.Fragment>
      {isDisable ? (
        <Button className={disableClassName}>
          {isLoading ? <Spinner /> : <>{text}</>}
        </Button>
      ) : (
        <Button className={className} onClick={handleClick}>
          {text}
        </Button>
      )}
    </React.Fragment>
  );
};

export default ButtonComp;
