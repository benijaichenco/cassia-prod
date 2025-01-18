import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import { NavbarColorProvider } from "./context/NavbarColorContext";
import { useUserContext } from "./context/UserContext";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Fragrances from "./pages/fragrances/Fragrances";
import FragrancePost from "./pages/fragrance-post/FragrancePost";
import About from "./pages/about/About";
import LogIn from "./pages/login/LogIn";
import Register from "./pages/register/Register";
import Footer from "./components/footer/Footer";
import AuthProvider from "./context/AuthContext";
import LikedFragrances from "./pages/liked-fragrances/LikedFragrances";
import Preloader from "./components/preloader/Preloader";
import Cursor from "./components/cursor/Cursor";
import NotFound from "./components/not-found/NotFound";

import "./App.css";

function App() {
  const { user } = useUserContext();
  const [location, setLocation] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(user.isLoggedIn);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const lenis = useLenis();
  const handleScrollBehavior = useCallback(() => {
    lenis?.stop();
    setTimeout(() => {
      lenis?.start();
    }, 5000);
  }, [lenis]);
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    setIsLoggedIn(user.isLoggedIn);
  }, [user]);

  useEffect(() => {
    if (window.location.pathname == "/") {
      handleScrollBehavior();
    }
    setLocation(window.location.pathname);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, [handleScrollBehavior, checkIfMobile]);
  return (
    <>
      <BrowserRouter>
        <ReactLenis root>
          <AuthProvider>
            <NavbarColorProvider>
              {isMobile ? <></> : <Cursor />}
              <div id="noise-overlay"></div>
              {location == "/" && <Preloader />}
              <main id="main">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to="/" replace /> : <LogIn />}
                  />
                  <Route
                    path="/register"
                    element={isLoggedIn ? <Navigate to="/" replace /> : <Register />}
                  />
                  <Route path="/fragrances" element={<Fragrances />} />
                  <Route path="/fragrances/:fragranceId" element={<FragrancePost />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/account/liked-fragrances" element={<LikedFragrances />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </main>
            </NavbarColorProvider>
          </AuthProvider>
        </ReactLenis>
      </BrowserRouter>
    </>
  );
}

export default App;
