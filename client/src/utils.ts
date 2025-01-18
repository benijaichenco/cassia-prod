import { ScrollToOptions } from "lenis";
import { useLenis } from "lenis/react";
import { useCallback } from "react";
import { authLogout } from "./api/apiUtils";
import { useAuthContext } from "./context/AuthContext";

export function getTimeCreated(time: Date) {
  const date = new Date(time);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  const parts = formattedDate.split(", ");
  const updatedDate = `${parts[0]}, ${parts[1]} • ${parts[2]}`;

  return updatedDate;
}

export const useLenisScrollTo = () => {
  const lenis = useLenis();
  const scrollTo = useCallback(
    (position: number = 0, options: ScrollToOptions = { immediate: true }) => {
      lenis?.scrollTo(position, options);
    },
    [lenis]
  );
  return scrollTo;
};

export const useLogout = () => {
  const authContext = useAuthContext();
  const handleLogOut = useCallback(async () => {
    try {
      await authLogout();
    } catch (err) {
      console.error("Failed deleting session.", err);
    } finally {
      authContext.logout();
    }
  }, [authContext]);
  return handleLogOut;
};

export function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export const appendServerPrefix = (path: string) => {
  return `${import.meta.env.VITE_BACKEND_BASE_URL}${path}`;
};

export const logout = async () => {
  try {
    await authLogout();
  } catch (err) {
    console.warn("Active session not deleted:", err);
  }
  window.localStorage.removeItem("at");
  window.localStorage.removeItem("rt");
  window.localStorage.removeItem("isLoggedIn");
};
