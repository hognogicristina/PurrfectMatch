import React from "react";
import { Outlet } from "react-router-dom";
import UserNavBar from "../../components/Layout/UserNavBar.jsx";

function UserRootLayout() {
  return (
    <div className="userRootContainer">
      <UserNavBar />
      <Outlet />
    </div>
  );
}

export default UserRootLayout;
