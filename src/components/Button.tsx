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

/* 버튼 작업 예시
const App = () => {
  const onClickBtn = ()=>{
    console.log("1");
  }
  return <div>
    <Button type={"button"} onClick={onClickBtn} id={"searchBtn"}  className="removebtn" value="test" style={{width:"100px"}} >
      rdsgdgsfd
      </Button>
  
  </div>;
}
*/
