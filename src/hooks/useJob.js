import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import baseUrl from '../app/api/baseUrl';
import { useSession } from 'next-auth/react';

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

  try {
    const parts = range.split('-');
    if (parts.length < 2) return 'Not specified';

    const min = parseInt(parts[0]) || 0;
    const max = parseInt(parts[1]) || 0;

    if (min === 0 && max === 0) return 'Not specified';

    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  } catch (error) {
    return 'Not specified';
  }
};

const formatLocationType = (type) => {
  const typeMap = {
    'remote': 'Remote',
    'onSite': 'On-site',
    'hybrid': 'Hybrid'
  };
  return typeMap[type] || type;
};

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

  const getAuthApi = useCallback(() => {
    return axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      }
    });
  }, [session?.accessToken]);

  const getPublicApi = useCallback(() => {
    return axios.create({
      baseURL: baseUrl
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const publicApi = getPublicApi();
      const jobsResponse = await publicApi.get('/job/jobs/');

      const formattedJobs = jobsResponse.data.map(job => {
        const salaryRange = job.salary_range || '';
        const description = job.description ? job.description.replace(/<[^>]*>/g, '') : '';
        const createdAt = job.created_at ? new Date(job.created_at).toLocaleDateString() : '';

        return {
          ...job,
          formattedType: formatJobType(job.job_type),
          formattedExperience: formatExperienceLevel(job.experience_level),
          formattedSalary: formatSalaryRange(salaryRange),
          formattedLocationType: formatLocationType(job.job_location_type),
          postedDate: createdAt,
          description: description,
          is_saved: false, // Initialize as false
          is_applied: false // Initialize as false
        };
      });

      setAllJobs(formattedJobs);
      setFilteredJobs(formattedJobs);

      if (session?.accessToken) {
        const authApi = getAuthApi();
        const [savedResponse, appliedResponse] = await Promise.all([
          authApi.get('/job/saved-jobs/'),
          authApi.get('/job/applied-jobs/')
        ]);

        const savedJobIds = savedResponse.data.map(job => job.id);
        const appliedJobIds = appliedResponse.data.map(job => job.id);

        setSavedJobs(savedJobIds);
        setAppliedJobs(appliedJobIds);

        // Update jobs with saved/applied status
        setAllJobs(prev => prev.map(job => ({
          ...job,
          is_saved: savedJobIds.includes(job.id),
          is_applied: appliedJobIds.includes(job.id)
        })));

        setFilteredJobs(prev => prev.map(job => ({
          ...job,
          is_saved: savedJobIds.includes(job.id),
          is_applied: appliedJobIds.includes(job.id)
        })));
      }

      // Generate filter options
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
          value: '0-50000',
          label: 'Under $50K',
          count: formattedJobs.filter(job => {
            const salary = job.salary_range ? parseInt(job.salary_range.split('-')[0]) || 0 : 0;
            return salary < 50000;
          }).length
        },
        // ... other salary ranges
      ];

      setFilterOptions({
        employment_types: employmentTypes,
        experience_levels: experienceLevels,
        locations: locations,
        salary_ranges: salaryRanges
      });

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [session, getAuthApi, getPublicApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSaveJob = async (jobId) => {
    try {
      if (!session?.accessToken) {
        toast.error('Please login to save jobs');
        return;
      }

      const api = getAuthApi();
      const jobToUpdate = allJobs.find(job => job.id === jobId);
      const isCurrentlySaved = jobToUpdate?.is_saved;

      // Optimistic update
      setAllJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
      ));
      setFilteredJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
      ));
      setSavedJobs(prev => 
        isCurrentlySaved 
          ? prev.filter(id => id !== jobId) 
          : [...prev, jobId]
      );

      // API call
      if (isCurrentlySaved) {
        await api.delete(`/job/jobs/${jobId}/save/`);
        toast.success('Job unsaved successfully');
      } else {
        await api.post(`/job/jobs/${jobId}/save/`);
        toast.success('Job saved successfully');
      }

      // Refresh data to ensure sync with server
      await fetchData();
    } catch (err) {
      // Revert optimistic update
      setAllJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_saved: job.is_saved } : job
      ));
      setFilteredJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_saved: job.is_saved } : job
      ));
      setSavedJobs(prev => 
        allJobs.find(job => job.id === jobId)?.is_saved 
          ? [...prev, jobId] 
          : prev.filter(id => id !== jobId)
      );
      toast.error(err.response?.data?.message || 'Failed to update saved status');
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
    toggleSaveJob,
    applyFilters,
    resetFilters,
    fetchData
  };
};