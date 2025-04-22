'use client'
import useUser from '@/src/hooks/useUser';
import { motion } from 'framer-motion'

export const WelcomeSection = (session) => {
  const user = useUser();


  return (<motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-brand to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6"
  >
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user.user?.first_name} {user.user?.last_name}!</h1>
        <p className="opacity-90 max-w-lg">Your personalized dashboard to help you land your dream job faster.</p>
      </div>
      <button className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full font-medium transition">
        Complete Profile
      </button>
    </div>
  </motion.section>)
};