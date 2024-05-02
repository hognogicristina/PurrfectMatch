import ActivationForm from "../components/Authentification/ActivationForm.jsx";

function ActivationPage() {
  return <ActivationForm />;
}

export default ActivationPage;

export async function action({ request, params }) {
  const data = await request.formData();
  const userId = params.id;

  const response = await fetch(`http://localhost:3000/reset/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: data.get("token"),
      signature: data.get("signature"),
      expires: data.get("expires"),
    }),
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return response;
  }

  return response;
}
