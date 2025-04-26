"use client";
import FeaturedOpportunities from "./MainContent/FeaturedOpportunities";
import WhyChooseUs from "./MainContent/WhyChooseUS";
import Resources from "./MainContent/Resources";
import Companies from "./MainContent/CompaniesCard";
import { signIn, useSession } from "next-auth/react";
import HeroSection from "./MainContent/HeroSection";
import CompaniesResources from "./MainContent/CompaniesResources";
import CTA from "./MainContent/CTA";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="overflow-hidden">
       <HeroSection session={session} status={status}/>
      <FeaturedOpportunities />
      <WhyChooseUs />
      <Resources />
      <Companies />
      <CompaniesResources />
      <CTA />
    </div>
  );
}
