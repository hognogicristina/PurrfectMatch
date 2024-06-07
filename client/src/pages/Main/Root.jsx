import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "../../components/Layout/MainNavigation.jsx";
import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import {
  getAuthToken,
  refreshAuthToken,
  getTokenDuration,
} from "../../util/auth.js";

function RootLayout() {
  const token = useLoaderData();
  const [authToken, setAuthToken] = useState(token);
  const submit = useSubmit();

  useEffect(() => {
    if (authToken) {
      const tokenDuration = getTokenDuration(authToken);

      if (tokenDuration <= 0) {
        handleTokenRefresh();
      } else {
        const timeoutId = setTimeout(handleTokenRefresh, tokenDuration - 60000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [authToken]);

  async function handleTokenRefresh() {
    const newToken = await refreshAuthToken();
    if (newToken) {
      localStorage.setItem("token", newToken);
      setAuthToken(newToken);
    } else {
      submit(null, { action: "/login", method: "post" });
    }
  }

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
