import { Suspense } from "react";
import { Await, Outlet, useRouteLoaderData } from "react-router-dom";
import UserNavigation from "../../components/Layout/UserNavigation.jsx";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";

function UserRootLayout() {
  const data = useRouteLoaderData("user-details");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="userRootContainer">
        <UserNavigation />
        <Await resolve={data.userDetail}>{() => <Outlet />}</Await>
      </div>
    </Suspense>
  );
}

export default UserRootLayout;
