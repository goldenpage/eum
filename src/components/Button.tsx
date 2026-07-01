import { type CSSProperties } from "react";

interface ButtonProps {
  type?: "button" | "submit";
  onClick?: () => void;
  id?: string;
  className?: string;
  value?: string;
  // data-status: string;
  style?: CSSProperties;
  children: string; // 버튼 안에 들어가는 값
}

function Button(props: ButtonProps) {
  const { type, onClick, id, className, value, style, children } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      id={id}
      className={className}
      value={value}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
