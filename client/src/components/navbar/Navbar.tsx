import { memo, useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLogout } from "../../utils";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import { useUserContext } from "../../context/UserContext";
import HeartSVG from "../../assets/images/svg/heart-icon.svg";
import LogoutSVG from "../../assets/images/svg/logout-icon.svg";

import "./navbar.css";

function Navbar() {
  const { user } = useUserContext();
  const { navbarBgColor, navlinkColor } = useNavbarColorContext();
  const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
  const [isBurgerBtnActive, setIsBurgerBtnActive] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const handleBurgerActive = useCallback(() => {
    setIsBurgerBtnActive((prev) => !prev);
  }, []);

  const handleMenuActive = useCallback(() => {
    setIsMenuActive((prevState) => !prevState);
  }, []);

  const handleCloseMenu = useCallback((e: MouseEvent) => {
    const target = e.target;
    if (target instanceof HTMLElement) {
      if (
        target.classList.contains("navbar-burger-btn") ||
        target.classList.contains("navbar-burger-btn-line")
      ) {
        return;
      }
    }
    setIsBurgerBtnActive(false);
  }, []);

  const handleLogout = useLogout();

  const handleExitMenu = useCallback(
    (e: MouseEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        if (target.classList.contains("navbar-username")) {
          return;
        }
        if (target.id == "profile-dropdown-menu") {
          return;
        }
      }
      if (isMenuActive) {
        setIsMenuActive(false);
      }
    },
    [isMenuActive]
  );

  useEffect(() => {
    window.addEventListener("resize", checkIsMobile);
    window.addEventListener("click", handleExitMenu);
    window.addEventListener("click", handleCloseMenu);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("click", handleExitMenu);
      window.removeEventListener("click", handleCloseMenu);
    };
  }, [handleExitMenu, checkIsMobile, isMobile, handleCloseMenu]);

  return (
    <>
      <nav id="navbar" className={`${navbarBgColor} ${isMobile ? "mobile" : ""}`}>
        {isMobile && (
          <button
            className={`navbar-burger-btn ${isBurgerBtnActive ? "active" : ""}`}
            onClick={handleBurgerActive}
          >
            <div className="navbar-burger-btn-line a"></div>
            <div className="navbar-burger-btn-line b"></div>
            <div className="navbar-burger-btn-line c"></div>
          </button>
        )}
        <div
          className="navbar-links-container navbar-left"
          style={{
            left: isBurgerBtnActive ? "0" : "-100%",
          }}
        >
          <NavLink
            to="/"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""} ${navlinkColor}`}
            style={{
              color: isMobile ? "var(--primary)" : navlinkColor,
            }}
          >
            HOME
          </NavLink>
          <NavLink
            to="/fragrances"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""} ${navlinkColor}`}
            style={{
              color: isMobile ? "var(--primary)" : navlinkColor,
            }}
          >
            FRAGRANCES
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""} ${navlinkColor}`}
            style={{
              color: isMobile ? "var(--primary)" : navlinkColor,
            }}
          >
            ABOUT
          </NavLink>
        </div>
        {user.isLoggedIn ? (
          <div className="navbar-profile-container">
            <div className="navbar-username" onClick={handleMenuActive}>
              {user.username}
            </div>
            <nav id="profile-dropdown-menu" style={{ display: isMenuActive ? "flex" : "none" }}>
              <Link to="/account/liked-fragrances" className="profile-dropdown-menu-link">
                <img src={HeartSVG} alt="Liked fragrances" className="profile-dropdown-menu-icon" />
                <span className="profile-dropdown-menu-text">Liked Fragrances</span>
              </Link>
              <div className="profile-dropdown-menu-seperator"></div>
              <div className="profile-dropdown-menu-link" onClick={handleLogout}>
                <img src={LogoutSVG} alt="Logout" className="profile-dropdown-menu-icon" />
                <span className="profile-dropdown-menu-text">Log Out</span>
              </div>
            </nav>
          </div>
        ) : (
          <div className="navbar-links-container navbar-right">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""} ${navlinkColor}`
              }
              style={{
                color: navlinkColor,
              }}
            >
              LOG-IN
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""} ${navlinkColor}`
              }
              style={{
                color: navlinkColor,
              }}
            >
              SIGN-UP
            </NavLink>
          </div>
        )}
      </nav>
    </>
  );
}

export default memo(Navbar);
