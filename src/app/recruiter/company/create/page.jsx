"use client"

import dynamic from "next/dynamic";

const CompanyCreatePage = dynamic(() => import("./CompanyCreationPage"), {
  ssr: false, // Disables SSR
});

export default CompanyCreatePage;
