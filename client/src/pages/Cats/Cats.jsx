import { Await, defer, useLoaderData, useSearchParams } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import CatsList from "../../components/Cat/CatsList.jsx";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";

function CatsPage() {
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
          <CatsList
            cats={loadedCats}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </Await>
    </Suspense>
  );
}

export default CatsPage;

async function loadCats({
  search = "",
  selectedBreed = "",
  selectedAgeType = "",
  selectedGender = "",
  selectedNoHealthProblem = "",
  sortBy = "age",
  sortOrder = "asc",
  page = 1,
  pageSize = 6,
} = {}) {
  let query = `search=${search}&selectedBreed=${selectedBreed}&selectedAgeType=${selectedAgeType}&selectedGender=${selectedGender}&selectedNoHealthProblem=${selectedNoHealthProblem}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`;
  query = query.replace(/&[^=]+=(?=&|$)/g, "");

  const response = await fetch(`http://localhost:3000/cats?${query}`);
  return await response.json();
}

export function loader({ request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  return defer({
    cats: loadCats({
      search: params.search || "",
      selectedBreed: params.selectedBreed || "",
      selectedAgeType: params.selectedAgeType || "",
      selectedGender: params.selectedGender || "",
      selectedNoHealthProblem: params.selectedNoHealthProblem || "",
      sortBy: params.sortBy || "age",
      sortOrder: params.sortOrder || "asc",
      page: parseInt(params.page || "1"),
      pageSize: parseInt(params.pageSize || "6"),
    }),
  });
}
