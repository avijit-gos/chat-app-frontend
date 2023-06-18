/** @format */

import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Register from "./Pages/Public/Register";
import Login from "./Pages/Public/Login";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import MessagePage from "./Pages/MessagePage/MessagePage";
import { GlobalContext } from "./Context/Context";
import { useSocket, socket } from "./socket/Socket";

import useSound from "use-sound";
import NotificationSound from "./Assets/boop.wav";

function App() {
  const { setNotificationCount, setNotifications } = GlobalContext();
  const [play] = useSound(NotificationSound);
  useSocket();

  React.useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      socket.on("notification receive", (data) => {
        // console.log("notification receive", data);
        setNotificationCount(1);
        setNotifications((prev) => [data, ...prev]);
        play();
      });
    }
  });
  return (
    <div className='App'>
      <Routes>
        <Route path='/register' exact element={<Register />} />
        <Route path='/login' exact element={<Login />} />
        <Route
          path='/'
          exact
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/:id'
          exact
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/message/:id'
          exact
          element={
            <ProtectedRoute>
              <MessagePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
