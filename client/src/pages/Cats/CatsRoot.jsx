import { Outlet } from "react-router-dom";
import CatsNavigation from "../../components/Layout/CatsNavigation.jsx";

function CatsRootLayout() {
  return (
    <>
      <CatsNavigation />
      <Outlet />
    </>
  );
}

export default CatsRootLayout;
