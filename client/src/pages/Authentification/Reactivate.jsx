import ReactivateForm from "../../components/Authentification/ReactivateForm.jsx";

function ReactivatePage() {
  return <ReactivateForm />;
}

export default ReactivatePage;

export async function action({ request }) {
  const data = await request.formData();

  return await fetch("http://localhost:3000/reactivate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.get("email"),
    }),
  });
}
