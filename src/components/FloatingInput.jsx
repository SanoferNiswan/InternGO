import React from 'react';

const FloatingInput = ({ id, label, name, type = "text", value, onChange, disabled = false,placeholder=""}) => {
  const minDate = "1970-01-01";
  const maxDate = "2005-12-31";

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value || ""}
        onChange={onChange} 
        disabled={disabled}
        min={type === "date" ? minDate : undefined}
        max={type === "date" ? maxDate : undefined}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-black dark:border-gray-300 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
          disabled ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
        placeholder={placeholder}
      />
      <label
        htmlFor={id}
        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-4 ml-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
