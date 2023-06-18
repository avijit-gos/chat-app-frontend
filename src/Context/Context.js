/** @format */

import React from "react";
import { createContext, useContext } from "react";

const CreateContext = createContext();

function CreateContextProvider({ children }) {
  const [pageType, setPageType] = React.useState("home");
  const [items, setItems] = React.useState([]);
  const [profileId, setProfileId] = React.useState("");
  const [selectChatId, setSelectChatId] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);

  const [reciveMessageChatId, setReciveMessageChatId] = React.useState([]);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  return (
    <CreateContext.Provider
      value={{
        pageType,
        setPageType,
        items,
        setItems,
        profileId,
        setProfileId,
        selectChatId,
        setSelectChatId,
        messages,
        setMessages,
        notifications,
        setNotifications,
        notificationCount,
        setNotificationCount,
        reciveMessageChatId,
        setReciveMessageChatId,
        typing,
        setTyping,
        isTyping,
        setIsTyping,
      }}>
      {children}
    </CreateContext.Provider>
  );
}

export const GlobalContext = () => {
  return useContext(CreateContext);
};

export default CreateContextProvider;
