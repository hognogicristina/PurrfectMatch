import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import RootLayout from "./pages/Main/Root.jsx";
import HomePage, { loader as loadHome } from "./pages/Main/Home.jsx";
import LoginPage, {
  action as actionLogin,
} from "./pages/Authentification/Login.jsx";
import RegisterPage, {
  action as actionRegister,
} from "./pages/Authentification/Register.jsx";
import ForgotPasswordPage, {
  action as actionForgot,
} from "./pages/Authentification/ForgotPassword.jsx";
import ResetPasswordPage, {
  action as actionReset,
} from "./pages/Authentification/ResetPassword.jsx";
import ActivationPage, {
  loader as loadActivate,
} from "./pages/Authentification/Activation.jsx";
import ReactivatePage, {
  action as actionReactivate,
} from "./pages/Authentification/Reactivate.jsx";
import CatsPage, { loader as loadCats } from "./pages/Cats/Cats.jsx";
import CatRootLayout from "./pages/Cats/CatRoot.jsx";
import CatDetail from "./pages/Cats/CatDetail.jsx";
import CatAdd from "./pages/Cats/CatAdd.jsx";

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
        path: "cat",
        element: <CatRootLayout />,
        children: [
          {
            index: true,
            element: <CatAdd />,
          },
          {
            path: ":id",
            element: <CatDetail />,
          },
        ],
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
