import "./Authentification.css";
import { motion } from "framer-motion";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../Util/Custom/ToastProvider.jsx";
import { Spinner } from "../Util/Custom/Spinner.jsx";

export default function ReactivateForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
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
      {!submitted ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
          }}
          className="authForm"
        >
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
              disabled={isSubmitting}
              type="submit"
              className={`submitButton submit ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? <Spinner /> : "Reactivate Account"}
            </motion.button>
          </Form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
          }}
          className="authForm"
        >
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
        </motion.div>
      )}
    </div>
  );
}
