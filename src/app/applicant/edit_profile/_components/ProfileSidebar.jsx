"use client";
import { BadgeCheck, Bell, Shield, HelpCircle } from "lucide-react";

export function ProfileSidebar() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="font-medium flex items-center gap-2 mb-3">
          <BadgeCheck className="w-5 h-5 text-brand" />
          Profile Strength
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-brand h-2.5 rounded-full" style={{width: '75%'}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Complete your profile to increase visibility</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Profile Tips</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>Add your current position to show up in recruiter searches</span>
          </li>
          <li className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>Include at least 3 skills for better matching</span>
          </li>
        </ul>
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
        <Bell className="w-4 h-4" />
        Turn on profile updates
      </button>
    </div>
  );
}