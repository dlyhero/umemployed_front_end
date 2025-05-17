import React from "react";

export default function FooterLinks() {
  const links = [
    { href: "/accounts/user/about/", text: "About Us" },
    { href: "/accounts/user/accessibility/", text: "Accessibility" },
    { href: "/accounts/user/employers/", text: "For Employers" },
    { href: "/accounts/user/policies/", text: "Community Guidelines" },
    { href: "/accounts/user/careers/", text: "Work With Us" },
    { href: "/accounts/user/advertise/", text: "Advertise Jobs" },
    { href: "/accounts/user/privacy/", text: "Privacy Policy" },
    { href: "/accounts/user/terms/", text: "Terms of Service" },
    { href: "/accounts/user/safety/", text: "Safety Center" },
    { href: "/accounts/user/blog/", text: "Blog" },
    { href: "/contact", text: "Contact Us" },
    { href: "/accounts/user/partners/", text: "Partners" },
  ];

  return (
    <nav className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="text-sm font-semibold text-gray-700 hover:text-brand"
        >
          {link.text}
        </a>
      ))}
    </nav>
  );
}