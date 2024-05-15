import { useState, useEffect, Suspense } from "react";
import { Await, defer, useLoaderData, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";
import { getAuthToken } from "../../util/auth.js";
import Pagination from "../../components/Util/Custom/Pagination.jsx";
import OwnedList from "../../components/UserCatsList/OwnedList.jsx";

function OwnedCats() {
  const { cats, page, pageSize } = useLoaderData();
  const [currentPage, setCurrentPage] = useState(page);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    navigate(`/cats-owned?page=${newPage}&pageSize=${pageSize}`);
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={cats}>
        {(loadedCats) => (
          <div>
            <OwnedList cats={loadedCats} />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(cats.length / pageSize)}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export default OwnedCats;

export async function loadCats() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/user/cats-owned", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export function loader({ request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  return defer({
    cats: loadCats(),
    page: parseInt(params.page || "1"),
    pageSize: parseInt(params.pageSize || "12"),
  });
}
