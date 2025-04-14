"use client";

import { useSession } from "next-auth/react";
import { Profile } from "./components";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";

const API_BASE_URL = "https://umemployed-app-afec951f7ec7.herokuapp.com/api";

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
          `${API_BASE_URL}/resume/resume-details/`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        const [skillsRes, experiencesRes, educationsRes, languagesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/resume/skills/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/resume/work-experiences/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/resume/educations/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/resume/languages/`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const details = detailsResponse.data;
        const transformedData = {
          name: `${details.first_name || ''} ${details.surname || ''}`.trim() || 'Anonymous',
          headline: details.job_title || "Professional",
          location: {
            city: details.state || "Unknown city",
            country: details.country || "Unknown country",
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
            phone: details.phone,
            dateOfBirth: details.date_of_birth,
            email: session.user?.email || ""
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

  if (status === "loading" || loading) {
    return (
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-[300px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80%]" />
              <Skeleton className="h-3 w-[60%]" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Profile Loading Failed</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <Profile user={profileData} isOwner={true} />;
}