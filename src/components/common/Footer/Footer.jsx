import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="flex flex-col sm:flex-row justify-center gap-2 items-center mt-4 text-gray-600">
            <p className="text-sm text-nowrap">© 2024 UmEmployed. All rights reserved.</p>
            <div className="flex space-x-2 items-center">
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="text-black hover:text-gray-500"
                >
                    <FaTwitter size={18} />
                </a>
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="text-black hover:text-gray-500"
                >
                    <FaLinkedin size={18} />
                </a>
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="text-black hover:text-gray-500"
                >
                    <FaFacebook size={18} />
                </a>
                <img src="/images/privacy.png" alt="Privacy" className="w-8 h-4" />
            </div>
            <div className="text-sm flex space-x-4">
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="hover:text-gray-500"
                >
                    Privacy Policy
                </a>
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="hover:text-gray-500"
                >
                    Contact Us
                </a>
            </div>
        </div>
    );
}
