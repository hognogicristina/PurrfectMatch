import { Outlet, useRouteLoaderData } from "react-router-dom";
import CatsNavigation from "../../components/Layout/CatsNavigation.jsx";

function CatsRootLayout() {
  const data = useRouteLoaderData("cat-details");

  return (
    <>
      <CatsNavigation />
      <Outlet />
    </>
  );
}

export default CatsRootLayout;
