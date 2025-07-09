import React, { createContext, useState, useContext } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
    duration: 3000,
  });

  const showToast = ({ message, type = "info", duration = 3000 }) => {
    setToast({ visible: true, message, type, duration });
    setTimeout(
      () =>
        setToast({ visible: false, message: "", type: "info", duration: 3000 }),
      duration
    );
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
