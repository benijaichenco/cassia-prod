import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { UserType } from "../types";

interface UserContextType {
  user: UserType;
  dispatch: (user: UserType) => void;
}

export const resetUser = (): UserType => {
  return {
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    isLoggedIn: false,
  };
};

const userContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(resetUser());
  const contextData: UserContextType = useMemo(
    () => ({
      user,
      dispatch: setUser,
    }),
    [user]
  );

  useEffect(() => {
    if (!window.localStorage.getItem("isLoggedIn")) {
      resetUser();
    }
  }, []);
  return <userContext.Provider value={contextData}>{children}</userContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserContextProvider!");
  }
  return context;
};
