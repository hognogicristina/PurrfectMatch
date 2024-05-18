import { getAuthToken } from "../../util/auth.js";
import ChangeUsernameForm from "../../components/Profile/ChangeUsernameForm.jsx";
import { useRouteLoaderData } from "react-router-dom";

function ChangeUsernamePage() {
  const data = useRouteLoaderData("user-details");
  return <ChangeUsernameForm userDetail={data.userDetail} />;
}

export default ChangeUsernamePage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  return await fetch("http://localhost:3000/user/username", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: data.get("username"),
      password: data.get("password"),
    }),
  });
}
