import { motion } from "framer-motion";
import { FaRegCheckCircle, FaBan, FaAngleDoubleRight } from "react-icons/fa";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { getAuthToken } from "../../../../util/auth.js";
import { IoTrashBin } from "react-icons/io5";

export const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaAngleDoubleRight color="gray" />
          <span style={{ marginLeft: "5px" }}>Waiting for response</span>
        </div>
      );
    case "accepted":
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaRegCheckCircle color="green" />
          <span style={{ marginLeft: "5px" }}>Response accepted</span>
        </div>
      );
    case "declined":
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaBan color="red" />
          <span style={{ marginLeft: "5px" }}>Response declined</span>
        </div>
      );
    default:
      return null;
  }
};

function MailDetailsSection({
  mails,
  mailDetails,
  setMailDetails,
  selectedMailId,
  setMessage,
  removeMailFromList,
}) {
  const { notifyError } = useToast();

  console.log(mails);

  const handleResponse = async (status) => {
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/adopt/${selectedMailId}/response`,
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

      if (mails.sentRequests === 0) {
        setMessage(mails.message);
        console.log(mails.message);
      }

      if (mails.receivedRequests.message) {
        console.log(mails.message);
        setMessage(mails.message);
      }
    } else {
      const mailError = await response.json();
      notifyError(mailError.error.message);
    }
  };

  if (!mailDetails || Object.keys(mailDetails).length === 0) {
    return null;
  }

  const handleDeleteMail = async () => {
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/adopt/${selectedMailId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      removeMailFromList(selectedMailId);
      setMailDetails({});
    } else {
      const mailError = await response.json();
      notifyError(mailError.error[0].message);
    }
  };

  return (
    <motion.div
      className="mailDetails"
      initial={{ scale: 0.7, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 18,
      }}
      key={selectedMailId}
    >
      <div className="details">
        <motion.div
          className="trashIcon"
          initial={{ scale: 1 }}
          whileTap={{ scale: 1.3, rotate: 180 }}
          onClick={handleDeleteMail}
        >
          <IoTrashBin />
        </motion.div>
        <div className="headerMail">
          {mailDetails.imageFrom ? (
            <img src={mailDetails.imageFrom} alt={mailDetails.from} />
          ) : (
            <div className="initials">{mailDetails.from.slice(0, 2)}</div>
          )}
          <div className="info">
            <h2>{mailDetails.from}</h2>
            <span className="from">{mailDetails.subject}</span>
            <span className="to">To: {mailDetails.to}</span>
          </div>
          <span className="date">{mailDetails.date}</span>
        </div>
        <p className="message">{mailDetails.message}</p>
        <span>
          {mailDetails.from} wants to adopt {mailDetails.cat}
        </span>
        <img src={mailDetails.image} alt="cat" className="catImageMail" />
        <span>{getStatusIcon(mailDetails.status)}</span>
        {mailDetails.address && <span>Address: {mailDetails.address}</span>}

        {mailDetails.status === "pending" && mailDetails.isReceived && (
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
      </div>
    </motion.div>
  );
}

export default MailDetailsSection;
