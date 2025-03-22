import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <div id="Hero-section" className="flex justify-between items-center bg-white">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-2">
          <div id="left-side" className="self-center mb-[5%] px-4">
          <div className="hero-text">
          <h1 className="hero-title text-brand text-3xl mb-2">Your Career Starts Here!
            </h1>
            <h2 className="hero-subtitle text-gray-800 text-xl mb-2">Browse thousands of job listings and <br/> seize the opportunity to advance your career.</h2>
            <h3 className="text-gray-800 ">
              Unlock new opportunities with our platform. <br/> Connect with leading companies, grow your career, and realize your potential.</h3>
          </div>
          <div className="btnS my-4 flex flex-col w-[80%]">
            <Button variant={'brand'} className={' mb-2'}>Sign In Now</Button>
            <div className="text-center mb-2">or</div>
            <Button variant={'outline'} className={'border-brand text-brand'}>Log in</Button>
          </div>
          </div>
          <div id="right-side">
            <img src="/images/ue3.avif" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
