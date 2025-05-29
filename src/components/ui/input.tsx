import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  className,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const errorClass = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleTogglePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

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
      <div className="relative">
        <input
          id={id || name}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errorClass} placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm ${
            isPassword ? "pr-10" : ""
          } ${className || ""}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none z-20"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && typeof error === "string" && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
