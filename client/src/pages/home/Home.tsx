import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLenisScrollTo } from "../../utils";
import { FragranceDataType } from "../../types";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import { useUserContext } from "../../context/UserContext";
import { fetchFotd } from "../../api/apiUtils";
import fragrancex from "../../assets/images/logo_list/fragrancex.png";
import perfumecom from "../../assets/images/logo_list/perfumecom.png";
import notino from "../../assets/images/logo_list/notino.png";
import fragrancenet from "../../assets/images/logo_list/fragrancenet.png";
import jomashop from "../../assets/images/logo_list/jomashop.png";
import luckyscent from "../../assets/images/logo_list/luckyscent.png";
import perfumespot from "../../assets/images/logo_list/perfumespot.png";
import scentsplit from "../../assets/images/logo_list/scentsplit.png";
import Button from "../../components/button/Button";
import ArticleTitle from "../../components/article-title/ArticleTitle";
import ParagraphText from "../../components/paragraph-text/ParagraphText";
import FragranceCard from "../../components/fragrance-card/FragranceCard";
import Loader from "../../components/loaders/Loader";

import "./home.css";

function Home() {
  const [fotd, setFotd] = useState<FragranceDataType | null>(null);
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const scrollToTop = useLenisScrollTo();
  const heroRef = useRef(null);
  const navbarColorContext = useNavbarColorContext();
  const { user } = useUserContext();

  const getFotd = useCallback(async () => {
    try {
      const res = await fetchFotd();
      const data = res.data.fotd;
      setText(data.text);
      setTitle(data.title);
      setFotd(data.fragrance);
    } catch (err) {
      console.error("Error fetching fotd:", err);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          navbarColorContext.dispatch?.("transparent", "white");
        } else {
          navbarColorContext.dispatch?.("white", "black");
        }
      },
      { rootMargin: "97%", threshold: 1 }
    );
    const heroEl = heroRef.current;
    if (heroEl) {
      observer.observe(heroEl);
    }
    return () => {
      if (heroEl) {
        observer.unobserve(heroEl);
      }
    };
  }, [navbarColorContext]);

  useEffect(() => {
    scrollToTop();
    getFotd();
  }, [scrollToTop, getFotd]);

  return (
    <section id="home">
      <article className="hero" ref={heroRef}>
        <div className="hero-container">
          <h1 className="hero-card-title">CASSIA</h1>
          <div className="hero-card-bottom-container">
            <h1 className="hero-card-text">THE BEAUTY OF FRAGRANCE</h1>
            <Link to="/fragrances">
              <Button type="button">EXPLORE FRAGRANCES</Button>
            </Link>
          </div>
        </div>
      </article>

      <article className="fotd">
        <ArticleTitle className="fotd-title">FRAGRANCE OF THE DAY</ArticleTitle>
        {fotd ? <FragranceCard fragrance={fotd} userId={user.userId} /> : <Loader />}
        <div className="fotd-card-container">
          {fotd ? (
            <>
              <h1 className="fotd-card-title">{title}</h1>
              <ParagraphText className="fotd-card-text">{text}</ParagraphText>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </article>

      <article className="retailers">
        <ArticleTitle className="retailers-title">RECOMMENDED RETAILERS</ArticleTitle>
        <div className="retailers-logo-list">
          <a href="https://www.fragrancex.com/" target="_blank" className="retailers-logo-link">
            <img src={fragrancex} className="retailers-logo-img" />
          </a>
          <a href="https://www.perfume.com/" target="_blank" className="retailers-logo-link">
            <img src={perfumecom} className="retailers-logo-img" />
          </a>
          <a href="https://www.notino.com/" target="_blank" className="retailers-logo-link">
            <img src={notino} className="retailers-logo-img" />
          </a>
          <a href="https://www.fragrancenet.com/" target="_blank" className="retailers-logo-link">
            <img src={fragrancenet} className="retailers-logo-img" />
          </a>
          <a href="https://www.jomashop.com/" target="_blank" className="retailers-logo-link">
            <img src={jomashop} className="retailers-logo-img" />
          </a>
          <a href="https://www.luckyscent.com/" target="_blank" className="retailers-logo-link">
            <img src={luckyscent} className="retailers-logo-img" />
          </a>
          <a href="https://theperfumespot.com/" target="_blank" className="retailers-logo-link">
            <img src={perfumespot} className="retailers-logo-img" />
          </a>
          <a href="https://www.scentsplit.com/" target="_blank" className="retailers-logo-link">
            <img src={scentsplit} className="retailers-logo-img" />
          </a>
        </div>
      </article>
    </section>
  );
}

export default memo(Home);
