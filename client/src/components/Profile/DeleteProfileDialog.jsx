import { Form, useActionData, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import "../../styles/Auth/MyProfile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function DeleteProfile() {
  const { notifyError } = useToast();
  const data = useActionData();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data && data.error) {
      const newErrors = {};
      data.error.forEach((error) => {
        if (error.field === "server" || error.field === "invalid") {
          notifyError(error.message);
        }
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
    }
  }, []);

  const handleClose = () => {
    navigate("/user");
  };

  return (
    <div className="dialogOverlay">
      <motion.div
        className="dialog"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <div className="closeButton" onClick={handleClose}>
          <FontAwesomeIcon icon={faXmark} className="faXmark" />
        </div>
        <Form method="delete" className="deleteAccountContainer">
          <h1 className="titleFontRed">Delete Account</h1>
          <p>
            Deleting your account will remove all your data and you will not be
            able to recover it.
          </p>
          <p>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <p>
            Please enter your username or email to confirm that you understand
            the consequences of deleting your account.
          </p>
          <label>
            <input className="deleteAccountInput" name="username" type="text" />
            {errors.username && <p className="errorText">{errors.username}</p>}
          </label>
          <p>
            To verify, type{" "}
            <strong>
              <em className="unSelect">delete my account</em>
            </strong>{" "}
            below:
          </p>
          <label>
            <input
              className="deleteAccountInput"
              name="messageConfirm"
              type="text"
            />
            {errors.messageConfirm && (
              <p className="errorText">{errors.messageConfirm}</p>
            )}
          </label>
          <p>Confirm your password:</p>
          <label>
            <input
              className="deleteAccountInput"
              name="password"
              type="password"
            />
            {errors.password && <p className="errorText">{errors.password}</p>}
          </label>
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            type="submit"
            className={`simpleButton delete ${isSubmitting ? "submitting" : ""}`}
          >
            {isSubmitting
              ? "Deleting your account, please wait.."
              : "I understand the consequences, delete my account"}
          </motion.button>
        </Form>
      </motion.div>
    </div>
  );
}
