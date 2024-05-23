import { getAuthToken } from "../../util/auth.js";
import ModifyAddressForm from "../../components/Profile/ModifyAddressForm.jsx";
import { useRouteLoaderData } from "react-router-dom";

function ModifyAddressPage() {
  const data = useRouteLoaderData("user-details");
  return <ModifyAddressForm userDetail={data.userDetail} />;
}

export default ModifyAddressPage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  return await fetch("http://localhost:3000/user/address", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      country: data.get("country"),
      county: data.get("county"),
      city: data.get("city"),
      street: data.get("street"),
      number: data.get("number"),
      floor: data.get("floor"),
      apartment: data.get("apartment"),
      postalCode: data.get("postalCode"),
    }),
  });
}
