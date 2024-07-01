import React, { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { getAuthToken } from "../../../../util/auth.js";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function ChatWindow({
  selectedUserId,
  selectedUserName,
  resetOnOpen = false,
  setResetOnOpen,
  chatMessages,
  inputRef,
  onInputFocus,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyError } = useToast();

  useEffect(() => {
    if (resetOnOpen) {
      setResetOnOpen(false);
    }
  }, [resetOnOpen, setResetOnOpen]);

  useEffect(() => {
    if (selectedUserId && resetOnOpen) {
      setMessages([]);
    }
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId, resetOnOpen]);

  useEffect(() => {
    setMessages(chatMessages);
  }, [chatMessages]);

  const fetchMessages = async (id) => {
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/inbox/${id}/chat-session`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = await response.json();
    if (response.ok) {
      setMessages(result.data);
    } else {
      result.error.forEach((err) => {
        if (err.field === "server") {
          notifyError(err.message);
        }
      });
      setMessages([]);
    }
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleInputFocus = () => {
    if (onInputFocus) {
      onInputFocus();
    }
  };

  const renderUserImage = (message) => (
    <div className="userImageWrapper">
      {message.otherUserImage ? (
        <img
          className="messageUserImage"
          src={message.otherUserImage}
          alt={message.otherUserId}
        />
      ) : (
        <FontAwesomeIcon icon={faUserCircle} className="userIconChat imgMsg" />
      )}
    </div>
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3000/inbox/${selectedUserId}/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      },
    );
    const result = await response.json();
    setIsSubmitting(false);
    if (response.ok) {
      setNewMessage("");
      setResetOnOpen(false);
    } else {
      result.error.forEach((err) => {
        if (err.field === "server") {
          notifyError(err.message);
        }
      });
    }
  };

  const renderHeader = () => (
    <div className="chatWindowHeader">
      <h2>{selectedUserName}</h2>
    </div>
  );

  const renderMessages = () => (
    <div className="messages">
      {messages
        .slice()
        .reverse()
        .map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.messageRole === "sender"
                ? "sentMessage"
                : "receivedMessage"
            }`}
          >
            {message.messageRole === "receiver" && (
              <>{renderUserImage(message)}</>
            )}
            <div className="messageContentContainer">
              <span className="messageContent">{message.messageText}</span>
              <span className="timestamp">{message.messageDate}</span>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="chatWindowBody">
      {selectedUserId ? (
        <>
          {renderHeader()}
          <div className="chatWindow">
            {renderMessages()}
            <Form onSubmit={handleSendMessage} className="messageForm">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                className="messageInput"
                onChange={(e) => setNewMessage(e.target.value)}
                ref={inputRef}
                onFocus={handleInputFocus}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`simpleButton submit messageButton ${
                  isSubmitting ? "submitting" : ""
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending.." : "Send"}
              </motion.button>
            </Form>
          </div>
        </>
      ) : (
        <div className="noResultContainer chatError">
          <p className="errorMessageCats">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
}
