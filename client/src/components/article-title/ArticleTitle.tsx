import { memo, ReactNode } from "react";

import "./articleTitle.css";

interface ArticleTitleProps {
  className?: string;
  children: ReactNode;
}

const ArticleTitle = ({ className, children }: ArticleTitleProps) => {
  return <h1 className={`${className} article-title`}>{children}</h1>;
};

export default memo(ArticleTitle);
