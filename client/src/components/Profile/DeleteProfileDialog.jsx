import { Form, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import "../../styles/Auth/MyProfile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getAuthToken } from "../../util/auth.js";

export default function DeleteProfileDialog({ onClose }) {
  const { notifyError } = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    if (!isDialogOpen) {
      onClose();
    }
  }, [onClose, isDialogOpen]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const username = e.target.username.value;
    const messageConfirm = e.target.messageConfirm.value;
    const password = e.target.password.value;

    const token = getAuthToken();
    const response = await fetch("http://localhost:3000/user/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        messageConfirm,
        password,
      }),
    });

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      navigate("/");
    } else {
      const errorData = await response.json();
      if (errorData.error[0].field === "invalid") {
        notifyError(errorData.error[0].message);
      }

      const newErrors = {};
      errorData.error.forEach((error) => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {isDialogOpen && (
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
            <Form onSubmit={handleDelete} className="deleteAccountContainer">
              <h1 className="titleFontRed">Delete Account</h1>
              <p>
                Deleting your account will remove all your data and you will not
                be able to recover it.
              </p>
              <p>
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <p>
                Please enter your username or email to confirm that you
                understand the consequences of deleting your account.
              </p>
              <label>
                <input
                  className="deleteAccountInput"
                  name="username"
                  type="text"
                />
                {errors.username && (
                  <p className="errorText">{errors.username}</p>
                )}
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
                {errors.password && (
                  <p className="errorText">{errors.password}</p>
                )}
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
      )}
    </>
  );
}
