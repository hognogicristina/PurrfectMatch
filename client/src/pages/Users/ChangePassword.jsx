import { getAuthToken } from "../../util/auth.js";
import ChangeUsernameProfile from "../../components/User/ChangePasswordProfile.jsx";

function ChangePasswordPage() {
  return <ChangeUsernameProfile />;
}

export default ChangePasswordPage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/user/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword: data.get("currentPassword"),
      newPassword: data.get("newPassword"),
      confirmPassword: data.get("confirmPassword"),
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
