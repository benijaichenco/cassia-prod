import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from "react";
import { resetUser, useUserContext } from "./UserContext";
import { parseJwt } from "../utils";

interface AuthContextType {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const userContext = useUserContext();
  const logout = useCallback(async () => {
    window.localStorage.removeItem("at");
    window.localStorage.removeItem("rt");
    window.localStorage.removeItem("isLoggedIn");
    userContext.dispatch(resetUser());
    window.location.pathname = "/login";
  }, [userContext]);
  const authContextData = useMemo(
    () => ({
      logout,
    }),
    [logout]
  );
  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    const at = window.localStorage.getItem("at");
    if (isLoggedIn) {
      if (at) {
        const userData = parseJwt(at);
        userContext.dispatch({ ...userData, isLoggedIn });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext should be used within AuthContextPovider!");
  }
  return context;
};
