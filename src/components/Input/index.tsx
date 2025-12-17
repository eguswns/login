import type { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ type, placeholder, value, className, ...props }: IProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className={className}
      {...props}
    ></input>
  );
};

export default Input;
