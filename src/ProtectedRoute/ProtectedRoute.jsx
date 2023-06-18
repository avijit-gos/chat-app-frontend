/** @format */

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, ...rest }) => {
  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoute;
