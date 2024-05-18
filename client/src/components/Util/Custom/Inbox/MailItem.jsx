import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";
import { getStatusIcon } from "./MailDetails.jsx";

const itemVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

export default function MailItem({ mail, isSelected, openMail, isSent }) {
  return (
    <motion.div
      className={`mailItem ${mail.isRead ? "unread" : ""}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={itemVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="iconWrapper">
        {!mail.isRead && <FaCircle className="unreadIcon" />}
      </div>
      <li
        className={`adoptionRequestItem ${
          !mail.isRead ? "unreadMail" : ""
        } ${isSelected ? "selectedMail" : ""}`}
        onClick={() => openMail(mail.id)}
      >
        <div className="mailContent">
          <div className="header">
            <span className="subject">{mail.subject}</span>
            <span className="date">{mail.date}</span>
          </div>
          <div className="details">
            {isSent ? (
              <span className="to">To: {mail.to.name}</span>
            ) : (
              <span className="from">From: {mail.from.name}</span>
            )}
            <span className="status">{getStatusIcon(mail.status)}</span>
          </div>
        </div>
      </li>
    </motion.div>
  );
}
