import { memo, ReactNode } from "react";

import "./paragraphText.css";

interface ParagraphTextProps {
  className?: string;
  children: ReactNode;
}

const ParagraphText = ({ className, children }: ParagraphTextProps) => {
  return <p className={`${className} paragraph-text`}>{children}</p>;
};

export default memo(ParagraphText);
