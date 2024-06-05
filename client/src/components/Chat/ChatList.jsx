import React, { useState, useEffect } from "react";
import "../../styles/Auth/Inbox.css";
import { motion } from "framer-motion";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import ChatWindow from "../Util/Pages/Inbox/ChatWindow.jsx";
import SearchBar from "../Util/Pages/Inbox/SearchBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faCircle } from "@fortawesome/free-solid-svg-icons";

export default function ChatsList({ chats }) {
  const { data, error, userDetails } = chats;
  const { notifyError } = useToast();
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [resetOnOpen, setResetOnOpen] = useState(false);
  const [chatData, setChatData] = useState(data || []);

  useEffect(() => {
    if (data && data.length > 0 && !selectedUserId) {
      const firstChat = data[0];
      setSelectedUserId(firstChat.otherUserId);
      setSelectedUserName(firstChat.otherUserName);
    }
  }, [data, selectedUserId]);

  const handleChatSelect = (chat) => {
    setChatData((prevChatData) =>
      prevChatData.map((item) =>
        item.otherUserId === chat.otherUserId
          ? { ...item, isRead: true }
          : item,
      ),
    );
    setSelectedUserId(chat.otherUserId);
    setSelectedUserName(chat.otherUserName);
    setResetOnOpen(true);
  };

  const handleUserSearchSelect = (userId, userName, image) => {
    const existingChat = chatData.find((chat) => chat.otherUserId === userId);
    if (!existingChat) {
      setChatData((prevChatData) => [
        ...prevChatData,
        {
          otherUserId: userId,
          otherUserName: userName,
          otherUserImage: image,
          messages: [],
          isRead: true,
        },
      ]);
    } else {
      setChatData((prevChatData) =>
        prevChatData.map((item) =>
          item.otherUserId === userId ? { ...item, isRead: true } : item,
        ),
      );
    }
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setResetOnOpen(true);
  };

  const handleNewChatSession = (newChatSession) => {
    setChatData((prevChatData) => {
      const existingSessionIndex = prevChatData.findIndex(
        (chat) => chat.otherUserId === newChatSession.otherUserId,
      );

      if (existingSessionIndex !== -1) {
        const updatedChatData = [...prevChatData];
        updatedChatData[existingSessionIndex] = newChatSession;
        return updatedChatData;
      } else {
        return [newChatSession, ...prevChatData];
      }
    });
  };

  const renderUserImage = (chat) => (
    <div className="userImageWrapper">
      {chat.otherUserImage ? (
        <img
          className="userImageLogout catAdopt"
          src={chat.otherUserImage}
          alt={chat.otherUserId}
        />
      ) : (
        <FontAwesomeIcon icon={faUserCircle} className="userIconChat" />
      )}
      {!chat.isRead && (
        <FontAwesomeIcon icon={faCircle} className="unreadIconChat" />
      )}
    </div>
  );

  const renderChat = () => {
    if (Array.isArray(chatData) && chatData.length > 0) {
      return chatData.map((chat, index) => (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          key={chat.otherUserId}
          className={`chat ${selectedUserId === chat.otherUserId ? "selectedChat" : ""}`}
          onClick={() => handleChatSelect(chat)}
        >
          <div className="userImageContainer">{renderUserImage(chat)}</div>
          <div className="chatItemContainer">
            <div className="chatItemHeader">
              <span className="chatItemName">{chat.otherUserName}</span>
              <span
                className={`chatItemDate ${selectedUserId === chat.otherUserId ? "selectedChat" : ""}`}
              >
                {chat.lastMessageDate}
              </span>
            </div>
            <span
              className={`chatItemMessage ${selectedUserId === chat.otherUserId ? "selectedChat" : ""}`}
            >
              {chat.lastMessage}
            </span>
          </div>
        </motion.div>
      ));
    } else if (error) {
      if (error.some((err) => err.field === "chat")) {
        const errorMessage = error.map((err, index) => (
          <p key={index} className="errorMessageCats">
            {err.message}
          </p>
        ));
        return (
          <div className="noResultContainer chatError">
            <div className="errorMessageCats">{errorMessage}</div>
          </div>
        );
      } else if (error.some((err) => err.field === "server")) {
        error.forEach((err) => {
          notifyError(err.message);
        });
      }
    }
  };

  return (
    <div className="container">
      <div className="chatForm">
        <div className="sidebar">
          <SearchBar onUserSelect={handleUserSearchSelect} />
          <div className="messagesContainer">{renderChat()}</div>
        </div>
        <ChatWindow
          selectedUserId={selectedUserId}
          selectedUserName={selectedUserName}
          resetOnOpen={resetOnOpen}
          setResetOnOpen={setResetOnOpen}
          chatMessages={
            chatData && Array.isArray(chatData) && chatData.length > 0
              ? chatData.find((chat) => chat.otherUserId === selectedUserId)
                  ?.messages || []
              : []
          }
          onNewChatSession={handleNewChatSession}
        />
      </div>
    </div>
  );
}
