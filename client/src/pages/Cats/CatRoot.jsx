import { Outlet } from "react-router-dom";
import CatNavigation from "../../components/Layout/CatNavigation.jsx";

function CatRootLayout() {
  return (
    <>
      <CatNavigation />
      <Outlet />
    </>
  );
}

export default CatRootLayout;
