import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import CatsList from "../components/Cat/CatsList.jsx";

function CatsPage() {
  const { cats } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={cats}>
        {(loadedCats) => <CatsList cats={loadedCats} />}
      </Await>
    </Suspense>
  );
}

export default CatsPage;

async function loadCats() {
  const response = await fetch("http://localhost:3000/cats");
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

export function loader() {
  return defer({
    cats: loadCats(),
  });
}
