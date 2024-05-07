import { getAuthToken } from "../../util/auth.js";
import ChangeUsernameProfile from "../../components/User/ChangeUsernameProfile.jsx";

function ChangeUsernamePage() {
  return <ChangeUsernameProfile />;
}

export default ChangeUsernamePage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/user/username", {
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

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return data;
  }

  return data.status;
}
