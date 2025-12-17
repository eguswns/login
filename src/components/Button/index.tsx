import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Button = ({ children, className, ...props }: IProps) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
