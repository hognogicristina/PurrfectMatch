import { getAuthToken } from "../../util/auth.js";
import ChangeUsernameProfile from "../../components/Profile/ChangePasswordForm.jsx";
import { useRouteLoaderData } from "react-router-dom";

function ChangePasswordPage() {
  const data = useRouteLoaderData("user-details");
  return <ChangeUsernameProfile userDetail={data.userDetail} />;
}

export default ChangePasswordPage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  return await fetch("http://localhost:3000/user/password", {
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
}
