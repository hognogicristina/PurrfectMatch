import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import styles from "./AuthForm.module.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function ForgotPasswordForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.error) {
        data.error.forEach((error) => {
          toast.error(error.message);
        });
      } else if (data.status) {
        setSubmitted(true);
      }
    }
  }, [data]);

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["pink-container"]}>
        <motion.div
          className={styles["auth-form"]}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {!submitted ? (
            <Form method="post">
              <h2>Reset Password</h2>
              <p>Please provide your email address to reset your password.</p>
              <label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </label>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          ) : (
            <div>
              <h2>
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
              </h2>
              <h2>Email Sent</h2>
              <p>{data.status}</p>
            </div>
          )}
          <ToastContainer
            position="top-center"
            autoClose={6000}
            closeButton={false}
          />
        </motion.div>
      </div>
    </div>
  );
}
