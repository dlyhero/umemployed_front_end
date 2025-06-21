"use client";

export function InputWithIcon({
  icon: Icon,
  label,
  type = "text",
  options,
  value,
  name,
  required = false
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        {options ? (
          <select
          value={value}
            name={name}
            required={required}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-brand focus:border-brand"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
          value={value}
            type={type}
            name={name}
            required={required}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>
    </div>
  );
}