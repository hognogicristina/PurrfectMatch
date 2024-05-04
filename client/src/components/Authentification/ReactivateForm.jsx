import "./Authentification.css";
import { motion } from "framer-motion";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function ReactivateForm() {
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
    <div className="authContainer">
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="authForm"
      >
        {!submitted ? (
          <Form method="post">
            <h1>Reactivate Account</h1>
            <p>
              In order for us to send you a reactivation link, please enter your
              email below:
            </p>
            <label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </label>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={isSubmitting}
              className="submit"
            >
              Reactivate Account
            </motion.button>
          </Form>
        ) : (
          <div>
            <h1>
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </h1>
            <h1>Email Sent</h1>
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
  );
}
