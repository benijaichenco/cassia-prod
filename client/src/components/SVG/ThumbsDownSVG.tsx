import { memo } from "react";
import { SVGProps } from "../../types";

const ThumbsDownSVG = ({ className, pathClassName }: SVGProps) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        className={pathClassName}
        d="M16.5356 5.65002L13.4356 3.25002C13.0356 2.85002 12.1356 2.65002 11.5356 2.65002H7.7356C6.5356 2.65002 5.2356 3.55002 4.9356 4.75002L2.5356 12.05C2.0356 13.45 2.9356 14.65 4.4356 14.65H8.4356C9.0356 14.65 9.5356 15.15 9.4356 15.85L8.9356 19.05C8.7356 19.95 9.3356 20.95 10.2356 21.25C11.0356 21.55 12.0356 21.15 12.4356 20.55L16.5356 14.45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="M21.6356 5.65V15.45C21.6356 16.85 21.0356 17.35 19.6356 17.35H18.6356C17.2356 17.35 16.6356 16.85 16.6356 15.45V5.65C16.6356 4.25 17.2356 3.75 18.6356 3.75H19.6356C21.0356 3.75 21.6356 4.25 21.6356 5.65Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default memo(ThumbsDownSVG);
