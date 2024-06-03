import React, { createContext, useContext, useEffect, useState } from "react";
import { extractJwt, getAuthToken } from "../util/auth.js";
import { useToast } from "../components/Util/Custom/PageResponse/ToastProvider.jsx";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const { notifyUser, notifySuccess, notifyError } = useToast();
  const token = getAuthToken();
  let userDetails, userId;

  if (token) {
    userDetails = extractJwt(token);
    userId = userDetails.id;
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      ws.send(JSON.stringify({ userId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.type === "NEW_ADOPTION_REQUEST") {
        if (message.payload?.role === "receiver") {
          const customMessage = message.payload?.customMessage;
          notifyUser(customMessage);
        } else if (message.payload?.role === "sender") {
          const customMessage = message.payload?.customMessage;
          notifySuccess(customMessage);
        }
      } else if (message.type === "ADOPTION_REQUEST_RESPONSE") {
        if (message.payload?.role === "sender") {
          const customMessage = message.payload?.customMessage;
          notifyUser(customMessage);
        }
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
