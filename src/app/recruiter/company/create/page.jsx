// src/app/recruiter/company/create/page.jsx
"use client";

import dynamic from "next/dynamic";

const CompanyCreationPage = dynamic(() => import("./CompanyCreationPage"), {
  ssr: false,
});

export default function CompanyCreatePage() {
  return <CompanyCreationPage />;
}