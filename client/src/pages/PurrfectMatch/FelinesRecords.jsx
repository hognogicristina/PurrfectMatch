import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import FelinesRecordsForm from "../../components/PurrfectMatch/FelinesRecordsForm.jsx";
import { getAuthToken } from "../../util/auth.js";

function FelinesRecordsPage() {
  const { cats } = useLoaderData();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={cats}>
        {(loadedCats) => (
          <div>
            <FelinesRecordsForm cats={loadedCats} />
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export default FelinesRecordsPage;

export async function loadCats() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/user/felines-records", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export function loader({ request }) {
  return defer({
    cats: loadCats(),
  });
}
