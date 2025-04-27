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
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function EndorsementForm({ candidateId, stars }) {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    candidateName: '',
    professionalism: '',
    skills: '',
    communication: '',
    teamwork: '',
    reliability: '',
    review: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Candidate ID:', candidateId);
    console.log('Session:', session);
    console.log('Session Status:', status);

    const fetchCandidateName = async () => {
      if (!candidateId || !session?.accessToken) {
        console.log('Missing candidateId or accessToken:', { candidateId, accessToken: session?.accessToken });
        setError('Missing candidate ID or authentication');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';
        const response = await fetch(`${baseUrl}/api/resume/user-profile/${candidateId}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch candidate profile: ${response.status}`);
        }

        const profile = await response.json();
        setFormData((prev) => ({
          ...prev,
          candidateName: profile.contact_info?.name || 'Unknown',
        }));
      } catch (err) {
        console.error('Error fetching candidate name:', err);
        setError(`Failed to load candidate profile: ${err.message}`);
        toast.error(`Failed to load candidate profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId && session && status === 'authenticated') {
      fetchCandidateName();
    } else {
      setLoading(false);
      if (!candidateId) {
        setError('No candidate ID provided');
      } else if (status !== 'authenticated') {
        setError('User not authenticated');
      }
    }
  }, [candidateId, session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateId || !session?.accessToken) {
      toast.error('Missing candidate ID or authentication');
      setError('Missing candidate ID or authentication');
      return;
    }

    const payload = {
      professionalism: formData.professionalism || 'Average',
      skills: formData.skills || 'Average',
      communication: formData.communication || 'Average',
      teamwork: formData.teamwork || 'Average',
      reliability: formData.reliability || 'Average',
      stars: stars || 0,
      review: formData.review || '',
    };

    console.log('Submitting payload:', payload);

    // Validate payload
    const validRatings = ['Excellent', 'Good', 'Average', 'Below Average'];
    const invalidFields = Object.entries(payload).filter(
      ([key, value]) =>
        ['professionalism', 'skills', 'communication', 'teamwork', 'reliability'].includes(key) &&
        !validRatings.includes(value)
    );

    if (invalidFields.length > 0) {
      const errorMsg = `Invalid ratings: ${invalidFields.map(([key]) => key).join(', ')}`;
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (payload.stars < 0 || payload.stars > 5) {
      toast.error('Star rating must be between 0 and 5');
      setError('Star rating must be between 0 and 5');
      return;
    }

    setSubmitting(true);
    try {
      const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';
      const endpoint = `${baseUrl}/api/company/rate-candidate/${candidateId}/`;
      console.log('Submitting to endpoint:', endpoint);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.statusText || 'Unknown error'}` };
        }
        console.log('Error response:', errorData);
        throw new Error(`Failed to submit endorsement: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      toast.success('Endorsement submitted successfully');
      setFormData({
        ...formData,
        professionalism: '',
        skills: '',
        communication: '',
        teamwork: '',
        reliability: '',
        review: '',
      });
      setError(null);
    } catch (err) {
      console.error('Error submitting endorsement:', err);
      toast.error(err.message || 'Failed to submit endorsement');
      setError(err.message || 'Failed to submit endorsement');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingOptions = ['Excellent', 'Good', 'Average', 'Below Average'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 bg-white rounded-lg p-6 border border-gray-200"
    >
      <h1 className="text-3xl font-semibold text-blue-600 text-center mb-6">
        Endorse {formData.candidateName || 'Candidate'}
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
            {submitting ? 'Submitting...' : 'Submit Endorsement'}
          </Button>
        </form>
      )}
    </motion.div>
  );
}