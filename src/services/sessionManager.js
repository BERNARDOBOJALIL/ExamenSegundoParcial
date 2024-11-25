import { useEffect, useRef } from "react";
import { getUserData, logoutUser } from "../services/auth";

const SessionManager = ({
  onLogin,
  onLogout,
  onTableSelect,
  inactivityLimit = 3600000,
}) => {
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    const startInactivityTimer = () => {
      timeoutIdRef.current = setTimeout(async () => {
        await handleLogout();
      }, inactivityLimit);
    };

    const resetInactivityTimer = () => {
      clearTimeout(timeoutIdRef.current);
      startInactivityTimer();
    };

    const handleLogout = async () => {
      clearTimeout(timeoutIdRef.current);
      const { error } = await logoutUser();
      if (!error) {
        localStorage.removeItem("userData");
        localStorage.removeItem("selectedTable");
        onLogout();
      }
    };

    const initializeSession = async () => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        onLogin(userData);
        startInactivityTimer();

        const storedTable = localStorage.getItem("selectedTable");
        if (storedTable) {
          onTableSelect(storedTable);
        }
      } else {
        const userData = await getUserData();
        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
          onLogin(userData);
          startInactivityTimer();
        }
      }
    };

    initializeSession();

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    return () => {
      clearTimeout(timeoutIdRef.current);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, [onLogin, onLogout, onTableSelect, inactivityLimit]);

  return null;
};

export default SessionManager;
