"use client";

import { Button } from "@/components/ui/button";
import FeaturedOpportunities from "./MainContent/FeaturedOpportunities";
import WhyChooseUs from "./MainContent/WhyChooseUS";
import Resources from "./MainContent/Resources";
import Companies from "./MainContent/Companies";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div>
      <div id="Hero-section" className="flex justify-between items-center bg-white">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto pt-14 p-2 md:mt-0">
          <div id="left-side" className="self-center lg:mb-[15%] px-4 w-full md:w-fit lg:w-5xl">
            <div className="hero-text text-center md:text-start">
              <h1 className="hero-title text-brand text-2xl md:text-3xl mb-2">
                Unlock Your Dream Job – The Future of Your Career Starts Now!
              </h1>
              <h2 className="hero-subtitle text-gray-800 text-xl mb-2">
                Browse thousands of job listings and <br /> seize the opportunity to advance your career.
              </h2>
            </div>
            <div className="btnS my-4 flex flex-col w-full md:w-[80%] relative min-h-[180px]">
              {/* Persistent structure that doesn't change */}
              <div className="flex flex-col gap-4 w-full">
                {/* Top Button (Sign Up/Browse Jobs) */}
                <div className="relative h-12">
                  {status === "loading" ? (
                    <div className="absolute inset-0 w-full h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : !session?.user ? (
                    <Link 
                      href="/signup" 
                      className="absolute inset-0 w-full rounded-full text-white text-center bg-brand font-semibold p-2 flex items-center justify-center"
                    >
                      Sign Up Now
                    </Link>
                  ) : (
                    <Link 
                      href="#" 
                      className="absolute inset-0 w-full bg-brand text-white font-semibold rounded-full p-2 text-center flex items-center justify-center"
                    >
                      Browse jobs
                    </Link>
                  )}
                </div>


                {/* Bottom Button (Login/Get Started) */}
                <div className="relative h-12">
                  {status === "loading" ? (
                    <div className="absolute inset-0 w-full h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : !session?.user ? (
                    <Button 
                      onClick={() => signIn()} 
                      variant={'outline'} 
                      className="absolute inset-0 w-full border-brand text-brand hover:text-brand/70 p-5.5 rounded-full font-semibold my-4 cursor-pointer flex items-center justify-center"
                    >
                      Log in
                    </Button>
                  ) : (
                    <Link 
                      href="#" 
                      className="absolute inset-0 w-full border border-brand text-brand font-semibold rounded-full p-2 text-center flex items-center justify-center"
                    >
                      Let's get started
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div id="right-side">
            <img src="/images/ue3.avif" alt="" className="lg:ml-28 lg:w-7xl lg:h-auto" />
          </div>
        </div>
      </div>
      <FeaturedOpportunities />
      <WhyChooseUs />
      <Resources />
      <Companies />
    </div>
  );
}