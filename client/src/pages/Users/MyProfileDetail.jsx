import MyProfile from "../../components/User/MyProfile.jsx";
import { Await, defer, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { getAuthToken } from "../../util/auth.js";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";

function MyProfileDetailPage() {
  const data = useRouteLoaderData("user-details");
  const userDetail = data.userDetail;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={userDetail}>
        {(loadedUserDetail) => <MyProfile userDetail={loadedUserDetail} />}
      </Await>
    </Suspense>
  );
}

export default MyProfileDetailPage;

async function loadUserDetail() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return data;
  }

  return data.data;
}

export function loader() {
  return defer({
    userDetail: loadUserDetail(),
  });
}
