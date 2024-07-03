import "../../styles/PurrfectMatch/Adoption.css";
import { getAuthToken } from "../../util/auth.js";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import MailSection from "../Util/Pages/Mails/MailSection.jsx";
import MailDetailsSection from "../Util/Pages/Mails/MailDetailsSection.jsx";
import { useWebSocket } from "../../context/WebSocketContext";

function AdoptionRequestsInbox({ mails }) {
  const { data, error, userDetails } = mails;
  const [selectedMailId, setSelectedMailId] = useState(null);
  const [mailDetails, setMailDetails] = useState({});
  const { notifyError, notifySuccess } = useToast();
  const [receivedItemsToShow, setReceivedItemsToShow] = useState(1);
  const [sentItemsToShow, setSentItemsToShow] = useState(1);
  const [isReceivedExpanded, setIsReceivedExpanded] = useState(true);
  const [isSentExpanded, setIsSentExpanded] = useState(true);
  const { messages } = useWebSocket();

  const [mailsData, setMailsData] = useState(data);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        (message.type === "NEW_ADOPTION_REQUEST" ||
          message.type === "DELETE_ADOPTION_REQUEST" ||
          message.type === "ADOPTION_REQUEST_RESPONSE") &&
        message.userId === userDetails.id
      ) {
        const { sentRequests, receivedRequests } = message.payload;

        if (setSelectedMailId) {
          setSelectedMailId(null);
          setMailDetails({});
        }

        const updatedData = {
          receivedRequests,
          sentRequests,
        };
        setMailsData(updatedData);
      }
    };

    messages.forEach(handleNewMessage);
  }, [messages, userDetails.id, notifySuccess]);

  const openMail = async (id, exception) => {
    if (selectedMailId === id && exception !== "update") {
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
      mailError.forEach((error) => notifyError(error.message));
      setMailDetails({});
    }
  };

  const markMailAsRead = (id) => {
    setMailsData((prevMails) => {
      const updatedReceivedRequests = prevMails.receivedRequests.map((mail) =>
        mail.id === id ? { ...mail, isRead: true } : mail,
      );
      const updatedSentRequests = prevMails.sentRequests.map((mail) =>
        mail.id === id ? { ...mail, isRead: true } : mail,
      );
      return {
        receivedRequests: updatedReceivedRequests,
        sentRequests: updatedSentRequests,
      };
    });
  };

  const updateMailInList = (updatedMail, id) => {
    setMailsData((prevMails) => {
      const updatedReceivedRequests = prevMails.receivedRequests.map((mail) =>
        mail.id === id ? { ...mail, status: updatedMail.status } : mail,
      );
      const updatedSentRequests = prevMails.sentRequests.map((mail) =>
        mail.id === id ? { ...mail, status: updatedMail.status } : mail,
      );
      return {
        receivedRequests: updatedReceivedRequests,
        sentRequests: updatedSentRequests,
      };
    });
    setSelectedMailId(id);
    setMailDetails((prev) => ({ ...prev, status: updatedMail.status }));
  };

  const removeMailFromList = (id) => {
    setMailsData((prevMails) => {
      const updatedReceivedRequests = prevMails.receivedRequests.filter(
        (mail) => mail.id !== id,
      );
      const updatedSentRequests = prevMails.sentRequests.filter(
        (mail) => mail.id !== id,
      );
      return {
        receivedRequests: updatedReceivedRequests.length
          ? updatedReceivedRequests
          : { message: "No Mail" },
        sentRequests: updatedSentRequests.length
          ? updatedSentRequests
          : { message: "No Mail" },
      };
    });
    setSelectedMailId(null);
  };

  return (
    <div className="adoptionRequests">
      <h1>Adoption Requests</h1>
      <div className={"mailsContainer"}>
        <div
          className={`mailsList ${!selectedMailId ? "fullWidth" : "minWidth"}`}
        >
          {mailsData && (
            <>
              <MailSection
                title="Received Mails"
                mails={mailsData.receivedRequests}
                selectedMailId={selectedMailId}
                openMail={openMail}
                itemsToShow={receivedItemsToShow}
                setItemsToShow={setReceivedItemsToShow}
                isExpanded={isReceivedExpanded}
                setIsExpanded={setIsReceivedExpanded}
                setMailDetails={setMailDetails}
              />
              {userDetails.role === "user" && (
                <MailSection
                  title="Sent Mails"
                  mails={mailsData.sentRequests}
                  selectedMailId={selectedMailId}
                  openMail={openMail}
                  itemsToShow={sentItemsToShow}
                  setItemsToShow={setSentItemsToShow}
                  isExpanded={isSentExpanded}
                  setIsExpanded={setIsSentExpanded}
                  setMailDetails={setMailDetails}
                  isSent="true"
                />
              )}
            </>
          )}
          {error && error.field === "server" && notifyError(error.message)}
        </div>
        {selectedMailId && (
          <MailDetailsSection
            mailDetails={mailDetails}
            setMailDetails={setMailDetails}
            selectedMailId={selectedMailId}
            removeMailFromList={removeMailFromList}
            updateMailInList={updateMailInList}
            openMail={openMail}
          />
        )}
      </div>
    </div>
  );
}

export default AdoptionRequestsInbox;
