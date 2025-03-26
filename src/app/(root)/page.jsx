"use client";

import { Button } from "@/components/ui/button";
import FeaturedOpportunities from "./MainContent/FeaturedOpportunities";
import WhyChooseUs from "./MainContent/WhyChooseUS";
import Resources from "./MainContent/Resources";
import Companies from "./MainContent/Companies";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import HeroSection from "./MainContent/HeroSection";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div>
       <HeroSection session={session} status={status}/>
      <FeaturedOpportunities />
      <WhyChooseUs />
      <Resources />
      <Companies />
    </div>
  );
}