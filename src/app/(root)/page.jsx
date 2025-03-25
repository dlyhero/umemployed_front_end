"use client"
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import FeaturedOpportunities from "./FeaturedOpportunities";
import WhyChooseUs from "./WhyChooseUS";
import Resources from "./Resources";
import Companies from "./Companies";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
   const { data: session, status } = useSession();
  
    
  return (
    <div>
      <div id="Hero-section" className="flex justify-between items-center bg-white">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto pt-14 p-2 md:mt-0">
          <div id="left-side" className="self-center lg:mb-[15%] px-4 w-fit lg:w-5xl">
          <div className="hero-text text-center md:text-start">
          <h1 className="hero-title text-brand text-2xl md:text-3xl mb-2">Unlock Your Dream Job – The Future of Your Career Starts Now!
            </h1>
            <h2 className="hero-subtitle text-gray-800 text-xl mb-2">Browse thousands of job listings and <br/> seize the opportunity to advance your career.</h2>
            
          </div>
          <div className="btnS my-4 flex flex-col md:w-[80%]">
            {!session?.user ? (
              <>
                <Link  href="/signup"  className={' mb-2 rounded-full text-white text-center bg-brand font-semibold p-2'} >Sign Up Now</Link>
                <div className="text-center my-4 flex items-center gap-4">
                  <hr className="flex-1 border-gray-300"/>
                  <span>Or</span>
                  <hr className="flex-1 border-gray-300" />
                </div>
                <Button onClick={() => signIn()} variant={'outline'} className={'border-brand text-brand hover:text-brand/70 rounded-full font-semibold my-4'}>Log in</Button>
              </>
            ): <div className="flex flex-col w-full mt-10 gap-y-8">
               <Link href="#" className={'bg-brand text-white font-semibold rounded-full p-2 text-center'}>Browse jobs</Link>
               <Link href="#" className={'border border-brand text-brand font-semibold rounded-full p-2 text-center'}>let's get started</Link>
              </div>}
          </div>
          </div>
          <div id="right-side">
            <img src="/images/ue3.avif" alt="" className="lg:ml-28 lg:w-7xl lg:h-auto"/>
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
