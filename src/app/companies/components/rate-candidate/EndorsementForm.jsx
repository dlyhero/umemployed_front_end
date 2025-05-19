
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StarRating from "./StarRating";

export default function EndorsementForm({ candidateId, stars }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    candidateName: "",
    professionalism: "",
    skills: "",
    communication: "",
    teamwork: "",
    reliability: "",
    review: "",
    stars: stars || 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Map descriptive ratings to numeric values
  const ratingMap = {
    Excellent: "5",
    Good: "4",
    Average: "3",
    "Below Average": "2",
  };

  useEffect(() => {
    const fetchCandidateName = async () => {
      if (!candidateId || !session?.accessToken) {
        setError("Missing candidate ID or authentication");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = "https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net";
        const response = await fetch(`${baseUrl}/api/resume/user-profile/${candidateId}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch candidate profile: ${response.status}`);
        }

        const profile = await response.json();
        setFormData((prev) => ({
          ...prev,
          candidateName: profile.contact_info?.name || "Unknown",
        }));
      } catch (err) {
        setError(`Failed to load candidate profile: ${err.message}`);
        toast.error(`Failed to load candidate profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId && session && status === "authenticated") {
      fetchCandidateName();
    } else {
      setLoading(false);
      if (!candidateId) {
        setError("No candidate ID provided");
      } else if (status !== "authenticated") {
        setError("User not authenticated");
      }
    }
  }, [candidateId, session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateId || !session?.accessToken) {
      toast.error("Missing candidate ID or authentication");
      setError("Missing candidate ID or authentication");
      return;
    }

    const payload = {
      professionalism: ratingMap[formData.professionalism] || "3",
      skills: ratingMap[formData.skills] || "3",
      communication: ratingMap[formData.communication] || "3",
      teamwork: ratingMap[formData.teamwork] || "3",
      reliability: ratingMap[formData.reliability] || "3",
      stars: formData.stars || 0,
      review: formData.review || "",
    };

    // Validate payload
    const numericFields = [
      "professionalism",
      "skills",
      "communication",
      "teamwork",
      "reliability",
    ];
    const invalidFields = numericFields.filter(
      (key) => !["5", "4", "3", "2"].includes(payload[key])
    );

    if (invalidFields.length > 0) {
      const errorMsg = `Invalid ratings: ${invalidFields.join(", ")}`;
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (payload.stars < 0 || payload.stars > 5) {
      toast.error("Star rating must be between 0 and 5");
      setError("Star rating must be between 0 and 5");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting endorsement..."); // Pre-submission toast
    try {
      const baseUrl = "https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net";
      const endpoint = `${baseUrl}/api/company/rate-candidate/${candidateId}/`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Server returned non-JSON response: ${response.status} ${response.statusText}`
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to submit endorsement: ${response.status} - ${errorData.message || "Unknown error"}`
        );
      }

      const responseData = await response.json();
      toast.dismiss(toastId); // Dismiss loading toast
      toast.success("Endorsement submitted successfully", { duration: 3000 });

      // Reset form data
      setFormData({
        candidateName: formData.candidateName,
        professionalism: "",
        skills: "",
        communication: "",
        teamwork: "",
        reliability: "",
        review: "",
        stars: 0,
      });
      setError(null);

      // Redirect to company dashboard after 2 seconds
      const companyId = session?.user?.company_id;
      if (companyId) {
        setTimeout(() => {
          router.push(`/companies/${companyId}/dashboard`);
        }, 2000);
      } else {
        toast.error("Company ID not found in session", { duration: 5000 });
      }
    } catch (err) {
      toast.dismiss(toastId); // Dismiss loading toast
      toast.error(err.message || "Failed to submit endorsement", { duration: 5000 });
      setError(err.message || "Failed to submit endorsement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, stars: newRating });
  };

  const ratingOptions = ["Excellent", "Good", "Average", "Below Average"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 bg-white rounded-lg p-6 border border-gray-200"
    >
      <h1 className="text-3xl font-semibold text-brand text-center mb-6">
        Endorse {formData.candidateName || "Candidate"}
      </h1>
      {loading ? (
        <div className="text-center">Loading candidate data...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="candidate-name" className="text-gray-700 font-medium">
              Candidate Name
            </Label>
            <Input
              id="candidate-name"
              value={formData.candidateName}
              readOnly
              className="mt-2 bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <Label className="text-gray-700 font-medium">Star Rating</Label>
            <StarRating
              rating={formData.stars}
              onRatingChange={handleRatingChange}
            />
          </div>
          <div>
            <Label htmlFor="professionalism" className="text-gray-700 font-medium">
              Professionalism
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, professionalism: value })
              }
              value={formData.professionalism}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="skills" className="text-gray-700 font-medium">
              Skills
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, skills: value })
              }
              value={formData.skills}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="communication" className="text-gray-700 font-medium">
              Communication
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, communication: value })
              }
              value={formData.communication}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="teamwork" className="text-gray-700 font-medium">
              Teamwork
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, teamwork: value })
              }
              value={formData.teamwork}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="reliability" className="text-gray-700 font-medium">
              Reliability
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, reliability: value })
              }
              value={formData.reliability}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="additional-comments"
              className="text-gray-700 font-medium"
            >
              Additional Comments
            </Label>
            <Textarea
              id="additional-comments"
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              placeholder="Write any additional comments about the candidate here..."
              className="mt-2 h-36"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-brand hover:bg-brand/90 text-white"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Endorsement"}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
