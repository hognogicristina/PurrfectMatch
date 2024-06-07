import ForgotPasswordForm from "../../components/Authentification/ForgotPasswordForm.jsx";

function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

export default ForgotPasswordPage;

export async function action({ request }) {
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.get("email"),
    }),
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404 ||
    response.status === 408 ||
    response.status === 500
  ) {
    return response;
  }

  return data;
}
