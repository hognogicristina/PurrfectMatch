import { getAuthToken } from "../../util/auth.js";
import { redirect, useRouteLoaderData } from "react-router-dom";
import DeleteProfile from "../../components/User/DeleteProfile.jsx";

function DeleteAccount() {
  const data = useRouteLoaderData("user-details");
  return <DeleteProfile userDetail={data.userDetail} />;
}

export default DeleteAccount;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/user/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password: data.get("password"),
    }),
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return response;
  }

  return redirect("/");
}
