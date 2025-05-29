import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error?: string | boolean;
  disabled?: boolean;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  onChange,
  value,
  error = false,
  disabled = false,
  label,
  id,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  className,
  ...rest
}) => {
  const errorClass = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errorClass} placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm ${
          className || ""
        }`}
        {...rest}
      />
      {error && typeof error === "string" && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
