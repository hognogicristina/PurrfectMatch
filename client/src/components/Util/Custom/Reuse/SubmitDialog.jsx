import { motion } from "framer-motion";
import "../../../../styles/Custom/SubmitDialog.css";
import { Form } from "react-router-dom";
import { useToast } from "../PageResponse/ToastProvider.jsx";
import { useState } from "react";

export default function SubmitDialog({
  isOpen,
  onClose,
  catDetail,
  token,
  onRequestSuccess,
}) {
  if (!isOpen) return null;
  const { notifyError, notifySuccess } = useToast();
  const [error, setError] = useState(null);

  const handleAdoptionMessage = async (e, message) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:3000/adopt/${catDetail.id}/request`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      },
    );

    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 500
    ) {
      const data = await response.json();
      data.error.forEach((error) => {
        if (error.field === "server") {
          notifyError(error.message);
        } else {
          setError(error.message);
        }
      });
    } else {
      const data = await response.json();
      notifySuccess(data.status);
      onRequestSuccess();
      onClose();
    }
  };

  return (
    <motion.div
      className="submitDialogOverlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="submitDialog"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <Form
          method="post"
          onSubmit={(e) => handleAdoptionMessage(e, e.target.message.value)}
          className="submitForm"
        >
          <h2>Adopt Me</h2>
          <p>
            Please leave a message for the guardian and tell them why you would
            be the perfect match for this cat.
          </p>
          <input
            name="message"
            type="text"
            placeholder="Type your message here..."
          />
          {error && <p className="errorText">{error}</p>}
          <div className="dialogActions">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="submitButton submit"
            >
              Submit
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="cancelButton"
              onClick={onClose}
              type="button"
            >
              Cancel
            </motion.button>
          </div>
        </Form>
      </motion.div>
    </motion.div>
  );
}
