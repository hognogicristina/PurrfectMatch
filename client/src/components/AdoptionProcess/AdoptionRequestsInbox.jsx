import "../../styles/PurrfectMatch/Adoption.css";
import { getAuthToken } from "../../util/auth.js";
import { useEffect, useState } from "react";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import MailSection from "../Util/Pages/Inbox/MailSection.jsx";
import MailDetailsSection from "../Util/Pages/Inbox/MailDetailsSection.jsx";

function AdoptionRequestsInbox({ mails }) {
  const { data, error, userDetails } = mails;
  const [selectedMailId, setSelectedMailId] = useState(null);
  const [mailDetails, setMailDetails] = useState({});
  const { notifyError } = useToast();
  const [receivedItemsToShow, setReceivedItemsToShow] = useState(1);
  const [sentItemsToShow, setSentItemsToShow] = useState(1);
  const [isReceivedExpanded, setIsReceivedExpanded] = useState(true);
  const [isSentExpanded, setIsSentExpanded] = useState(true);

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
    if (data && Array.isArray(data.receivedRequests)) {
      data.receivedRequests = data.receivedRequests.map((mail) =>
        mail.id === id ? { ...mail, isRead: true } : mail,
      );
    }
  };

  const updateMailInList = (updatedMail, id) => {
    if (data) {
      if (Array.isArray(data.receivedRequests)) {
        data.receivedRequests = data.receivedRequests.map((mail) =>
          mail.id === id ? { ...mail, status: updatedMail.status } : mail,
        );
      }
      if (Array.isArray(data.sentRequests)) {
        data.sentRequests = data.sentRequests.map((mail) =>
          mail.id === id ? { ...mail, status: updatedMail.status } : mail,
        );
      }
    }
    setSelectedMailId(id);
    setMailDetails((prev) => ({ ...prev, status: updatedMail.status }));
  };

  const removeMailFromList = (id) => {
    if (data) {
      if (Array.isArray(data.receivedRequests)) {
        data.receivedRequests = data.receivedRequests.filter(
          (mail) => mail.id !== id,
        );
      }
      if (Array.isArray(data.sentRequests)) {
        data.sentRequests = data.sentRequests.filter((mail) => mail.id !== id);
      }
      setSelectedMailId(null);
    }
  };

  useEffect(() => {
    if (data && data.sentRequests.length === 0) {
      return <p className="errorMessageCats">{data.sentRequests.message}</p>;
    }
  }, []);

  return (
    <div className="adoptionRequests">
      <h1>Adoption Requests</h1>
      <div className={"mailsContainer"}>
        <div
          className={`mailsList ${!selectedMailId ? "fullWidth" : "minWidth"}`}
        >
          {data && (
            <>
              <MailSection
                title="Received Mails"
                mails={data.receivedRequests}
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
                  mails={data.sentRequests}
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
