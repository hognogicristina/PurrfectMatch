import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import ActivationForm from "../components/Authentification/ActivationForm.jsx";

function ActivationPage() {
  const { data } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={data}>
        {(loadedData) => <ActivationForm data={loadedData} />}
      </Await>
    </Suspense>
  );
}

export default ActivationPage;

async function loadActivate(id, token, signature) {
  const response = await fetch(
    `http://localhost:3000/activate/${id}?token=${token}&signature=${signature}`,
  );
  const data = await response.json();

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return data;
  }

  return data.status;
}

export function loader({ params, request }) {
  const { id } = params;

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const signature = url.searchParams.get("signature");

  return defer({
    data: loadActivate(id, token, signature),
  });
}
