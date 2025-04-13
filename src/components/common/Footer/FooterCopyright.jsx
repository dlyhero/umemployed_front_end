import React from "react";

export default function FooterCopyright() {
  return (
    <p className="text-xs text-gray-500 mt-8 text-center md:text-left">
      © {new Date().getFullYear()} UmEmployed. All rights reserved.
    </p>
  );
}