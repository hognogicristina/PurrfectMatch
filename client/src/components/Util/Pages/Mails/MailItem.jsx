import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";
import { getStatusIcon } from "./MailDetailsSection.jsx";
import { useEffect, useState } from "react";
import moment from "moment";

const itemVariants = {
  hidden: { opacity: 0, x: -50, scale: 0.8 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 50, scale: 0.8 },
};

export default function MailItem({ mail, isSelected, openMail, isSent }) {
  const [formattedDate, setFormattedDate] = useState(mail.date);

  useEffect(() => {
    const updateFormattedDate = () => {
      const dateSent = moment(mail.dateTime);
      const now = moment();
      const diffWeeks = now.diff(dateSent, "weeks");

      let newFormattedDate;
      if (diffWeeks <= 1) {
        newFormattedDate = dateSent.fromNow();
      } else {
        newFormattedDate = dateSent.format("YYYY-MM-DD");
      }

      setFormattedDate(newFormattedDate);
    };

    updateFormattedDate();
    const intervalId = setInterval(updateFormattedDate, 1000);

    return () => clearInterval(intervalId);
  }, [mail.dateTime]);

  return (
    <motion.div
      className={`mailItem ${!mail.isRead ? "unreadMail" : ""}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={itemVariants}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="iconWrapper">
        {!mail.isRead && <FaCircle className="unreadIcon" />}
      </div>
      <li
        className={`adoptionRequestItem ${isSelected ? "selectedMail" : ""}`}
        onClick={() => openMail(mail.id)}
      >
        <div>
          <div className="header">
            <span className="subject">{mail.subject}</span>
            <span className="date">{formattedDate}</span>
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
