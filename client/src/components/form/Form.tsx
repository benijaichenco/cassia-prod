import { memo, ReactNode } from "react";

import "./form.css";

interface FormProps {
  children: ReactNode;
  id: string;
}

const Form = ({ children, id }: FormProps) => {
  return (
    <form id={id} className="form">
      {children}
    </form>
  );
};

export default memo(Form);
