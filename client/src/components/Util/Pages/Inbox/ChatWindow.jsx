import React, { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { getAuthToken } from "../../../../util/auth.js";
import { useToast } from "../../Custom/PageResponse/ToastProvider.jsx";
import { motion } from "framer-motion";

export default function ChatWindow({
  selectedUserId,
  selectedUserName,
  resetOnOpen = false,
  setResetOnOpen,
  chatMessages,
  onSendMessageSuccess,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { notifyError } = useToast();

  useEffect(() => {
    if (resetOnOpen) {
      setMessages(chatMessages);
      setResetOnOpen(false);
    }
  }, [resetOnOpen, chatMessages, setResetOnOpen]);

  useEffect(() => {
    if (selectedUserId && resetOnOpen) {
      setMessages([]);
    }
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId, resetOnOpen]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchMessages = async (id) => {
    const token = getAuthToken();
    const response = await fetch(`http://localhost:3000/inbox/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
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
    if (response.ok) {
      setNewMessage("");
      await fetchMessages(selectedUserId);
      setResetOnOpen(false);
      onSendMessageSuccess(selectedUserId, newMessage, result.formattedDate);
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
      {messages.map((message, index) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          key={index}
          className={`message ${message.currentUser.sender ? "sentMessage" : "receivedMessage"}`}
        >
          {!message.currentUser.sender && (
            <img
              src={message.otherUser.imageUrl}
              alt={message.otherUser.username}
              className="messageUserImage"
            />
          )}
          <div className="messageContentContainer">
            <span className="messageContent">{message.message}</span>
            <span className="timestamp">{message.formattedDate}</span>
          </div>
        </motion.div>
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
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="simpleButton submit messageButton"
                type="submit"
              >
                Send
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
