import { memo, useEffect } from "react";
import { useNavbarColorContext } from "../../context/NavbarColorContext";

import "./notFound.css";

const NotFound = () => {
  const navbarColorContext = useNavbarColorContext();

  useEffect(() => {
    navbarColorContext.dispatch?.("white", "black");
  }, [navbarColorContext]);
  return (
    <section id="not-found">
      <div className="not-found-header">404</div>
      <div className="not-found-title">Oops!</div>
      <div className="not-found-text">The page you were looking for was not found.</div>
    </section>
  );
};

export default memo(NotFound);
