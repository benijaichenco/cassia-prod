import { memo, SyntheticEvent, useState } from "react";

import "./authFormInput.css";

interface AuthFormInputProps {
  id: string;
  label: string;
  type: string;
  style?: string;
  required?: boolean;
  onChange?: (e: SyntheticEvent<HTMLInputElement>) => void;
}

const AuthFormInput = ({ id, label, type, required, onChange }: AuthFormInputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      return;
    }
    setIsFocused(false);
  };

  return (
    <>
      <div className="auth-form-input-wrapper">
        <label htmlFor={id} className={`auth-form-label ${isFocused ? "active" : ""}`}>
          {label}
        </label>
        <input
          autoComplete="off"
          id={id}
          type={type}
          name={id}
          className="auth-form-input"
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default memo(AuthFormInput);
