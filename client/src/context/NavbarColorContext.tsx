import { createContext, ReactNode, useContext, useState } from "react";

type NavbarBgColorsType = "transparent" | "white" | "black";

type NavlinkColorsType = "black" | "white";

interface NavbarColorContextType {
  navbarBgColor: NavbarBgColorsType;
  navlinkColor: NavlinkColorsType;
  dispatch?: (navbarBgColor: NavbarBgColorsType, navlinkColor: NavlinkColorsType) => void;
}

const NavbarColorContext = createContext<NavbarColorContextType>({
  navbarBgColor: "transparent",
  navlinkColor: "white",
});

export function NavbarColorProvider({ children }: { children: ReactNode }) {
  const [bgColor, setBgColor] = useState<NavbarBgColorsType>("transparent");
  const [linkColor, setLinkColor] = useState<NavlinkColorsType>("white");
  const dispatch = (bgColor: NavbarBgColorsType, linkColor: NavlinkColorsType) => {
    setBgColor(bgColor);
    setLinkColor(linkColor);
  };
  return (
    <>
      <NavbarColorContext.Provider
        value={{ navbarBgColor: bgColor, navlinkColor: linkColor, dispatch }}
      >
        {children}
      </NavbarColorContext.Provider>
    </>
  );
}

export function useNavbarColorContext() {
  const context = useContext(NavbarColorContext);
  if (!context.navbarBgColor || !context.navlinkColor || !context.dispatch) {
    throw new Error("useNavbarColorContext must be used within a NavbarColorContext provider!");
  }
  return context;
}
