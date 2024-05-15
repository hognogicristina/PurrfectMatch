import { getAuthToken } from "../../util/auth.js";
import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";
import FavoritesList from "../../components/Cat/FavoritesList.jsx";

function FavoritesPage() {
  const { favorites } = useLoaderData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={favorites}>
        {(loadedFavorites) => <FavoritesList favorites={loadedFavorites} />}
      </Await>
    </Suspense>
  );
}

export default FavoritesPage;

export async function loadFavorites() {
  const token = getAuthToken();

  const response = await fetch("http://localhost:3000/favorites", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export function loader() {
  return defer({
    favorites: loadFavorites(),
  });
}
