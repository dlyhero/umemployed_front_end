"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/src/components/common/Footer/Footer";

const ForgotPassword = () => {
  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 gap-5">
       <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center mb-8">
            <Link href="/login" className="mr-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
              <p className="text-gray-600">Enter your email to receive a reset link</p>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button type="submit" className="w-full bg-brand text-white hover:bg-brad/70">
                Send Reset Link
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-brand hover:text-brand/70">
              Sign in
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-8 py-4 bg-gray-50 text-center text-sm text-gray-500"
        >
          Need help?{" "}
          <Link href="/support" className="font-medium text-gray-700 hover:text-gray-900">
            Contact support
          </Link>
        </motion.div>

      </motion.div>
       <Footer />

    </div>

  );
};

export default ForgotPassword;