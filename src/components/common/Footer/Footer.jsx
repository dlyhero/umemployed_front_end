import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="flex flex-col sm:flex-row justify-center gap-2 items-center absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-600">
            <p className="text-sm text-nowrap">© 2024 UmEmployed. All rights reserved.</p>
            <div className="flex space-x-2 items-center">
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="text-black hover:text-gray-500"
                >
                    <FaTwitter size={20} />
                </a>
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="text-black hover:text-gray-500"
                >
                    <FaLinkedin size={20} />
                </a>
                <a
                    href="/accounts/user/feature-not-implemented/"
                    className="text-black hover:text-gray-500"
                >
                    <FaFacebook size={20} />
                </a>
                <img src="/images/privacy.png" alt="Privacy" className="w-10 h-5" />
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
