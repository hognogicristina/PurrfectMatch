import { useState, useEffect, Suspense } from "react";
import {
  Await,
  defer,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";
import SendToAdoptionList from "../../components/UserCatsList/SendToAdoptionList.jsx";
import { getAuthToken } from "../../util/auth.js";

function SendToAdoptionCats() {
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
            <SendToAdoptionList
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

export default SendToAdoptionCats;

export async function loadCats({ page = 1, pageSize = 12 } = {}) {
  const token = getAuthToken();
  let query = `page=${page}&pageSize=${pageSize}`;
  query = query.replace(/&[^=]+=(?=&|$)/g, "");

  const response = await fetch(
    `http://localhost:3000/user/cats-sent-to-adoption?${query}`,
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
    cats: loadCats(),
    page: parseInt(params.page || "1"),
    pageSize: parseInt(params.pageSize || "12"),
  });
}
