import { Await, defer, useLoaderData } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";
import { Suspense } from "react";
import CatItem from "../../components/Cat/CatItem.jsx";

function CatDetail() {
  const { catDetail } = useLoaderData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={catDetail}>
        {(loadedCatDetail) => <CatItem catDetail={loadedCatDetail} />}
      </Await>
    </Suspense>
  );
}

export default CatDetail;

async function loadCat(id) {
  const response = await fetch(`http://localhost:3000/cats/cat/${id}`);
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

export function loader({ params }) {
  const { id } = params;

  return defer({
    catDetail: loadCat(id),
  });
}
