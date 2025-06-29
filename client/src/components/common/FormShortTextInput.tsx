import React from "react";

export const FormShortTextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  type = "text",
  className = "",
  ...rest
}) => {
  return (
    <input
      type={type}
      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-sq-dark outline-1 -outline-offset-1 outline-sq-grey placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sq-primary sm:text-sm/6 ${className}`}
      {...rest}
    />
  );
};