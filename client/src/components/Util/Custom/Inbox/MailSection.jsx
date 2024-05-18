import { useState } from "react";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";
import { BiCollapseVertical, BiExpandVertical } from "react-icons/bi";

const MailSection = ({
  title,
  mails,
  selectedMailId,
  openMail,
  getStatusIcon,
  itemsToShow,
  setItemsToShow,
  isExpanded,
  setIsExpanded,
  mailDetails,
}) => {
  return (
    <div
      className={`mail-section ${selectedMailId && "max-width-mail-section"}`}
    >
      <div className="section-header">
        <h2>{title}</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <BiCollapseVertical /> : <BiExpandVertical />}
        </motion.button>
      </div>
      {isExpanded && (
        <>
          {mails.length > 0 ? (
            <ul>
              {mails.slice(0, itemsToShow).map((mail) => (
                <div
                  className={`mail-item ${mail.isRead ? "unread" : ""}`}
                  key={mail.id}
                >
                  <div className="icon-wrapper">
                    {!mail.isRead && <FaCircle className="unread-icon" />}
                  </div>
                  <li
                    className={`adoption-request-item ${
                      !mail.isRead ? "unread-mail" : ""
                    } ${selectedMailId === mail.id ? "selected-mail" : ""}`}
                    onClick={() => openMail(mail.id)}
                  >
                    <div className="mail-content">
                      <div className="header">
                        <span className="subject">{mail.subject}</span>
                        <span className="date">{mail.date}</span>
                      </div>
                      <div className="details">
                        <span className="from">From: {mail.from.name}</span>
                        <span className="status">
                          {getStatusIcon(mail.status)}
                        </span>
                      </div>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <p className="errorMessageCats">{mails.message}</p>
          )}
          {mails.length > itemsToShow && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="mailButton"
              onClick={() => setItemsToShow(itemsToShow + 3)}
            >
              Explore more
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default MailSection;
