import { createContext, useContext, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const notifyError = useCallback((message) => {
    toast.error(message);
  }, []);

  const notifySuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const notifyUser = useCallback((message) => {
    toast(message, {
      icon: "📨",
    });
  }, []);

  return (
    <ToastContext.Provider value={{ notifyError, notifySuccess, notifyUser }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};
