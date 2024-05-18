import { Outlet } from "react-router-dom";
import CatsNavigation from "../../components/Layout/CatsNavigation.jsx";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { Suspense } from "react";

function CatsRootLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CatsNavigation />
      <Outlet />
    </Suspense>
  );
}

export default CatsRootLayout;
