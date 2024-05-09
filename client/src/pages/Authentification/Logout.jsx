import { Form, redirect, useLoaderData, useNavigation } from "react-router-dom";
import { extractJwt, getAuthToken } from "../../util/auth.js";
import "../../styles/Logout.css";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../components/Util/Custom/ToastProvider.jsx";

function Logout() {
  const data = useLoaderData();
  const token = getAuthToken();
  const { notifyError } = useToast();
  const username = token ? extractJwt(token).username : "";
  const image = token ? extractJwt(token).image : "";

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data && data.error) {
      notifyError(data.error[0].message);
    }
  }, []);

  const renderUserImage = () => {
    if (image) {
      return <img className="userImage" src={image} alt="user" />;
    } else {
      return <FontAwesomeIcon icon={faUserCircle} className="userIcon" />;
    }
  };

  return (
    <div className="containerLogout">
      <Form method="post" action="/logout">
        <motion.h1
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="titleLogout"
        >
          Select account to sign out
        </motion.h1>
        <div>
          <motion.div
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="formLogout"
          >
            <div className="imageContainer">{renderUserImage()}</div>
            <h2 className="subtitleLogout">
              Signed in as <span className="username">{username}</span>
            </h2>
            <button className="link" disabled={isSubmitting} type="submit">
              Logout
            </button>
          </motion.div>
        </div>
      </Form>
    </div>
  );
}

export default Logout;

export async function action() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 500
  ) {
    return response.json();
  }

  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  return redirect("/");
}
