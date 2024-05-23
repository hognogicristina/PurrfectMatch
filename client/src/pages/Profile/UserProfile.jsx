import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import UserProfileSection from "../../components/Profile/UserProfileSection.jsx";

function UserProfilePage() {
  const { userProfile } = useLoaderData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={userProfile}>
        {(loadedUserProfile) => (
          <UserProfileSection userProfile={loadedUserProfile} />
        )}
      </Await>
    </Suspense>
  );
}

export default UserProfilePage;

async function loadUserDetail(username) {
  const response = await fetch(
    `http://localhost:3000/user-profile/${username}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404 ||
    response.status === 500
  ) {
    return data;
  }

  return data.data;
}

export function loader({ params }) {
  const { username } = params;

  return defer({
    userProfile: loadUserDetail(username),
  });
}
