import { memo, ReactNode } from "react";

import "./button.css";

interface ButtonProps {
  className?: string;
  type: "submit" | "reset" | "button" | undefined;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  color?: string;
  backgroundColor?: string;
  letterSpacing?: string;
}

const Button = ({
  className,
  type,
  children,
  onClick,
  disabled,
  color,
  backgroundColor,
  letterSpacing,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      style={{
        color,
        backgroundColor: (!disabled && backgroundColor) || undefined,
        letterSpacing,
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default memo(Button);
