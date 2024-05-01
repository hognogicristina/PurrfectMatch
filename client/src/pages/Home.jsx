import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import CatsList from "../components/Cat/CatsList.jsx";

function HomePage() {
  const { cats } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={cats}>
        {(loadedCats) => <CatsList cats={loadedCats} />}
      </Await>
    </Suspense>
  );
}

export default HomePage;

async function loadCats() {
  const response = await fetch("http://localhost:3000/cats");

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not fetch cats." }), {
      status: 500,
    });
  } else {
    const resData = await response.json();
    return resData.data;
  }
}

export function loader() {
  return defer({
    cats: loadCats(),
  });
}
