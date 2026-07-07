import { type CSSProperties } from "react";
import "./Button.css";

interface ButtonProps {
  type?: "button" | "submit";
  onClick?: () => void;
  id?: string;
  className?: string;
  value?: string;
  // data-status: string;
  style?: CSSProperties;
  children: string;
}

function Button(props: ButtonProps) {
  const { type, onClick, id, className, value, style, children } = props;
  const mergedClassName = className ? `btn ${className}` : "btn";

  return (
    <button
      type={type}
      onClick={onClick}
      id={id}
      className={mergedClassName}
      value={value}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
