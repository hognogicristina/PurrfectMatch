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
import CatsRootLayout from "./pages/Cats/CatsRoot.jsx";
import CatDetailPage, { loader as loadCat } from "./pages/Cats/CatDetail.jsx";
import CatAddPage, { action as actionCatAdd } from "./pages/Cats/CatAdd.jsx";
import {
  checkAuthLoader,
  checkLoginLoader,
  checkLogoutLoader,
  tokenLoader,
} from "./util/auth.js";
import MyProfileDetailPage, {
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
import UploadImage, {
  action as actionUploadImage,
} from "./pages/Util/UploadImage.jsx";
import NotFoundPage from "./components/Util/Custom/NotFound.jsx";
import { ToastProvider } from "./components/Util/Custom/ToastProvider.jsx";
import UploadsImage, {
  action as actionUploadsImage,
} from "./pages/Util/UploadsImages.jsx";
import SendToAdoptionCatsPage, {
  loader as loadSendToAdoptionCats,
} from "./pages/UserCatsList/SendToAdoptionCats.jsx";
import OwnedCatsPage, {
  loader as loadOwnedCats,
} from "./pages/UserCatsList/OwnedCats.jsx";
import FavoritesPage, {
  loader as loadFavorites,
} from "./pages/Cats/Favorites.jsx";

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
        path: "*",
        element: <NotFoundPage />,
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
            element: <CatAddPage />,
            action: actionCatAdd,
            loader: checkAuthLoader,
          },
          {
            path: "cat/:id",
            element: <CatDetailPage />,
            loader: loadCat,
          },
        ],
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
        loader: loadFavorites,
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
        path: "user",
        element: <UserRootLayout />,
        id: "user-details",
        loader: loadUser,
        children: [
          {
            index: true,
            element: <MyProfileDetailPage />,
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
            path: "cats-sent-to-adoption",
            element: <SendToAdoptionCatsPage />,
            loader: loadSendToAdoptionCats,
          },
          {
            path: "cats-owned",
            element: <OwnedCatsPage />,
            loader: loadOwnedCats,
          },
        ],
      },
      {
        path: "upload",
        element: <UploadImage />,
        action: actionUploadImage,
      },
      {
        path: "uploads",
        element: <UploadsImage />,
        action: actionUploadsImage,
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
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
