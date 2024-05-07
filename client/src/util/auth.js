import { redirect } from "react-router-dom";

export function extractJwt(jwt) {
  const jwtParts = jwt.split(".");
  return JSON.parse(atob(jwtParts[1]));
}

export function extractExpiration(jwt) {
  const payload = extractJwt(jwt);
  const expirationTimestamp = payload.exp * 1000;
  const expirationDate = new Date(expirationTimestamp);
  return expirationDate.toISOString();
}

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  return expirationDate.getTime() - now.getTime();
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) {
    return "EXPIRED";
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
