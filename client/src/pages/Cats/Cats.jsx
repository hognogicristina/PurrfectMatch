import { Await, defer, useLoaderData, useSearchParams } from "react-router-dom";
import { Suspense } from "react";
import CatsCatalog from "../../components/Cat/CatsCatalog.jsx";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";

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
          <CatsCatalog
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
  selectedHealthProblem = "",
  selectedUserId = "",
  selectedColor = "",
  sortBy = "age",
  sortOrder = "asc",
  page = 1,
  pageSize = 24,
} = {}) {
  let query = `search=${search}&selectedBreed=${selectedBreed}&selectedAgeType=${selectedAgeType}&selectedGender=${selectedGender}&selectedHealthProblem=${selectedHealthProblem}&selectedUserId=${selectedUserId}&selectedColor=${selectedColor}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`;
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
      selectedHealthProblem: params.selectedHealthProblem || "",
      selectedUserId: params.selectedUserId || "",
      selectedColor: params.selectedColor || "",
      sortBy: params.sortBy || "age",
      sortOrder: params.sortOrder || "asc",
      page: parseInt(params.page || "1"),
      pageSize: parseInt(params.pageSize || "24"),
    }),
  });
}
