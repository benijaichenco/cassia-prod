import { memo } from "react";

import "./formErrorText.css";

const FormErrorText = ({ value }: { value: string }) => {
  return <div className="form-error-text">{value}</div>;
};

export default memo(FormErrorText);
