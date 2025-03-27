import React from "react";

export default function FooterActions() {
  return (
    <div className="space-y-6">
      {/* Help Center */}
      <div className="flex items-center space-x-4">
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <a
            href="/accounts/user/contact/"
            className="text-sm font-semibold text-gray-700 hover:text-brand"
          >
            Need Help?
          </a>
          <p className="text-xs text-gray-500">Visit our Support Center.</p>
        </div>
      </div>

      {/* Account Settings */}
      <div className="flex items-center space-x-4">
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <div>
          <a
            href="/settings"
            className="text-sm font-semibold text-gray-700 hover:text-brand"
          >
            Account Settings
          </a>
          <p className="text-xs text-gray-500">Manage your preferences.</p>
        </div>
      </div>

      {/* Language Selector */}
      <div>
        <label htmlFor="language" className="block text-xs text-gray-500 mb-1">
          Select Language
        </label>
        <select
          id="language"
          className="w-full p-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          {/* Add more languages as needed */}
        </select>
      </div>
    </div>
  );
}