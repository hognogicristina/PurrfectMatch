import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import RootLayout from "./pages/Main/Root.jsx";
import HomePage, { loader as loadHome } from "./pages/Main/Home.jsx";
import LoginPage, {
  action as actionLogin,
} from "./pages/Authentification/Login.jsx";
import Logout, {
  action as logoutAction,
} from "./pages/Authentification/Logout.jsx";
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
import {
  checkAuthLoader,
  checkLoginLoader,
  checkLogoutLoader,
  tokenLoader,
} from "./util/auth.js";
import MyProfileDetail, {
  loader as loadUser,
} from "./pages/Users/MyProfileDetail.jsx";
import UserRootLayout from "./pages/Users/UserRoot.jsx";
import EditUserInfoPage, {
  action as actionEditUser,
} from "./pages/Users/EditUserInfo.jsx";
import ChangeUsernamePage, {
  action as actionChangeUsername,
} from "./pages/Users/ChangeUsername.jsx";
import UserEditAddressPage, {
  action as actionEditAddress,
} from "./pages/Users/UserEditAddress.jsx";
import ChangePasswordPage, {
  action as actionChangePassword,
} from "./pages/Users/ChangePassword.jsx";
import DeleteAccount, {
  action as actionDeleteAccount,
} from "./pages/Users/DeleteAccount.jsx";
import UploadImage, {
  action as actionUploadImage,
} from "./pages/Util/UploadImage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: loadHome,
      },
      {
        path: "cats",
        element: <CatRootLayout />,
        children: [
          {
            index: true,
            element: <CatsPage />,
            loader: loadCats,
          },
          {
            path: "cat",
            id: "cat-details",
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
        loader: checkLoginLoader,
      },
      {
        path: "logout",
        element: <Logout />,
        action: logoutAction,
        loader: checkLogoutLoader,
      },
      {
        path: "register",
        element: <RegisterPage />,
        action: actionRegister,
        loader: checkLoginLoader,
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
      {
        path: "user",
        id: "user-details",
        element: <UserRootLayout />,
        loader: loadUser,
        children: [
          {
            index: true,
            element: <MyProfileDetail />,
            loader: checkAuthLoader,
          },
          {
            path: "edit",
            element: <EditUserInfoPage />,
            action: actionEditUser,
            loader: checkAuthLoader,
          },
          {
            path: "username",
            element: <ChangeUsernamePage />,
            action: actionChangeUsername,
            loader: checkAuthLoader,
          },
          {
            path: "address",
            element: <UserEditAddressPage />,
            action: actionEditAddress,
            loader: checkAuthLoader,
          },
          {
            path: "password",
            element: <ChangePasswordPage />,
            action: actionChangePassword,
            loader: checkAuthLoader,
          },
          {
            path: "delete",
            element: <DeleteAccount />,
            action: actionDeleteAccount,
            loader: checkAuthLoader,
          },
        ],
      },
      {
        path: "upload",
        element: <UploadImage />,
        action: actionUploadImage,
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
