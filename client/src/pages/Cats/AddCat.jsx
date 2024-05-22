import { getAuthToken } from "../../util/auth.js";
import AddCatForm from "../../components/Cat/AddCatForm.jsx";

function AddCatPage() {
  return <AddCatForm />;
}

export default AddCatPage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();
  const uriArray = data.get("uris").split(",");

  return await fetch("http://localhost:3000/cats/add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.get("name"),
      uris: uriArray,
      breed: data.get("breed"),
      gender: data.get("gender"),
      color: data.get("color"),
      age: data.get("age"),
      healthProblem: data.get("healthProblem"),
      description: data.get("description"),
    }),
  });
}
