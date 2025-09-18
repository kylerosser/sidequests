import React, { useState } from "react";

interface FormLongTextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxCharacters?: number;
  minHeight?: number; // new prop for min height in pixels
}

export const FormLongTextInput: React.FC<FormLongTextInputProps> = ({
  className = "",
  maxCharacters,
  minHeight, // destructure minHeight
  value,
  onChange,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(value?.toString() || "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxCharacters || newValue.length <= maxCharacters) {
      setInternalValue(newValue);
      onChange?.(e);
    }
  };

  const displayedValue = value !== undefined ? value.toString() : internalValue;
  const characters = maxCharacters !== undefined ? displayedValue.length : undefined;

  return (
    <div className="relative">
      <textarea
        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-sq-dark outline-1 -outline-offset-1 outline-sq-grey placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sq-primary sm:text-sm/6 ${className}`}
        maxLength={maxCharacters}
        value={displayedValue}
        onChange={handleChange}
        style={minHeight ? { minHeight: `${minHeight}px`, height: `${minHeight}px` } : undefined}
        {...rest}
      />
      {maxCharacters !== undefined && (
        <div className="absolute bottom-1 right-2 text-xs text-gray-500">
          {characters} / {maxCharacters}
        </div>
      )}
    </div>
  );
};
