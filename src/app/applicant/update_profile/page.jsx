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

export default function EditProfile() {
  const searchParams = useSearchParams();
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
    // ... other countries
  ];

  const jobTitles = [
    { value: "1", label: "Software Engineer" },
    { value: "2", label: "Product Manager" },
    // ... other job titles
  ];

  const parseResumeText = (text) => {
    const parsedInfo = {};
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    // Extract name (first line)
    if (lines.length > 0 && !parsedInfo.name) {
      parsedInfo.name = lines[0].split('+')[0].trim(); // Remove phone number if present
    }

    // Extract phone (look for phone pattern)
    const phoneMatch = text.match(/(\+?\d[\d\s-]{7,}\d)/);
    if (phoneMatch) {
      parsedInfo.phone = phoneMatch[0].trim();
    }

    // Extract email (look for email pattern)
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      parsedInfo.email = emailMatch[0].trim();
    }

    // Extract job title (look for common tech positions)
    for (let i = 0; i < lines.length; i++) {
      if (!parsedInfo.job_title && 
          (lines[i].includes('Engineer') || 
           lines[i].includes('Developer') || 
           lines[i].includes('Software'))) {
        parsedInfo.job_title = lines[i].trim();
        break;
      }
    }

    // Extract location (line after job title)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === parsedInfo.job_title && i + 1 < lines.length) {
        parsedInfo.location = lines[i + 1].trim();
        break;
      }
    }

    // Extract education (look for EDUCATION section)
    const educationIndex = lines.findIndex(line => 
      line.toUpperCase().includes('EDUCATION')
    );
    if (educationIndex !== -1 && educationIndex + 1 < lines.length) {
      parsedInfo.education = lines[educationIndex + 1].trim();
      // Try to find degree
      for (let i = educationIndex + 1; i < lines.length; i++) {
        if (lines[i].includes('Bachelor') || lines[i].includes('Degree')) {
          parsedInfo.degree = lines[i].trim();
          break;
        }
      }
    }

    // Extract company experience (look for PROFESSIONAL EXPERIENCE section)
    const experienceIndex = lines.findIndex(line => 
      line.toUpperCase().includes('PROFESSIONAL EXPERIENCE') || 
      line.toUpperCase().includes('WORK EXPERIENCE')
    );
    if (experienceIndex !== -1 && experienceIndex + 1 < lines.length) {
      // Get first company after experience header
      for (let i = experienceIndex + 1; i < lines.length; i++) {
        if (lines[i].trim() && !lines[i].toUpperCase().includes('EDUCATION')) {
          parsedInfo.company = lines[i].split('(')[0].trim(); // Remove parenthetical info
          break;
        }
      }
    }

    console.log('Parsed resume information:', parsedInfo);
    return parsedInfo;
  };

  useEffect(() => {
    console.log('Checking for resume data in URL...');
    const resumeData = searchParams.get('resume_data');
    if (resumeData) {
      try {
        console.log('Found resume data in URL:', resumeData);
        const decodedData = decodeURIComponent(resumeData);
        const parsedData = JSON.parse(decodedData);
        console.log('Parsed resume data:', parsedData);
        
        if (parsedData && parsedData.trim() !== "") {
          console.log('Extracted text found, parsing...');
          const parsedInfo = parseResumeText(parsedData);
          console.log('Parsed info:', parsedInfo);
          
          setFormData(prev => ({
            ...prev,
            name: parsedInfo.name || prev.name,
            email: parsedInfo.email || prev.email,
            phone: parsedInfo.phone || prev.phone,
            job_title: parsedInfo.job_title || prev.job_title,
            company: parsedInfo.company || prev.company,
            location: parsedInfo.location || prev.location,
            education: parsedInfo.education || prev.education,
            degree: parsedInfo.degree || prev.degree
          }));
        }
      } catch (error) {
        console.error("Error parsing resume data:", error);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission with formData
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Debug: Log form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ProfileHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-3">
          {/* Main Form Column - 3/4 width */}
          <div className="lg:col-span-3 space-y-6">
            <ProfileForm onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
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

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-600" />
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

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
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

              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/70 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </ProfileForm>
          </div>

          {/* Sidebar Column - 1/4 width */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}