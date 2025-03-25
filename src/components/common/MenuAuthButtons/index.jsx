import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react';
import {FaUserPlus, FaSignInAlt } from 'react-icons/fa';



export default function index() {
      const {data: session, status} = useSession();
    
        if (status === "loading") return null;
    return (
        <div className="flex flex-col gap-4">
            {!(session?.user) && (<button className="w-full border px-6 py-3 rounded-full text-brand text-center font-semibold flex items-center justify-center gap-2">
                <FaUserPlus /> Create Account
            </button>)}
            {session?.user ? (<button onClick={() => signOut()} className="w-full bg-brand text-white px-6 py-3 rounded-full text-center font-semibold flex items-center justify-center gap-2">
                <FaSignInAlt /> Logout
            </button>) : (<button onClick={() => signIn()} className="w-full bg-brand text-white px-6 py-3 rounded-full text-center font-semibold flex items-center justify-center gap-2">
                <FaSignInAlt /> Login
            </button>)}
        </div>
    )
}
