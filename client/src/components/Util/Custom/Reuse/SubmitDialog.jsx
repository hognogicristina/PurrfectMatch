import { motion } from "framer-motion";
import "../../../../styles/Custom/SubmitDialog.css";
import { Form } from "react-router-dom";
import { useToast } from "../PageResponse/ToastProvider.jsx";

export default function SubmitDialog({ isOpen, onClose, catDetail, token }) {
  if (!isOpen) return null;
  const { notifyError, notifySuccess } = useToast();

  const handleAdoptionMessage = async (e, message) => {
    e.preventDefault();

    if (!token) {
      notifyError("User not authenticated.");
      return;
    }

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
      if (data.error.field === "server") {
        notifyError(data.error.message);
      }
    } else {
      const data = await response.json();
      notifySuccess(data.status);
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
            >
              Cancel
            </motion.button>
          </div>
        </Form>
      </motion.div>
    </motion.div>
  );
}
