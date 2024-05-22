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

  const notifyLoading = useCallback((promise, messages) => {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{ notifyError, notifySuccess, notifyLoading }}
    >
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};
