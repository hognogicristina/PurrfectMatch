import { Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { Suspense } from "react";

function CatsRootLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Outlet />
    </Suspense>
  );
}

export default CatsRootLayout;
