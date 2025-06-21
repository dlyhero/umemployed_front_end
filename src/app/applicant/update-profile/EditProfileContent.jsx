"use client";

import { 
  User, Mail, Phone, Globe, Briefcase, 
  Building, MapPin, Calendar, BookOpen, Award
} from "lucide-react";
import { 
  ProfileHeader,
  InputWithIcon,
  ProfileSidebar,
  ProfileForm
} from "./_components";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import baseUrl from "../../api/baseUrl";

export function EditProfileContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    job_title: "",
    company: "",
    location: "",
    start_date: "",
    education: "",
    degree: ""
  });

  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
  ];

  const jobTitles = [
    { value: "1", label: "Software Engineer" },
    { value: "2", label: "Product Manager" },
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.user_id) return;

      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/resume/contact-info/`, {
          headers: {
            Authorization: `Bearer ${session.user.access}`,
          },
        });
        setFormData(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const parseResumeText = (text) => {
    // ... (keep your existing parseResumeText implementation)
  };

  useEffect(() => {
    // ... (keep your existing resume data parsing useEffect)
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.user_id) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/resume/contact-info/`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.user.access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Profile saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!session?.user?.user_id) return;
    
    if (window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) {
      setLoading(true);
      try {
        await axios.delete(`${baseUrl}/resume/contact-info/${session.user.user_id}/`, {
          headers: {
            Authorization: `Bearer ${session.user.access}`,
          },
        });
        console.log("Profile deleted successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          job_title: "",
          company: "",
          location: "",
          start_date: "",
          education: "",
          degree: ""
        });
      } catch (error) {
        console.error("Error deleting profile:", error);
        setError(error.response?.data?.message || "Failed to delete profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && !formData.name) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ProfileHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-3">
          <div className="lg:col-span-3 space-y-6">
            <ProfileForm onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWithIcon
                    icon={User}
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <InputWithIcon 
                    icon={Mail}
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <InputWithIcon 
                    icon={Phone}
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <InputWithIcon 
                    icon={Globe}
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    options={countries}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Professional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWithIcon 
                    icon={Briefcase}
                    label="Job Title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    options={jobTitles}
                    required
                  />
                  <InputWithIcon 
                    icon={Building}
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                  <InputWithIcon 
                    icon={MapPin}
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  <InputWithIcon 
                    icon={Calendar}
                    label="Start Date"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  Education
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWithIcon 
                    icon={BookOpen}
                    label="School/University"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                  />
                  <InputWithIcon 
                    icon={Award}
                    label="Degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  disabled={!session?.user?.user_id || loading}
                >
                  Delete Profile
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/70 transition-colors"
                  disabled={loading || !session?.user?.user_id}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </ProfileForm>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ProfileSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}