import RegisterForm from "../components/Authentification/RegisterForm.jsx";

function RegisterPage() {
  return <RegisterForm />;
}

export default RegisterPage;

export async function action({ request }) {
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      birthday: data.get("birthday"),
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
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
