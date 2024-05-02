import React, { useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import styles from "./ActivationForm.module.css";
import { motion } from "framer-motion";

export default function ActivationForm() {
  const data = useActionData();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (data && data.error) {
      setErrorMessage(data.error.map((err) => err.message).join(", "));
    } else if (data && data.status) {
      setSuccessMessage(data.status);
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className={styles.motionDiv}
      >
        {errorMessage ? (
          <>
            <h1>We are sorry to inform you...</h1>
            <p>{errorMessage}</p>
          </>
        ) : (
          <>
            <h1>{successMessage || "Welcome!"}</h1>
            <p>
              You can now use our platform and enjoy your journey in finding a
              new friend. For login, you can press the button below.
            </p>
            <button
              className={styles.loginButton}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}
        <ToastContainer
          position="top-center"
          autoClose={6000}
          closeButton={false}
        />
      </motion.div>
    </div>
  );
}
