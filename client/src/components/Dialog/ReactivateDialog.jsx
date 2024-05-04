import "./ReactivateDialog.css";
import { motion } from "framer-motion";

function ReactivateDialog({ title, message, onClose, onConfirm }) {
  const splitMessage = message.split(/(?<=\.\s)/, 2);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <motion.div
        className="dialog"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        <p>
          {splitMessage[0]}
          <br />
          {splitMessage[1]}
        </p>
        <div className="dialog-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </motion.div>
    </div>
  );
}

export default ReactivateDialog;
