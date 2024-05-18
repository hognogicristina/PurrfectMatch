import { useState, useEffect } from "react";
import "../../../../styles/Custom/ReactivateDialog.css";
import { motion, AnimatePresence } from "framer-motion";

function ConfirmDialog({ title, message, onClose, onConfirm }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(onClose, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="dialogOverlay" onClick={handleClose}>
          <motion.div
            className="dialog"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{title}</h2>
            <p>{message}</p>
            <div className="dialogButtons">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onConfirm}
                className="submitButton submit"
              >
                Confirm
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="cancelButton"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
