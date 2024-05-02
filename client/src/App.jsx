import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root.jsx";
import HomePage, { loader as loadCats } from "./pages/Home.jsx";
import LoginPage, { action as actionLogin } from "./pages/Login.jsx";
import RegisterPage, { action as actionRegister } from "./pages/Register.jsx";
import ForgotPasswordPage, {
  action as actionForgot,
} from "./pages/ForgotPassword.jsx";
import ResetPasswordPage, {
  action as actionReset,
} from "./pages/ResetPassword.jsx";
import ActivationPage, {
  action as actionActivate,
} from "./pages/Activation.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    children: [
      { index: true, element: <HomePage />, loader: loadCats },
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
    action: actionActivate,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
