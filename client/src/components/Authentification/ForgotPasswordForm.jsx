import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./Authentification.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function ForgotPasswordForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
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
        className="authForm"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        {!submitted ? (
          <Form method="post">
            <h2>Forgot Your Password?</h2>
            <p>Please provide your email address to reset your password.</p>
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
                type="button"
                onClick={() => navigate("/login")}
                className="cancel"
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={isSubmitting}
                className="submit"
              >
                Submit
              </motion.button>
            </div>
          </Form>
        ) : (
          <div>
            <h1>
              <FontAwesomeIcon icon={faEnvelope} size="1x" />
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
