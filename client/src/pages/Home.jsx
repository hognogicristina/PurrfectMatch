import { Suspense } from "react";
import HomeContent from "../components/Layout/HomeContent.jsx";
import { useLoaderData } from "react-router-dom";

function HomePage() {
  const { cats, breeds } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <HomeContent cats={cats} breeds={breeds} />
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

  return data;
}

export async function loader({ request }) {
  const [cats, breeds] = await Promise.all([loadRecentCats(), loadAllBreeds()]);
  return { cats, breeds };
}
