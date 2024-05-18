import { createContext, useContext, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const notifyError = useCallback((message) => {
    toast.error(message);
  }, []);

  const notifySuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  return (
    <ToastContext.Provider value={{ notifyError, notifySuccess }}>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeButton={false}
      />
    </ToastContext.Provider>
  );
};
