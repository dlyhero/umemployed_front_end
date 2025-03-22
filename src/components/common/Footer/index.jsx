import React from "react";
import FooterLinks from "./FooterLinks";
import FooterActions from "./FooterActions";
import FooterCopyright from "./FooterCopyright";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 px-4">
      <div className="container max-w-6xl mx-auto px-2 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Links Section */}
          <FooterLinks />

          {/* Actions Section */}
          <FooterActions />
        </div>

        {/* Copyright Section */}
        <FooterCopyright />
      </div>
    </footer>
  );
}