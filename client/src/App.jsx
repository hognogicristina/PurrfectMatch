import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import RootLayout from "./pages/Root.jsx";
import HomePage, { loader as loadHome } from "./pages/Home.jsx";
import LoginPage, { action as actionLogin } from "./pages/Login.jsx";
import RegisterPage, { action as actionRegister } from "./pages/Register.jsx";
import ForgotPasswordPage, {
  action as actionForgot,
} from "./pages/ForgotPassword.jsx";
import ResetPasswordPage, {
  action as actionReset,
} from "./pages/ResetPassword.jsx";
import ActivationPage, { loader as loadActivate } from "./pages/Activation.jsx";
import ReactivatePage, {
  action as actionReactivate,
} from "./pages/Reactivate.jsx";
import CatsPage, { loader as loadCats } from "./pages/Cats.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: loadHome,
      },
      {
        path: "cats",
        element: <CatsPage />,
        loader: loadCats,
      },
      {
        path: "login",
        element: <LoginPage />,
        action: actionLogin,
      },
      {
        path: "register",
        element: <RegisterPage />,
        action: actionRegister,
      },
      {
        path: "reset",
        element: <ForgotPasswordPage />,
        action: actionForgot,
      },
      {
        path: "reset/:id",
        element: <ResetPasswordPage />,
        action: actionReset,
      },
    ],
  },
  {
    path: "activate/:id",
    element: <ActivationPage />,
    loader: loadActivate,
  },
  {
    path: "reactivate",
    element: <ReactivatePage />,
    action: actionReactivate,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
