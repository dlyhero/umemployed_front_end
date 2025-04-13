import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
    return (
        <div>
        <p className="text-sm text-nowrap text-gray-800 text-center mt-1">© {new Date().getFullYear()} UmEmployed. All rights reserved.</p>
         </div>
    );
}
