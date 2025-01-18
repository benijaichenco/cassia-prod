import { memo } from "react";
import { SVGProps } from "../../types";

const SortSVG = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 17H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export default memo(SortSVG);
