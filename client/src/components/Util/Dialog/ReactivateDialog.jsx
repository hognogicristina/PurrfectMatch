import React, { useState, useEffect } from "react";
import "./ReactivateDialog.css";
import { motion, AnimatePresence } from "framer-motion";

function ReactivateDialog({ title, message, onClose, onConfirm }) {
  const [isOpen, setIsOpen] = useState(true);
  const splitMessage = message.split(/(?<=\.\s)/);

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
            <p>
              {splitMessage[0]}
              <br />
              {splitMessage[1]}
            </p>
            <div className="dialogButtons">
              <button onClick={handleClose}>Cancel</button>
              <button onClick={onConfirm}>Confirm</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ReactivateDialog;
