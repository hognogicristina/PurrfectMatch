import "./Authentification.css";
import { motion } from "framer-motion";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../Util/Custom/ToastProvider.jsx";

export default function ReactivateForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.error) {
        data.error.forEach((error) => {
          notifyError(error.message);
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
              className="submitButton submit"
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
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => navigate("/login")}
              className="simpleButton submit"
            >
              Return to Log In
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
