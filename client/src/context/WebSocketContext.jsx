import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { extractJwt, getAuthToken } from "../util/auth.js";
import { useToast } from "../components/Util/Custom/PageResponse/ToastProvider.jsx";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const { notifyUser, notifySuccess } = useToast();
  const socketRef = useRef(null);
  const token = getAuthToken();
  let userDetails, userId;

  if (token) {
    userDetails = extractJwt(token);
    userId = userDetails.id;
  }

  useEffect(() => {
    if (userId && !socketRef.current) {
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
        } else if (message.type === "NEW_CHAT_MESSAGE") {
          if (message.payload?.role === "receiver") {
            const customMessage = message.payload?.customMessage;
            notifyUser(customMessage);
          }
        }
      };

      ws.onclose = () => {
        socketRef.current = null;
      };

      socketRef.current = ws;
    }

    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, [userId]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ socket: socketRef.current, messages, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
