import React from "react";

interface ButtonProps {
  loading?: boolean;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  disabled = false,
  label,
  onClick,
  type = "button",
  fullWidth = true,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group relative ${
        fullWidth ? "w-full" : ""
      } flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
};

export default Button;
