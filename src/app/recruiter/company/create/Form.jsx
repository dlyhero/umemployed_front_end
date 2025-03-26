"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { countries } from "countries-list";

export default function CreateCompanyForm({ setLoading, setError, setSuccess }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    location: "",
    founded: "",
    website_url: "",
    country: "",
    contact_email: "",
    contact_phone: "",
    description: "",
    mission_statement: "",
    linkedin: "",
    video_introduction: "",
    job_openings: "",
  });

  const [logoFileName, setLogoFileName] = useState("No file chosen");
  const [coverPhotoFileName, setCoverPhotoFileName] = useState("No file chosen");
  const logoInputRef = useRef(null);
  const coverPhotoInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (type) => {
    if (type === "logo") {
      const file = logoInputRef.current.files[0];
      setLogoFileName(file ? file.name : "No file chosen");
    } else if (type === "cover_photo") {
      const file = coverPhotoInputRef.current.files[0];
      setCoverPhotoFileName(file ? file.name : "No file chosen");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "authenticated") {
      setError("You are not authenticated. Please log in.");
      router.push("/login?callbackUrl=/recruiter/company/create");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = session?.user?.accessToken || session?.accessToken;

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      router.push("/login?callbackUrl=/recruiter/company/create");
      return;
    }

    // Use FormData to handle file uploads
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSubmit.append(key, value);
    });

    // Append logo and cover photo if they exist
    if (logoInputRef.current?.files[0]) {
      formDataToSubmit.append("logo", logoInputRef.current.files[0]);
    }
    if (coverPhotoInputRef.current?.files[0]) {
      formDataToSubmit.append("cover_photo", coverPhotoInputRef.current.files[0]);
    }

    try {
      const response = await fetch(
        "https://umemployed-app-afec951f7ec7.herokuapp.com/api/company/create-company",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formDataToSubmit,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create company.");
      }

      setSuccess("Company created successfully!");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate country options using countries-list
  const countryOptions = Object.values(countries)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((country) => (
      <option key={country.name} value={country.name}>
        {country.name}
      </option>
    ));

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
      {/* Company Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Company Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          maxLength={100}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Industry</option>
          {/* Replace with actual enum values from your API */}
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Retail">Retail</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Construction">Construction</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Size */}
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Company Size
        </label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Size</option>
          {/* Replace with actual enum values from your API */}
          <option value="1-10">1-10</option>
          <option value="11-50">11-50</option>
          <option value="51-200">51-200</option>
          <option value="201-500">201-500</option>
          <option value="501-1000">501-1000</option>
          <option value="1001-5000">1001-5000</option>
          <option value="5001-10000">5001-10000</option>
          <option value="10001+">10001+</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          maxLength={100}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Founded */}
      <div>
        <label htmlFor="founded" className="block text-sm font-medium text-gray-700">
          Founded
        </label>
        <input
          type="number"
          id="founded"
          name="founded"
          value={formData.founded}
          onChange={handleInputChange}
          min={-2147483648}
          max={2147483647}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Website URL */}
      <div>
        <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <input
          type="url"
          id="website_url"
          name="website_url"
          value={formData.website_url}
          onChange={handleInputChange}
          maxLength={200}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Country</option>
          {countryOptions}
        </select>
      </div>

      {/* Contact Email */}
      <div>
        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
          Contact Email
        </label>
        <input
          type="email"
          id="contact_email"
          name="contact_email"
          value={formData.contact_email}
          onChange={handleInputChange}
          maxLength={254}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Contact Phone */}
      <div>
        <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
          Contact Phone
        </label>
        <input
          type="tel"
          id="contact_phone"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleInputChange}
          maxLength={20}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          rows={4}
        />
      </div>

      {/* Mission Statement */}
      <div>
        <label htmlFor="mission_statement" className="block text-sm font-medium text-gray-700">
          Mission Statement
        </label>
        <textarea
          id="mission_statement"
          name="mission_statement"
          value={formData.mission_statement}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          rows={4}
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
          LinkedIn
        </label>
        <input
          type="url"
          id="linkedin"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleInputChange}
          maxLength={200}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Video Introduction */}
      <div>
        <label htmlFor="video_introduction" className="block text-sm font-medium text-gray-700">
          Video Introduction
        </label>
        <input
          type="url"
          id="video_introduction"
          name="video_introduction"
          value={formData.video_introduction}
          onChange={handleInputChange}
          maxLength={200}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Job Openings */}
      <div>
        <label htmlFor="job_openings" className="block text-sm font-medium text-gray-700">
          Job Openings
        </label>
        <textarea
          id="job_openings"
          name="job_openings"
          value={formData.job_openings}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          rows={4}
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
          Company Logo
        </label>
        <input
          type="file"
          id="logo"
          name="logo"
          ref={logoInputRef}
          onChange={() => handleFileChange("logo")}
          accept="image/*"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        <span className="text-sm text-gray-500">{logoFileName}</span>
      </div>

      {/* Cover Photo Upload */}
      <div>
        <label htmlFor="cover_photo" className="block text-sm font-medium text-gray-700">
          Cover Photo
        </label>
        <input
          type="file"
          id="cover_photo"
          name="cover_photo"
          ref={coverPhotoInputRef}
          onChange={() => handleFileChange("cover_photo")}
          accept="image/*"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        <span className="text-sm text-gray-500">{coverPhotoFileName}</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        Create Company
      </button>
    </form>
  );
}