import { useEffect } from 'react'; 
import Link from 'next/link'; 
import { FaBuilding, FaBriefcase, FaPlusCircle, FaEnvelope, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function MobileMenu({ isClosed, setIsClosed }) {
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsClosed(); // Close the mobile menu when screen width exceeds 768px
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Immediately check the screen size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setIsClosed]);

    return (
        <div className={`fixed h-screen top-0 left-0 right-0 flex flex-col bg-white max-w-[500px] py-4 px-4 shadow-lg z-50 md:hidden`}>
            <div className="flex justify-between items-center mb-6">
                <img className="h-[20px] lg:h-[24px]" src="/static/new_design/logo/png/logo-color.png" alt="Logo" />
                <button className="text-3xl" onClick={isClosed}>
                    ×
                </button>
            </div>

            <div className="flex flex-col gap-4 mb-8">
                <Link href="/resume/upload/" className="menu-item flex items-center gap-2 font-semibold p-2 border-b">
                    <FaBuilding /> Companies
                </Link>
                <Link href="/jobs/" className="menu-item flex items-center gap-2 font-semibold p-2 border-b">
                    <FaBriefcase /> Browse Jobs
                </Link>
                <Link href="/accounts/user/feature-not-implemented/" className="menu-item flex items-center gap-2 font-semibold p-2 border-b">
                    <FaPlusCircle /> Post a Job
                </Link>
                <Link href="/accounts/user/feature-not-implemented/" className="menu-item flex items-center gap-2 font-semibold p-2 border-b">
                    <FaEnvelope /> Contact Us
                </Link>
            </div>

            {/* Authentication Buttons */}
            <div className="flex flex-col gap-4 absolute bottom-10 right-4 left-4">
                <Link href="/accounts/user/register-applicant/" className="w-full bg-transparent text-[#1e90ff] border px-6 py-3 rounded-full text-center font-semibold flex justify-center items-center gap-2">
                    <FaUserPlus /> Create Account
                </Link>
                <Link href="/api/users/login/" className="w-full bg-[#1e90ff] text-white px-6 py-3 rounded-full text-center font-semibold flex justify-center items-center gap-2">
                    <FaSignInAlt /> Login
                </Link>
            </div>
        </div>
    );
}
