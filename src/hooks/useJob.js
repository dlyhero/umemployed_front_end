// hooks/useJobs.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import baseUrl from '../app/api/baseUrl';
import { useSession } from 'next-auth/react';

export const useJobs = () => {
  const { data: session } = useSession();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    employment_types: [],
    experience_levels: [],
    locations: [],
    salary_ranges: []
  });

  // Formatting functions
  const formatJobType = (type) => {
    const typeMap = {
      'fullTime': 'Full-time',
      'partTime': 'Part-time',
      'contract': 'Contract',
      'temporary': 'Temporary',
      'internship': 'Internship',
      'freelance': 'Freelance'
    };
    return typeMap[type] || type;
  };

  const formatExperienceLevel = (level) => {
    const levelMap = {
      'noExperience': 'No experience',
      '1-3Years': '1-3 years',
      '3-5Years': '3-5 years',
      '5PlusYears': '5+ years'
    };
    return levelMap[level] || level;
  };

  const formatSalaryRange = (range) => {
    if (!range) return 'Not specified';
    const [min, max] = range.split('-').map(Number);
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatLocationType = (type) => {
    const typeMap = {
      'remote': 'Remote',
      'onSite': 'On-site',
      'hybrid': 'Hybrid'
    };
    return typeMap[type] || type;
  };

  const fetchJobs = useCallback( async () => {
    try {
     const api = axios.create({
       baseURL: baseUrl,
       headers: {
       }
     });
 
     const jobsResponse = await api.get('/job/jobs/');
     const formattedJobs = jobsResponse.data.map(job => ({
       ...job,
       formattedType: formatJobType(job.job_type),
       formattedExperience: formatExperienceLevel(job.experience_level),
       formattedSalary: formatSalaryRange(job.salary_range),
       formattedLocationType: formatLocationType(job.job_location_type),
       postedDate: new Date(job.created_at).toLocaleDateString(),
       description: job.description.replace(/<[^>]*>/g, '')
     }));
 
 
     setAllJobs(formattedJobs);
     setFilteredJobs(formattedJobs);
 
       const employmentTypes = [...new Set(formattedJobs.map(job => job.job_location_type))]
         .filter(Boolean)
         .map(type => ({
           value: type,
           label: formatLocationType(type),
           count: formattedJobs.filter(job => job.job_location_type === type).length
         }));
 
       const experienceLevels = [...new Set(formattedJobs.map(job => job.experience_level))]
         .filter(Boolean)
         .map(level => ({
           value: level,
           label: formatExperienceLevel(level),
           count: formattedJobs.filter(job => job.experience_level === level).length
         }));
 
       const locations = [...new Set(formattedJobs.map(job => job.location))]
         .filter(Boolean)
         .map(location => ({
           value: location,
           label: location,
           count: formattedJobs.filter(job => job.location === location).length
         }));
 
       const salaryRanges = [
         {
           value: '0-50000', label: 'Under $50K', count: formattedJobs.filter(job => {
             const salary = parseInt(job.salary_range?.split('-')[0]) || 0;
             return salary < 50000;
           }).length
         },
         {
           value: '50000-100000', label: '$50K - $100K', count: formattedJobs.filter(job => {
             const salary = parseInt(job.salary_range?.split('-')[0]) || 0;
             return salary >= 50000 && salary < 100000;
           }).length
         },
         {
           value: '100000-150000', label: '$100K - $150K', count: formattedJobs.filter(job => {
             const salary = parseInt(job.salary_range?.split('-')[0]) || 0;
             return salary >= 100000 && salary < 150000;
           }).length
         },
         {
           value: '150000-200000', label: '$150K - $200K', count: formattedJobs.filter(job => {
             const salary = parseInt(job.salary_range?.split('-')[0]) || 0;
             return salary >= 150000 && salary < 200000;
           }).length
         },
         {
           value: '200000-', label: 'Over $200K', count: formattedJobs.filter(job => {
             const salary = parseInt(job.salary_range?.split('-')[0]) || 0;
             return salary >= 200000;
           }).length
         }
       ];
 
       setFilterOptions({
         employment_types: employmentTypes,
         experience_levels: experienceLevels,
         locations: locations,
         salary_ranges: salaryRanges
       });
 
    }  catch (err) {
     setError(err.response?.data?.message || err.message);
     toast.error('Failed to load jobs data');
   } finally {
     setLoading(false);
   }
   }, [])

  const fetchData = useCallback(
    async () => {

      try {
        setLoading(true);
        const api = axios.create({
          baseURL: baseUrl,
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          }
        });
  
        const jobsResponse = await api.get('/job/jobs/');
        const formattedJobs = jobsResponse.data.map(job => ({
          ...job,
          formattedType: formatJobType(job.job_type),
          formattedExperience: formatExperienceLevel(job.experience_level),
          formattedSalary: formatSalaryRange(job.salary_range),
          formattedLocationType: formatLocationType(job.job_location_type),
          postedDate: new Date(job.created_at).toLocaleDateString(),
          description: job.description.replace(/<[^>]*>/g, '')
        }));
  
  
        setAllJobs(formattedJobs);
        setFilteredJobs(formattedJobs);
  
        const savedResponse = await api.get('/job/saved-jobs/');
        setSavedJobs(savedResponse.data.map(job => job.id));
  
        const appliedResponse = await api.get('/job/applied-jobs/');
        setAppliedJobs(appliedResponse.data.map(job => job.id));
  
        
  
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error('Failed to load jobs data');
      } finally {
        setLoading(false);
      }
    }, [session?.accessToken]
  )

  useEffect(() => {
    if (session) fetchData();
    else fetchJobs();
  }, [session, fetchData, fetchJobs]);

  const toggleSaveJob = async (jobId) => {
    try {
      const api = axios.create({
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      });

      const isAlreadySaved = savedJobs.includes(jobId);

      // Optimistic update
      setSavedJobs(prev =>
        isAlreadySaved
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId]
      );

      // Update allJobs state
      setAllJobs(prev =>
        prev.map(job =>
          job.id === jobId
            ? { ...job, is_saved: !isAlreadySaved }
            : job
        )
      );

      // Update filteredJobs state
      setFilteredJobs(prev =>
        prev.map(job =>
          job.id === jobId
            ? { ...job, is_saved: !isAlreadySaved }
            : job
        )
      );

      // Make API call
      await api.post(`/job/jobs/${jobId}/save/`);

      toast.success(
        isAlreadySaved ? 'Job unsaved successfully' : 'Job saved successfully'
      );
    } catch (err) {
      // Revert on error
      setSavedJobs(prev =>
        savedJobs.includes(jobId)
          ? [...prev, jobId]
          : prev.filter(id => id !== jobId)
      );

      setAllJobs(prev =>
        prev.map(job =>
          job.id === jobId
            ? { ...job, is_saved: savedJobs.includes(jobId) }
            : job
        )
      );

      setFilteredJobs(prev =>
        prev.map(job =>
          job.id === jobId
            ? { ...job, is_saved: savedJobs.includes(jobId) }
            : job
        )
      );

      toast.error(err.response?.data?.message || 'Please check your internet');
    }
  };

  const applyFilters = (filters) => {
    let filtered = [...allJobs];

    if (filters.employment_types?.length > 0) {
      filtered = filtered.filter(job =>
        filters.employment_types.includes(job.job_location_type)
      );
    }

    if (filters.experience_levels?.length > 0) {
      filtered = filtered.filter(job =>
        filters.experience_levels.includes(job.experience_level)
      );
    }

    if (filters.locations?.length > 0) {
      filtered = filtered.filter(job =>
        filters.locations.includes(job.location)
      );
    }

    if (filters.salary_ranges?.length > 0) {
      filtered = filtered.filter(job => {
        if (!job.salary_range) return false;
        const minSalary = parseInt(job.salary_range.split('-')[0]);

        return filters.salary_ranges.some(range => {
          const [min, max] = range.split('-').map(Number);
          if (range.endsWith('-')) return minSalary >= min;
          return minSalary >= min && (!max || minSalary < max);
        });
      });
    }

    setFilteredJobs(filtered);
    toast.success('Filters applied successfully');
  };

  const resetFilters = () => {
    setFilteredJobs(allJobs);
    toast.success('Filters reset');
  };

  return {
    allJobs,
    filteredJobs,
    savedJobs,
    appliedJobs,
    loading,
    error,
    filterOptions,
    applyFilters,
    resetFilters,
    toggleSaveJob,
    fetchData, 
    fetchJobs
  };
};