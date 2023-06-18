/** @format */
import React from "react";
import io from "socket.io-client";

var socket, isConnected;

const useSocket = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  React.useEffect(() => {
    if (user && !isConnected) {
      socket = io(process.env.REACT_APP_BASE_URL, {
        transports: ["websocket"],
      });
      isConnected = true;
      if (isConnected) {
        socket.emit("setup", JSON.parse(localStorage.getItem("user")));
        socket.on("connection", () => {
          console.log("Connected");
        });
      }
    }
  }, [user]);
};

export { socket, useSocket, isConnected };
