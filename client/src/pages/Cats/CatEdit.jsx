import { getAuthToken } from "../../util/auth.js";
import CatEditForm from "../../components/Cat/CatEditForm.jsx";

function CatEditPage() {
  return <CatEditForm />;
}

export default CatEditPage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  return await fetch("http://localhost:3000/cats/add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.get("name"),
      uri: data.get("uri"),
      breed: data.get("breed"),
      gender: data.get("gender"),
      age: data.get("age"),
      healthProblem: data.get("healthProblem"),
      description: data.get("description"),
    }),
  });
}
