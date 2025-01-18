import { memo, useEffect } from "react";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import { useLenisScrollTo } from "../../utils";
import ParagraphText from "../../components/paragraph-text/ParagraphText";

import "./about.css";

function About() {
  const scrollToTop = useLenisScrollTo();
  const navbarColorContext = useNavbarColorContext();
  useEffect(() => {
    navbarColorContext.dispatch?.("white", "black");
    scrollToTop();
  }, [scrollToTop, navbarColorContext]);
  return (
    <section id="about">
      <article className="about-letter-container">
        <div className="about-paragraph-container">
          <ParagraphText className="about-text about-title">Dear Reader,</ParagraphText>
        </div>
        <div className="about-paragraph-container">
          <ParagraphText className="about-text">
            Cassia is a space to explore the world of fragrances. It's a journal where scents and
            stories come together, offering inspiration and insight for those who love the art of
            perfumery.
          </ParagraphText>
        </div>
        <div className="about-paragraph-container">
          <ParagraphText className="about-text">
            Whether it's a note that sparks a memory or a fragrance that captures a mood, I hope you
            find something here that resonates with you.
          </ParagraphText>
        </div>
        <div className="about-paragraph-container">
          <ParagraphText className="about-text">
            Thank you for visiting and sharing in this journey.
          </ParagraphText>
        </div>
        <div className="about-paragraph-container">
          <ParagraphText className="about-text">
            Warm regards,
            <br />
            Beni.
          </ParagraphText>
        </div>
      </article>
    </section>
  );
}

export default memo(About);
