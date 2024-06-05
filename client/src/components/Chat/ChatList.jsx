import { useState, useEffect } from "react";
import "../../styles/Auth/Inbox.css";
import { motion } from "framer-motion";
import { useToast } from "../Util/Custom/PageResponse/ToastProvider.jsx";
import ChatWindow from "../Util/Pages/Inbox/ChatWindow.jsx";
import SearchBar from "../Util/Pages/Inbox/SearchBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useWebSocket } from "../../context/WebSocketContext.jsx";

export default function ChatsList({ chats }) {
  const { data, error, userDetails } = chats;
  const { notifyError } = useToast();
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [resetOnOpen, setResetOnOpen] = useState(false);
  const { messages } = useWebSocket();
  const [chatData, setChatData] = useState(data || []);

  useEffect(() => {
    if (data) {
      setChatData(data);
    }
  }, [data]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (!userDetails) return;

      if (
        message.type === "NEW_CHAT_MESSAGE" &&
        (message.userId === userDetails.id ||
          message.payload.otherUser.id === userDetails.id)
      ) {
        setChatData((prevChatData) => {
          if (!prevChatData) prevChatData = [];

          const updatedChats = prevChatData.map((chat) => {
            if (
              chat &&
              (chat.otherUserId === message.payload.otherUser.id ||
                chat.otherUserId === userDetails.id)
            ) {
              return {
                ...chat,
                message: message.payload.message,
                formattedDate: message.payload.formattedDate,
              };
            }
            return chat;
          });

          if (
            !updatedChats.find(
              (chat) =>
                chat && chat.otherUserId === message.payload.otherUser.id,
            )
          ) {
            updatedChats.push({
              id: message.payload.id,
              message: message.payload.message,
              formattedDate: message.payload.formattedDate,
              otherUserId: message.payload.otherUser.id,
              fullName: `${message.payload.otherUser.firstName} ${message.payload.otherUser.lastName}`,
              image: message.payload.otherUser.imageUrl,
            });
          }

          const updatedChat = updatedChats.find(
            (chat) => chat && chat.otherUserId === message.payload.otherUser.id,
          );
          const remainingChats = updatedChats.filter(
            (chat) => chat && chat.otherUserId !== message.payload.otherUser.id,
          );
          return [updatedChat, ...remainingChats];
        });
      }
    };

    if (messages && userDetails) {
      messages.forEach(handleNewMessage);
    }
  }, [messages, userDetails]);

  useEffect(() => {
    if (data && data.length > 0 && !selectedUserId) {
      const firstChat = data[0];
      setSelectedUserId(firstChat.otherUserId);
      setSelectedUserName(firstChat.fullName);
    }
  }, [data, selectedUserId]);

  const handleChatSelect = (chat) => {
    setSelectedUserId(chat.otherUserId);
    setSelectedUserName(chat.fullName);
    setResetOnOpen(true);
  };

  const renderUserImage = (chat) => {
    if (chat.image) {
      return (
        <img
          className="userImageLogout catAdopt"
          src={chat.image}
          alt={chat.otherUserId}
        />
      );
    } else {
      return <FontAwesomeIcon icon={faUserCircle} className="userIcon" />;
    }
  };

  const renderChat = () => {
    if (chatData && Array.isArray(chatData) && chatData.length > 0) {
      return chatData.map((chat, index) => {
        if (!chat) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            key={chat.id}
            className={`chat ${selectedUserId === chat.otherUserId ? "selectedChat" : ""}`}
            onClick={() => handleChatSelect(chat)}
          >
            <div className="userImageContainer">{renderUserImage(chat)}</div>
            <div className="chatItemContainer">
              <div className="chatItemHeader">
                <span className="chatItemName">{chat.fullName}</span>
                <span
                  className={`chatItemDate ${selectedUserId === chat.otherUserId ? "selectedChat" : ""}`}
                >
                  {chat.formattedDate}
                </span>
              </div>
              <span
                className={`chatItemMessage ${selectedUserId === chat.otherUserId ? "selectedChat" : ""}`}
              >
                {chat.message}
              </span>
            </div>
          </motion.div>
        );
      });
    } else if (chats && error) {
      if (error.some((err) => err.field === "inbox")) {
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

  const handleSendMessageSuccess = (chatId, newMessage, formattedDate) => {
    setChatData((prevChatData) => {
      if (!prevChatData) prevChatData = [];

      const updatedChats = prevChatData.map((chat) => {
        if (chat && chat.otherUserId === chatId) {
          return {
            ...chat,
            message: newMessage,
            formattedDate: formattedDate,
          };
        }
        return chat;
      });

      if (!updatedChats.find((chat) => chat && chat.otherUserId === chatId)) {
        updatedChats.push({
          id: chatId,
          message: newMessage,
          formattedDate: formattedDate,
          otherUserId: chatId,
          fullName: selectedUserName,
          image: null,
        });
      }

      const updatedChat = updatedChats.find(
        (chat) => chat && chat.otherUserId === chatId,
      );
      const remainingChats = updatedChats.filter(
        (chat) => chat && chat.otherUserId !== chatId,
      );
      return [updatedChat, ...remainingChats];
    });
  };

  return (
    <div className="container">
      <div className="chatForm">
        <div className="sidebar">
          <SearchBar
            onUserSelect={setSelectedUserId}
            onUserName={setSelectedUserName}
          />
          <div className="messagesContainer">{renderChat()}</div>
        </div>
        <ChatWindow
          selectedUserId={selectedUserId}
          selectedUserName={selectedUserName}
          resetOnOpen={resetOnOpen}
          setResetOnOpen={setResetOnOpen}
          chatMessages={chatData}
          onSendMessageSuccess={handleSendMessageSuccess}
        />
      </div>
    </div>
  );
}
