import React, { useState, useEffect, useRef } from "react";
import "../../styles/Auth/Inbox.css";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import ChatWindow from "../Util/Pages/Inbox/ChatWindow.jsx";
import SearchBar from "../Util/Pages/Inbox/SearchBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useWebSocket } from "../../context/WebSocketContext.jsx";
import { useLocation } from "react-router-dom";

export default function ChatsList({ chats }) {
  const { data, error, userDetails } = chats;
  const { notifyError, notifyUser } = useToast();
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [resetOnOpen, setResetOnOpen] = useState(false);
  const [chatData, setChatData] = useState(data || []);
  const inputRef = useRef(null);
  const location = useLocation();
  const { messages } = useWebSocket();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const userId = query.get("userId");
    const userName = query.get("userName");
    const userImage = query.get("image");

    if (userId && userName) {
      handleUserSearchSelect(userId, userName, userImage);
    }
  }, [location.search]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        message.type === "NEW_CHAT_MESSAGE" &&
        userDetails &&
        userDetails.id &&
        message.userId === userDetails.id
      ) {
        const { session, message: newMessage } = message.payload;

        if (
          message.payload?.role === "receiver" &&
          location.pathname !== "/inbox"
        ) {
          const customMessage = message.payload.customMessage;
          notifyUser(customMessage);
        }

        const newMessageDTO = {
          id: newMessage.id,
          userId: newMessage.userId,
          otherUserId: session.otherUserId,
          otherUserFullName: session.otherUserFullName,
          otherUserName: session.otherUserName,
          otherUserImage: session.otherUserImage,
          messageText: newMessage.messageText,
          messageDate: newMessage.messageDate,
          messageRole: newMessage.messageRole,
          isRead: newMessage.isRead,
        };

        setChatData((prevChatData) => {
          const existingChatIndex = prevChatData.findIndex(
            (chat) => chat.otherUserId === session.otherUserId,
          );

          if (existingChatIndex !== -1) {
            const updatedChatData = [...prevChatData];
            updatedChatData[existingChatIndex] = {
              ...updatedChatData[existingChatIndex],
              lastMessage: newMessage.messageText,
              lastMessageDate: newMessage.messageDate,
              isRead: session.isRead,
              unreadMessagesCount: session.unreadMessagesCount,
              messages: [
                ...(updatedChatData[existingChatIndex].messages || []),
                newMessageDTO,
              ],
            };

            return [
              updatedChatData[existingChatIndex],
              ...updatedChatData.filter((_, i) => i !== existingChatIndex),
            ];
          } else {
            return [
              {
                ...session,
                messages: [newMessageDTO],
              },
              ...prevChatData,
            ];
          }
        });

        if (selectedUserId === session.otherUserId) {
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);
        }
      }
    };

    if (messages && Array.isArray(messages)) {
      messages.forEach(handleNewMessage);
    }
  }, [messages, userDetails, selectedUserId]);

  useEffect(() => {
    if (data && data.length > 0 && !selectedUserId) {
      const firstChat = data[0];
      setSelectedUserId(firstChat.otherUserId);
      setSelectedUserName(firstChat.otherUserFullName);
    }
  }, [data, selectedUserId]);

  const handleChatSelect = (chat) => {
    setChatData((prevChatData) =>
      prevChatData.map((item) =>
        item.otherUserId === chat.otherUserId
          ? { ...item, isRead: true, messages: item.messages || [] }
          : item,
      ),
    );
    setSelectedUserId(chat.otherUserId);
    setSelectedUserName(chat.otherUserFullName);
    setResetOnOpen(true);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleUserSearchSelect = (userId, userName, image) => {
    const existingChat = chatData.find((chat) => chat.otherUserId === userId);
    if (!existingChat) {
      setChatData((prevChatData) => [
        {
          otherUserId: userId,
          otherUserFullName: userName,
          otherUserImage: image,
          messages: [],
          isRead: true,
          unreadMessagesCount: 0,
        },
        ...prevChatData,
      ]);
      setSelectedUserId(userId);
      setSelectedUserName(userName);
      setResetOnOpen(true);
    } else {
      handleChatSelect(existingChat);
    }
  };

  const handleNewChatSession = (newChatSession) => {
    setChatData((prevChatData) => {
      const existingSessionIndex = prevChatData.findIndex(
        (chat) => chat.otherUserId === newChatSession.otherUserId,
      );

      let updatedChatData = [...prevChatData];
      if (existingSessionIndex !== -1) {
        updatedChatData.splice(existingSessionIndex, 1);
      }
      updatedChatData = [newChatSession, ...updatedChatData];

      return updatedChatData;
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
        <div className="unreadIconWrapper">
          {chat.unreadMessagesCount > 0 && (
            <span className="unreadMessagesCount">
              {chat.unreadMessagesCount}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const renderChat = () => {
    if (Array.isArray(chatData) && chatData.length > 0) {
      return chatData.map((chat, index) => (
        <AnimatePresence key={chat.otherUserId}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            className={`chat ${selectedUserId === chat.otherUserId ? "selectedChat" : ""}`}
            onClick={() => handleChatSelect(chat)}
          >
            <div className="userImageContainer">{renderUserImage(chat)}</div>
            <div className="chatItemContainer">
              <div className="chatItemHeader">
                <span className="chatItemName">{chat.otherUserFullName}</span>
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
        </AnimatePresence>
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
          inputRef={inputRef}
          onInputFocus={() =>
            setChatData((prevChatData) =>
              prevChatData.map((item) =>
                item.otherUserId === selectedUserId
                  ? { ...item, isRead: true }
                  : item,
              ),
            )
          }
        />
      </div>
    </div>
  );
}
