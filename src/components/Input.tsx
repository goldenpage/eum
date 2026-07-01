interface InputType {
  text: string;
  inputType: "text" | "number" | "password"|"email" |"date";
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number;
  height?: number;
  min?: number;
}

function Input(props: InputType) {
  return (
    <div>
      <div>{props.text}</div>
      <input
        type={props.inputType}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        min={props.inputType === "number" ? props.min : undefined}
        style={{ width: props.width, height: props.height }}
      />
    </div>
  );
}
export default Input;