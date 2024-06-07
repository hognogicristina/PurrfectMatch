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
  onNewChatSession,
  inputRef,
  onInputFocus,
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
      const newMessageDTO = {
        id: result.message.id,
        userId: result.message.userId,
        otherUserId: result.session.otherUserId,
        otherUserFullName: result.session.otherUserFullName,
        otherUserName: result.session.otherUserName,
        otherUserImage: result.session.otherUserImage,
        messageText: result.message.messageText,
        messageDate: result.message.messageDate,
        messageRole: result.message.messageRole,
        isRead: result.message.isRead,
      };

      if (messages.length === 0) {
        onNewChatSession({
          id: result.session.id,
          currentUserId: result.session.userId,
          otherUserId: result.session.otherUserId,
          otherUserFullName: result.session.otherUserFullName,
          otherUserName: result.session.otherUserName,
          otherUserImage: result.session.otherUserImage,
          lastMessage: result.message.messageText,
          lastMessageDate: result.message.messageDate,
          lastMessageRole: result.message.messageRole,
          isRead: result.message.isRead,
          unreadMessagesCount: result.session.unreadMessagesCount,
        });
      }

      setMessages((prevMessages) => [newMessageDTO, ...prevMessages]);
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
      {messages.map((message, index) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          key={index}
          className={`message ${message.messageRole === "sender" ? "sentMessage" : "receivedMessage"}`}
        >
          {message.messageRole === "receiver" && (
            <>{renderUserImage(message)}</>
          )}
          <div className="messageContentContainer">
            <span className="messageContent">{message.messageText}</span>
            <span className="timestamp">{message.messageDate}</span>
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
                ref={inputRef}
                onFocus={handleInputFocus}
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
