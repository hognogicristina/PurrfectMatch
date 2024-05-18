import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";
import { getAuthToken } from "../../../../util/auth.js";
import { useToast } from "../PageResponse/ToastProvider.jsx";

const MailItem = ({
  mail,
  isSelected,
  openMail,
  getStatusIcon,
  setMailDetails,
}) => {
  const { notifyError } = useToast();

  const handleResponse = async (status) => {
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/adopt/${mail.id}/response`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      },
    );

    if (response.ok) {
      const mailData = await response.json();
      setMailDetails(mailData.data);
    } else {
      const mailError = await response.json();
      notifyError(mailError.error.message);
    }
  };

  return (
    <motion.div
      initial={{ x: "-9vh", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 20 }}
      className={`mailItem ${mail.isRead ? "unread" : ""}`}
    >
      <div className="icon-wrapper">
        {!mail.isRead && <FaCircle className="unreadIcon" />}
      </div>
      <li
        className={`adoptionRequestItem ${
          !mail.isRead ? "unreadMail" : ""
        } ${isSelected ? "selected-mail" : ""}`}
        onClick={() => openMail(mail.id)}
      >
        <div className="mailContent">
          <div className="header">
            <span className="subject">{mail.subject}</span>
            <span className="date">{mail.date}</span>
          </div>
          <div className="details">
            <span className="from">From: {mail.from.name}</span>
            <span className="status">{getStatusIcon(mail.status)}</span>
          </div>
        </div>
      </li>
      {mail.status === "pending" && mail.isReceived && (
        <div className="responseButtons">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="simpleButton accept"
            onClick={() => handleResponse("accepted")}
          >
            Accept
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="simpleButton delete"
            onClick={() => handleResponse("declined")}
          >
            Decline
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default MailItem;
