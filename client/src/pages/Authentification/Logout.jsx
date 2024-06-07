import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import "../../styles/Auth/Logout.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../components/Util/Custom/PageResponse/LoadingSpinner.jsx";
import { useToast } from "../../components/Util/Custom/PageResponse/ToastProvider.jsx";
import { useEffect } from "react";
import { useUserDetails } from "../../util/useUserDetails.js";
import { getAuthToken } from "../../util/auth.js";

function LogoutPage() {
  const data = useActionData();
  const { notifyError } = useToast();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { userDetails, isLoading } = useUserDetails();

  useEffect(() => {
    if (data && data.error) {
      notifyError(data.error[0].message);
    }
  }, [data, notifyError]);

  const renderUserImage = () => {
    if (userDetails.image) {
      return (
        <img className="userImageLogout" src={userDetails.image} alt="user" />
      );
    } else {
      return <FontAwesomeIcon icon={faUserCircle} className="userIcon" />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="containerLogout">
      <Form method="post" action="/logout">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
          }}
          className="titleLogout"
        >
          Sign out of purrfectMatch
        </motion.h1>
        <div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
            className="formLogout"
          >
            <div className="imageContainer">{renderUserImage()}</div>
            <h2 className="subtitleLogout">
              Signed in as{" "}
              <span className="username">{userDetails.username}</span>
            </h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="link logout"
              disabled={isSubmitting}
              type="submit"
            >
              Logout
            </motion.button>
          </motion.div>
        </div>
      </Form>
    </div>
  );
}

export default LogoutPage;

export async function action() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404 ||
    response.status === 408 ||
    response.status === 500
  ) {
    return response.json();
  }

  localStorage.removeItem("token");
  return redirect("/");
}
