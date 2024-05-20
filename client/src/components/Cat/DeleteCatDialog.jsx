import { Form } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import "../../styles/Auth/MyProfile.css";
import { getAuthToken } from "../../util/auth.js";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeleteCatDialog({ onClose, cat }) {
  const { notifyError } = useToast();
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
    const name = e.target.name.value;

    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/cats/delete/${cat.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      },
    );

    if (response.ok) {
      onClose();
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
              <h1 className="titleFontRed">
                Are you sure you want to delete this cat?
              </h1>
              <p>
                This action is irreversible. Once you delete the cat, all the
                data will be lost.
              </p>
              <p>
                To verify, type the cat's name{" "}
                <strong>
                  <em className="unSelect">{cat.name}</em>
                </strong>{" "}
                below:
              </p>
              <label>
                <input className="deleteAccountInput" name="name" type="text" />
                {errors.name && <p className="errorText">{errors.name}</p>}
              </label>
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={isSubmitting}
                type="submit"
                className={`simpleButton delete ${isSubmitting ? "submitting" : ""}`}
              >
                {isSubmitting
                  ? "Deleting the cat, please wait.."
                  : "Confirm Deletion"}
              </motion.button>
            </Form>
          </motion.div>
        </div>
      )}
    </>
  );
}
