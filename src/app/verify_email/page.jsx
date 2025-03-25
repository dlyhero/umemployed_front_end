"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setMessage("");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (code === "123456") {
        setMessage("Email verified successfully!");
      } else {
        setMessage("Invalid verification code.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage("Resending code...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessage("Verification code resent to your email.");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
      <FaEnvelope className="text-blue-500 text-4xl mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Verify Your Email</h2>
      <p className="text-gray-600 mb-4">Enter the 6-digit code sent to your email.</p>
      <Input
        type="text"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mb-3 text-center"
      />
      <Button onClick={handleVerify} disabled={loading} className="w-full">
        {loading ? "Verifying..." : "Verify Email"}
      </Button>
      <button
        onClick={handleResend}
        disabled={loading}
        className="mt-3 text-blue-500 hover:underline text-sm"
      >
        Resend Code
      </button>
      {message && (
        <p className={`mt-3 text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
