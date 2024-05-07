import { getAuthToken } from "../../util/auth.js";
import EditAddressProfile from "../../components/User/EditAddressProfile.jsx";

function UserEditAddressPage() {
  return <EditAddressProfile />;
}

export default UserEditAddressPage;

export async function action({ request }) {
  const token = getAuthToken();
  const data = await request.formData();

  const response = await fetch("http://localhost:3000/user/address", {
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

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return data;
  }

  return data.status;
}
