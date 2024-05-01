import React from "react";
import LoginForm from "../components/Authentification/LoginForm.jsx";
import { redirect } from "react-router-dom";

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;

export async function action({ request }) {
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usernameOrEmail: data.get("usernameOrEmail"),
      password: data.get("password"),
    }),
    credentials: "include",
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return response;
  }

  const dataRes = await response.json();
  localStorage.setItem("token", dataRes.token);
  return redirect("/");
}
