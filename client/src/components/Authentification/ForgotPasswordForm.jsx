import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "../../styles/Auth/Authentification.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import LoadingSpinner from "../Util/Custom/PageResponse/LoadingSpinner.jsx";

export default function ForgotPasswordForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { notifyError } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="authContainer">
      {!submitted ? (
        <motion.div
          className="authForm"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
          }}
        >
          <Form method="post">
            <h2>Forgot Your Password?</h2>
            <p className="reset">
              Please provide your email address to reset your password.
            </p>
            <label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </label>
            <div className="buttonContainer">
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={isSubmitting}
                type="submit"
                className={`submitButton submit ${isSubmitting ? "submitting" : ""}`}
              >
                {isSubmitting ? "Submitting.." : "Submit"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => navigate(-1)}
                className="cancelButton"
              >
                Cancel
              </motion.button>
            </div>
          </Form>
        </motion.div>
      ) : (
        <motion.div
          className="authForm"
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          <div className="confirmContainer">
            <h1>
              <FontAwesomeIcon icon={faEnvelope} size="1x" />
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
        </motion.div>
      )}
    </div>
  );
}
