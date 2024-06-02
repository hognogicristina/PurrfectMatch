import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import RootLayout from "./pages/Main/Root.jsx";
import HomePage, { loader as loadHome } from "./pages/Main/Home.jsx";
import LoginPage, {
  action as actionLogin,
} from "./pages/Authentification/Login.jsx";
import LogoutPage, {
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
import CatsRootLayout from "./pages/Main/CatsRoot.jsx";
import CatProfilePage, { loader as loadCat } from "./pages/Cats/CatProfile.jsx";
import AddCatPage, { action as actionCatAdd } from "./pages/Cats/AddCat.jsx";
import {
  checkAuthLoader,
  checkLoginLoader,
  checkLogoutLoader,
  tokenLoader,
} from "./util/auth.js";
import MyProfilePage, {
  loader as loadUser,
} from "./pages/Profile/MyProfile.jsx";
import UserRootLayout from "./pages/Main/UserRoot.jsx";
import ModifyMyProfilePage, {
  action as actionEditUser,
} from "./pages/Profile/ModifyMyProfile.jsx";
import ChangeUsernamePage, {
  action as actionChangeUsername,
} from "./pages/Profile/ChangeUsername.jsx";
import ModifyAddressPage, {
  action as actionEditAddress,
} from "./pages/Profile/ModifyAddress.jsx";
import ChangePasswordPage, {
  action as actionChangePassword,
} from "./pages/Profile/ChangePassword.jsx";
import NotFoundPage from "./components/Util/Custom/PageResponse/NotFound.jsx";
import { ToastProvider } from "./components/Util/Custom/PageResponse/ToastProvider.jsx";
import FelinesRecordsPage, {
  loader as loadSendToAdoptionCats,
} from "./pages/PurrfectMatch/FelinesRecords.jsx";
import OwnedArchivePage, {
  loader as loadOwnedCats,
} from "./pages/PurrfectMatch/OwnedArchive.jsx";
import FavoritesPage, {
  loader as loadFavorites,
} from "./pages/Cats/Favorites.jsx";
import AdoptionRequestsPage, {
  loader as loadAdoptionRequestsPage,
} from "./pages/AdoptionProcess/AdoptionsRequests.jsx";
import UserProfilePage, {
  loader as loadUserProfile,
} from "./pages/Profile/UserProfile.jsx";
import ArchiveOfUsersPage, {
  loader as loadArchiveOfUsers,
} from "./pages/PurrfectMatch/ArchiveOfUsers.jsx";
import { useState } from "react";
import DeleteProfilePage, {
  action as actionDeleteUser,
} from "./pages/Profile/DeleteProfile.jsx";
import { WebSocketProvider } from "./context/WebSocketContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: loadHome,
      },
      {
        path: "cats",
        element: <CatsRootLayout />,
        id: "cat-details",
        children: [
          {
            index: true,
            element: <CatsPage />,
            loader: loadCats,
          },
          {
            path: "add",
            element: <AddCatPage />,
            action: actionCatAdd,
            loader: checkAuthLoader,
          },
          {
            path: "cat/:id",
            element: <CatProfilePage />,
            loader: loadCat,
          },
        ],
      },
      {
        loader: checkAuthLoader,
        children: [
          {
            path: "favorites",
            element: <FavoritesPage />,
            loader: loadFavorites,
          },
          {
            path: "adopts",
            element: <AdoptionRequestsPage />,
            loader: loadAdoptionRequestsPage,
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
        element: <LogoutPage />,
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
        path: "users",
        element: <ArchiveOfUsersPage />,
        loader: loadArchiveOfUsers,
      },
      {
        path: "user-profile/:username",
        children: [
          {
            index: true,
            element: <UserProfilePage />,
            loader: loadUserProfile,
          },
          {
            path: "matches-archive",
            element: <FavoritesPage />,
            loader: loadFavorites,
          },
        ],
      },
      {
        path: "user",
        element: <UserRootLayout />,
        id: "user-details",
        loader: loadUser,
        children: [
          {
            index: true,
            element: <MyProfilePage />,
            loader: checkAuthLoader,
          },
          {
            path: "edit",
            element: <ModifyMyProfilePage />,
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
            element: <ModifyAddressPage />,
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
            element: <DeleteProfilePage />,
            action: actionDeleteUser,
            loader: checkAuthLoader,
          },
          {
            loader: checkAuthLoader,
            children: [
              {
                path: "felines-records",
                element: <FelinesRecordsPage />,
                loader: loadSendToAdoptionCats,
              },
              {
                path: "matches-archive",
                element: <OwnedArchivePage />,
                loader: loadOwnedCats,
              },
            ],
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
        loader: checkLoginLoader,
      },
    ],
  },
]);

function App() {
  return (
    <ToastProvider>
      <WebSocketProvider>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </ToastProvider>
  );
}

export default App;
