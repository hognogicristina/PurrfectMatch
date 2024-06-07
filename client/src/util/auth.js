import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export async function refreshAuthToken() {
  try {
    const response = await fetch("http://localhost:3000/refresh/token", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
    }

    return data.newToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export function extractJwt(jwt) {
  return jwtDecode(jwt);
}

export function getTokenDuration(jwt) {
  const payload = extractJwt(jwt);
  const expirationTimestamp = payload.exp * 1000;
  const expirationDateString = new Date(expirationTimestamp);
  const storedExpirationDate = expirationDateString.toISOString();
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  return expirationDate.getTime() - now.getTime();
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/login");
  }

  return null;
}

export function checkLoginLoader() {
  const token = getAuthToken();

  if (token) {
    return redirect("/");
  }

  return null;
}

export function checkLogoutLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/");
  }

  return null;
}
