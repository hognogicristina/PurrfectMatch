import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "../../components/Layout/MainNavigation.jsx";
import { Suspense, useEffect } from "react";
import { getTokenDuration } from "../../util/auth.js";
import LoadingSpinner from "../../components/Util/Custom/LoadingSpinner.jsx";

function RootLayout() {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    const tokenDuration = getTokenDuration();
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </Suspense>
  );
}

export default RootLayout;
