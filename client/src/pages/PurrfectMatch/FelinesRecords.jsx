import { Suspense } from "react";
import { Await, defer, useLoaderData, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import FelinesRecordsForm from "../../components/PurrfectMatch/FelinesRecordsForm.jsx";
import { getAuthToken } from "../../util/auth.js";

function FelinesRecordsPage() {
  const { cats } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={cats}>
        {(loadedCats) => (
          <div>
            <FelinesRecordsForm
              cats={loadedCats}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export default FelinesRecordsPage;

export async function loadCats({ page = 1, pageSize = 12 } = {}) {
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:3000/user/felines-records?page=${page}&pageSize=${pageSize}`,
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
    cats: loadCats({
      page: parseInt(params.page || "1"),
      pageSize: parseInt(params.pageSize || "12"),
    }),
  });
}
