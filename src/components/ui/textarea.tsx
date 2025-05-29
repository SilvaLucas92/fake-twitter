import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  error?: string;
  disabled?: boolean;
  label?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  onChange,
  value,
  error = false,
  disabled = false,
  label,
  id,
  name,
  placeholder,
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
      <textarea
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errorClass} placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm ${
          className || ""
        }`}
        {...rest}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;
