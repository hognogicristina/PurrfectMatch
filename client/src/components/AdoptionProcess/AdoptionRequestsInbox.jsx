import "../../styles/PurrfectMatch/Adoption.css";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import { getAuthToken } from "../../util/auth.js";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaAngleDoubleRight, FaBan, FaRegCheckCircle } from "react-icons/fa";
import MailSection from "../Util/Custom/Inbox/MailSection.jsx";

function AdoptionRequestsInbox({ mails }) {
  const { data, error } = mails;
  const [selectedMailId, setSelectedMailId] = useState(null);
  const [mailDetails, setMailDetails] = useState({});
  const { notifyError } = useToast();
  const [receivedItemsToShow, setReceivedItemsToShow] = useState(1);
  const [sentItemsToShow, setSentItemsToShow] = useState(1);
  const [isReceivedExpanded, setIsReceivedExpanded] = useState(true);
  const [isSentExpanded, setIsSentExpanded] = useState(true);

  const openMail = async (id) => {
    if (selectedMailId === id) {
      setSelectedMailId(null);
      setMailDetails({});
      return;
    }

    const token = getAuthToken();
    const response = await fetch(`http://localhost:3000/adopt/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const mailData = await response.json();
      setSelectedMailId(id);
      setMailDetails(mailData.data);

      markMailAsRead(id);
    } else {
      const mailError = await response.json();
      notifyError(mailError.error.message);
      setMailDetails({});
    }
  };

  const markMailAsRead = (id) => {
    if (data) {
      data.receivedRequests = data.receivedRequests.map((mail) =>
        mail.id === id ? { ...mail, isRead: true } : mail,
      );
    }
  };

  const getStatusIcon = (status) => {
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

  const renderMailDetails = () => {
    if (
      !selectedMailId ||
      !mailDetails ||
      Object.keys(mailDetails).length === 0
    ) {
      return null;
    }

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
      } else {
        const mailError = await response.json();
        notifyError(mailError.error.message);
      }
    };

    return (
      <div className="mailDetails">
        <div className="details">
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
          <img src={mailDetails.image} alt="cat" className="cat-image" />
          <span>{getStatusIcon(mailDetails.status)}</span>
          {mailDetails.address && <span>Address: {mailDetails.address}</span>}

          {mailDetails.status === "pending" && mailDetails.isReceived && (
            <div className="response-buttons">
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
      </div>
    );
  };

  return (
    <div className="adoption-requests">
      <h1>Adoption Requests</h1>
      <div className={"mails-container"}>
        <div
          className={`mails-list ${!selectedMailId ? "full-width" : "min-width"}`}
        >
          {data && (
            <>
              <MailSection
                title="Received Mails"
                mails={data.receivedRequests}
                selectedMailId={selectedMailId}
                openMail={openMail}
                getStatusIcon={getStatusIcon}
                itemsToShow={receivedItemsToShow}
                setItemsToShow={setReceivedItemsToShow}
                isExpanded={isReceivedExpanded}
                setIsExpanded={setIsReceivedExpanded}
                mailDetails={mailDetails}
              />
              <MailSection
                title="Sent Mails"
                mails={data.sentRequests}
                selectedMailId={selectedMailId}
                openMail={openMail}
                getStatusIcon={getStatusIcon}
                itemsToShow={sentItemsToShow}
                setItemsToShow={setSentItemsToShow}
                isExpanded={isSentExpanded}
                setIsExpanded={setIsSentExpanded}
                mailDetails={mailDetails}
              />
            </>
          )}
          {error && error.field === "server" && notifyError(error.message)}
        </div>
        {selectedMailId && renderMailDetails()}
      </div>
    </div>
  );
}

export default AdoptionRequestsInbox;
