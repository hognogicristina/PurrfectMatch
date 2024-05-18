import { getAuthToken } from "../../util/auth.js";
import MyProfileForm from "../../components/Profile/MyProfileForm.jsx";
import { useRouteLoaderData } from "react-router-dom";

function ModifyMyProfilePage() {
  const data = useRouteLoaderData("user-details");
  return <MyProfileForm userDetail={data.userDetail} />;
}

export default ModifyMyProfilePage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  return await fetch("http://localhost:3000/user/edit", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      uri: data.get("uri"),
      email: data.get("email"),
      birthday: data.get("birthday"),
      description: data.get("description"),
      hobbies: data.get("hobbies"),
      experienceLevel: parseInt(data.get("experienceLevel"), 10),
    }),
  });
}
