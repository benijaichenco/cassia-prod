import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../utils";
import { useUserContext } from "../../context/UserContext";
import githubIcon from "../../assets/images/github.svg";

import "./footer.css";

function Footer() {
  const years = useMemo(() => `2024 - ${new Date().getFullYear()}`, []);
  const { user } = useUserContext();
  const handleLogout = useLogout();

  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="footer-credits">
          <div className="footer-credits-title">By Beni</div>
          <a
            href="https://github.com/benijaichenco"
            target="_blank"
            className="footer-credits-link"
          >
            <img src={githubIcon} className="footer-credits-link-img" />
          </a>
        </div>
        <div className="footer-retailers">
          <div className="footer-title">Recommended Retailers</div>
          <a href="https://www.fragrancex.com/" target="_blank" className="footer-text">
            Fragrance X
          </a>
          <a href="https://www.perfume.com/" target="_blank" className="footer-text">
            Perfume.com
          </a>
          <a href="https://www.notino.com/" target="_blank" className="footer-text">
            Notino
          </a>
          <a href="https://www.fragrancenet.com/" target="_blank" className="footer-text">
            Fragrance Net
          </a>
          <a href="https://www.jomashop.com/" target="_blank" className="footer-text">
            Joma Shop
          </a>
          <a href="https://www.luckyscent.com/" target="_blank" className="footer-text">
            Lucky Scent
          </a>
          <a href="https://theperfumespot.com/" target="_blank" className="footer-text">
            The Perfume Spot
          </a>
          <a href="https://www.scentsplit.com/" target="_blank" className="footer-text">
            Scent Split
          </a>
        </div>
        <div className="footer-cassia">
          <div className="footer-title">CASSIA</div>
          <Link to="/" className="footer-text">
            Home
          </Link>
          <Link to="/fragrances" className="footer-text">
            Fragrances
          </Link>
          <Link to="/about" className="footer-text">
            About
          </Link>
        </div>
        <div className="footer-account">
          <div className="footer-title">Account</div>
          {user.isLoggedIn ? (
            <>
              <button onClick={handleLogout} className="footer-text footer-logout-btn">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="footer-text">
                Log In
              </Link>
              <Link to="/register" className="footer-text">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-contact">
          <div className="footer-title">CONTACT US</div>
          <div className="footer-text">cassiafragrances@gmail.com</div>
        </div>
        <div className="footer-copyrights">
          <div className="footer-text">© {years} CASSIA. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
