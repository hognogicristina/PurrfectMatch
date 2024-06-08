import { Await, defer, useLoaderData, useSearchParams } from "react-router-dom";
import { Suspense, useEffect } from "react";
import CatsCatalog from "../../components/Cat/CatsCatalog.jsx";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { useUserDetails } from "../../util/useUserDetails.js";

function CatsPage() {
  const { cats } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const { userDetails } = useUserDetails();

  useEffect(() => {
    if (userDetails.lat && userDetails.long) {
      searchParams.set("lat", userDetails.lat);
      searchParams.set("long", userDetails.long);
      setSearchParams(searchParams, { replace: true });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          searchParams.set("lat", position.coords.latitude);
          searchParams.set("long", position.coords.longitude);
          setSearchParams(searchParams, { replace: true });
        });
      }
    }
  }, [userDetails, searchParams, setSearchParams]);

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
  sortBy = "location",
  sortOrder = "asc",
  page = 1,
  pageSize = 24,
  lat,
  long,
} = {}) {
  let query = `page=${page}&pageSize=${pageSize}&search=${search}&selectedBreed=${selectedBreed}&selectedLifeStage=${selectedLifeStage}&selectedGender=${selectedGender}&selectedHealthProblem=${selectedHealthProblem}&selectedUser=${selectedUser}&selectedColor=${selectedColor}&sortBy=${sortBy}&sortOrder=${sortOrder}&lat=${lat}&long=${long}`;
  query = query.replace(/&[^=]+=(?=&|$)/g, "");

  const response = await fetch(`http://localhost:3000/cats?${query}`);
  return await response.json();
}

export function loader({ request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  return defer({
    cats: loadCats({
      page: parseInt(params.page || "1"),
      pageSize: parseInt(params.pageSize || "24"),
      search: params.search || "",
      selectedBreed: params.selectedBreed || "",
      selectedLifeStage: params.selectedLifeStage || "",
      selectedGender: params.selectedGender || "",
      selectedHealthProblem: params.selectedHealthProblem || "",
      selectedUser: params.selectedUser || "",
      selectedColor: params.selectedColor || "",
      sortBy: params.sortBy || "location",
      sortOrder: params.sortOrder || "asc",
      lat: params.lat,
      long: params.long,
    }),
  });
}
