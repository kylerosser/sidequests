import React from "react";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  text,
  className = "",
  ...rest
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm/6 font-medium ${className}`}
      {...rest}
    >
      {text}
    </label>
  );
};