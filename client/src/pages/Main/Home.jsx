import { Suspense } from "react";
import HomeContent from "../../components/Layout/HomeContent.jsx";
import { Await, defer, useLoaderData } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";

function HomePage() {
  const { cats, breeds } = useLoaderData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={cats}>
        {(loadedCats) => (
          <Await resolve={breeds}>
            {(loadedBreeds) => (
              <HomeContent cats={loadedCats} breeds={loadedBreeds} />
            )}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

export default HomePage;

async function loadRecentCats() {
  const response = await fetch("http://localhost:3000");
  const data = await response.json();

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return data;
  }

  return data.data;
}

async function loadAllBreeds() {
  const response = await fetch("http://localhost:3000/breeds");
  const data = await response.json();

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return data;
  }

  return data.data;
}

export async function loader({ request }) {
  return defer({
    cats: loadRecentCats(),
    breeds: loadAllBreeds(),
  });
}
