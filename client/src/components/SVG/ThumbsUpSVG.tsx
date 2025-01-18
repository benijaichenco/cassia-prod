import { memo } from "react";
import { SVGProps } from "../../types";

const ThumbsUpSVG = ({ className, pathClassName }: SVGProps) => {
  return (
    <svg
      className={className}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.49561 18.35L10.5956 20.75C10.9956 21.15 11.8956 21.35 12.4956 21.35H16.2956C17.4956 21.35 18.7956 20.45 19.0956 19.25L21.4956 11.95C21.9956 10.55 21.0956 9.34997 19.5956 9.34997H15.5956C14.9956 9.34997 14.4956 8.84997 14.5956 8.14997L15.0956 4.94997C15.2956 4.04997 14.6956 3.04997 13.7956 2.74997C12.9956 2.44997 11.9956 2.84997 11.5956 3.44997L7.49561 9.54997"
        stroke="currentColor"
        className={pathClassName}
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="M2.39563 18.35V8.55002C2.39563 7.15002 2.99563 6.65002 4.39563 6.65002H5.39563C6.79563 6.65002 7.39563 7.15002 7.39563 8.55002V18.35C7.39563 19.75 6.79563 20.25 5.39563 20.25H4.39563C2.99563 20.25 2.39563 19.75 2.39563 18.35Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default memo(ThumbsUpSVG);
