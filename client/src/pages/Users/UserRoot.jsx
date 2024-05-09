import React, { Suspense } from "react";
import { Await, Outlet, useRouteLoaderData } from "react-router-dom";
import UserNavBar from "../../components/Layout/UserNavBar.jsx";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";

function UserRootLayout() {
  const data = useRouteLoaderData("user-details");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="userRootContainer">
        <UserNavBar />
        <Await resolve={data.userDetail}>{() => <Outlet />}</Await>
      </div>
    </Suspense>
  );
}

export default UserRootLayout;
