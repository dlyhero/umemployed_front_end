"use client";

import { useSession } from "next-auth/react";
import { Profile } from "./components";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import baseUrl from "../../api/baseUrl";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading" || !token) return;

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const detailsResponse = await axios.get(
          `${baseUrl}/resume/resume-details/`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        const [skillsRes, experiencesRes, educationsRes, languagesRes, contactInfo] = await Promise.all([
          axios.get(`${baseUrl}/resume/skills/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`${baseUrl}/resume/work-experiences/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`${baseUrl}/resume/educations/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`${baseUrl}/resume/languages/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`${baseUrl}/resume/contact-info/`, {headers: {'Authorization': `Bearer ${token}`}})
        ]);
        

        const details = detailsResponse.data;
        console.log(skillsRes);
        const transformedData = {
          name: `${details.first_name || ''} ${details.surname || ''}`.trim() || 'Anonymsous',
          job_title: details.job_title,
          location: {
            city: details.state || "Unknown city",
            country: contactInfo.data[0].country || "Unknown country",
            remote: false
          },
          connections: 0,
          about: details.description || "No description provided",
          experiences: experiencesRes.data || [],
          educations: educationsRes.data || [],
          skills: [...new Set([...(details.skills || []), ...(skillsRes.data || [])])].slice(0, 20),
          languages: (languagesRes.data || []).slice(0, 10),
          jobPreferences: {
            title: details.job_title || "",
            jobTypes: [],
            industries: [],
            salary: ""
          },
          cv: {
            name: details.cv?.split('/').pop() || "Resume.pdf",
            url: details.cv,
            size: "Unknown",
            date: details.updated_at
          },
          profileImage: details.profile_image || "/default-avatar.jpg",
          personalInfo: {
            country: contactInfo.data[0].country,
            phone: details.phone,
            dateOfBirth: details.date_of_birth,
            email: contactInfo.data[0].email || "",
            id: contactInfo.data[0].id,
            user: contactInfo.data[0].user
          }
        };
        setProfileData(transformedData);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, status, session?.user?.email]);

  const resetError = () => setError(null);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white">
      {/* Loading Modal with Animation */}
      <AnimatePresence>
        {(status === "loading" || loading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 className="h-12 w-12 text-brand animate-spin" />
                </motion.div>
                <h3 className="text-xl font-semibold">Loading Profile</h3>
                <p className="text-gray-500 text-center">
                  We're gathering your profile information. Please wait a moment...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <motion.div
                    className="bg-brand h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal with Animation */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0] 
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </motion.div>
                <h3 className="text-xl font-semibold">Oops! Something went wrong</h3>
                <p className="text-gray-500 text-center">
                  {error}. Please try again or contact support if the problem persists.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={resetError}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </Button>
                  <Button
                    className="bg-brand text-white hover:bg-brand"
                    onClick={() => window.location.reload()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {profileData && <Profile initialUser={profileData} isOwner={true} />}
    </div>
  );
}