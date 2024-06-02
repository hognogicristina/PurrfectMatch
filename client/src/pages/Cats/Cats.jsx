import { Await, defer, useLoaderData, useSearchParams } from "react-router-dom";
import { Suspense } from "react";
import CatsCatalog from "../../components/Cat/CatsCatalog.jsx";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { getAuthToken } from "../../util/auth.js";

function CatsPage() {
  const { cats } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={cats}>
        {(loadedCats) => (
          <CatsCatalog cats={loadedCats} currentPage={currentPage} />
        )}
      </Await>
    </Suspense>
  );
}

export default CatsPage;

async function loadCats({
  search = "",
  selectedBreed = "",
  selectedLifeStage = "",
  selectedGender = "",
  selectedHealthProblem = "",
  selectedUser = "",
  selectedColor = "",
  sortBy = "age",
  sortOrder = "asc",
  page = 1,
  pageSize = 24,
} = {}) {
  const token = getAuthToken();
  let query = `search=${search}&selectedBreed=${selectedBreed}&selectedLifeStage=${selectedLifeStage}&selectedGender=${selectedGender}&selectedHealthProblem=${selectedHealthProblem}&selectedUser=${selectedUser}&selectedColor=${selectedColor}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`;
  query = query.replace(/&[^=]+=(?=&|$)/g, "");

  const response = await fetch(`http://localhost:3000/cats?${query}`, {
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
    cats: loadCats({
      search: params.search || "",
      selectedBreed: params.selectedBreed || "",
      selectedLifeStage: params.selectedLifeStage || "",
      selectedGender: params.selectedGender || "",
      selectedHealthProblem: params.selectedHealthProblem || "",
      selectedUser: params.selectedUser || "",
      selectedColor: params.selectedColor || "",
      sortBy: params.sortBy || "age",
      sortOrder: params.sortOrder || "asc",
      page: parseInt(params.page || "1"),
      pageSize: parseInt(params.pageSize || "24"),
    }),
  });
}
