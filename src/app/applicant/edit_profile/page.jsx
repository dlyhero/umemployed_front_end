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

export default function EditProfile() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

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
                  required
                />
                <InputWithIcon 
                  icon={Mail}
                  label="Email"
                  type="email"
                  name="email"
                  required
                />
                <InputWithIcon 
                  icon={Phone}
                  label="Phone"
                  type="tel"
                  name="phone"
                />
                <InputWithIcon 
                  icon={Globe}
                  label="Country"
                  name="country"
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
                  options={jobTitles}
                  required
                />
                <InputWithIcon 
                  icon={Building}
                  label="Company"
                  name="company"
                />
                <InputWithIcon 
                  icon={MapPin}
                  label="Location"
                  name="location"
                />
                <InputWithIcon 
                  icon={Calendar}
                  label="Start Date"
                  type="date"
                  name="start_date"
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
                />
                <InputWithIcon 
                  icon={Award}
                  label="Degree"
                  name="degree"
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