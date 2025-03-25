"use client"
import React from 'react'
import Link from 'next/link'
import { FaBuilding, FaBriefcase, FaPlusCircle, FaEnvelope } from 'react-icons/fa';


function MenuLinks() {
    return (

        <div className="flex flex-col gap-4 mb-8">
            <Link href="/resume/upload/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                <FaBuilding /> Companies
            </Link>
            <Link href="/jobs/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                <FaBriefcase /> Browse Jobs
            </Link>
            <Link href="/accounts/user/feature-not-implemented/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                <FaPlusCircle /> Post a Job
            </Link>
            <Link href="/accounts/user/feature-not-implemented/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                <FaEnvelope /> Contact Us
            </Link>
        </div>

    )
}

export default MenuLinks