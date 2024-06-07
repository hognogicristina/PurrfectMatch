import { getAuthToken } from "../../util/auth.js";
import { redirect } from "react-router-dom";
import DeleteProfileDialog from "../../components/Profile/DeleteProfileDialog.jsx";

function DeleteProfilePage() {
  return <DeleteProfileDialog />;
}

export default DeleteProfilePage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/user/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.get("username"),
      messageConfirm: data.get("messageConfirm"),
      password: data.get("password"),
    }),
    credentials: "include",
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404 ||
    response.status === 500
  ) {
    return response.json();
  }

  localStorage.removeItem("token");
  return redirect("/");
}
