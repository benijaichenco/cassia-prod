import { memo } from "react";

import "./loader.css";

const Loader = ({ scale }: { scale?: number }) => {
  return (
    <div className="loader-container" style={{ transform: `scale(${scale})` }}>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
      <div className="loader-line"></div>
    </div>
  );
};

export default memo(Loader);
