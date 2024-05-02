import { redirect } from "react-router-dom";
import ResetPasswordForm from "../components/Authentification/ResetPasswordForm.jsx";

function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

export default ResetPasswordPage;

export async function action({ request, params }) {
  const data = await request.formData();
  const userId = params.id;

  const url = new URL(request.url);

  const token = url.searchParams.get("token");
  const signature = url.searchParams.get("signature");
  const expires = url.searchParams.get("expires");

  const response = await fetch(`http://localhost:3000/reset/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
      token,
      signature,
      expires,
    }),
    credentials: "include",
  });

  console.log(token, signature, expires);

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return response;
  }

  return redirect("/login");
}
