import { getAuthToken } from "../../util/auth.js";
import MyProfileEdit from "../../components/User/MyProfileEdit.jsx";

function EditUserInfoPage() {
  return <MyProfileEdit />;
}

export default EditUserInfoPage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/user/edit", {
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
      experienceLevel: data.get("experienceLevel"),
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
