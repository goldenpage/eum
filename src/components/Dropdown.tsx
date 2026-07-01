import type { CSSProperties } from "react";

interface DropdownProps {
  text: string[];
  style?: CSSProperties;
}

function Dropdown(props: DropdownProps) {
  const { text, style } = props;
  return (
    <div>
      <select name="" id="" style={style}>
        {text.map((item) => (
          <option>{item}</option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
