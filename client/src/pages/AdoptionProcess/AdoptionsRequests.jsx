import { getAuthToken } from "../../util/auth.js";
import { Await, defer, useLoaderData } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { Suspense } from "react";
import AdoptionRequestsInbox from "../../components/AdoptionProcess/AdoptionRequestsInbox.jsx";

function AdoptionRequestsPage() {
  const { mails } = useLoaderData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={mails}>
        {(loadedData) => <AdoptionRequestsInbox mails={loadedData} />}
      </Await>
    </Suspense>
  );
}

export default AdoptionRequestsPage;

async function loadAdoptionRequestsPage() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/adopts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export function loader() {
  return defer({
    mails: loadAdoptionRequestsPage(),
  });
}
