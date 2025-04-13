'use client';

import { useState } from 'react';

export const MultiSelect = ({ options = [], value = [], onChange }) => {
  const [open, setOpen] = useState(false);

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="relative inline-block w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded px-4 py-2 text-left"
      >
        {value.length > 0 ? value.join(', ') : 'Select options'}
      </button>
      {open && (
        <ul className="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow z-10">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => toggleOption(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                value.includes(option) ? 'bg-blue-50 font-semibold' : ''
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
