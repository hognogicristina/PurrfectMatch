import { Suspense } from "react";
import { Await, defer, useLoaderData, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { getAuthToken } from "../../util/auth.js";
import UsersArchive from "../../components/PurrfectMatch/UsersArchive.jsx";

function ArchiveOfUsersPage() {
  const { users } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={users}>
        {(loadedUsers) => (
          <div>
            <UsersArchive
              initialUsers={loadedUsers}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export default ArchiveOfUsersPage;

export async function loadUsers({ page = 1, pageSize = 9 } = {}) {
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:3000/users?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return await response.json();
}

export function loader({ request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  return defer({
    users: loadUsers({
      page: parseInt(params.page || "1"),
      pageSize: parseInt(params.pageSize || "9"),
    }),
  });
}
