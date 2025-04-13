// src/app/api/companies/job_listing.js
export const fetchCompanyJobs = async (companyId, accessToken) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    try {
      const response = await fetch(
        `https://umemployed-app-afec951f7ec7.herokuapp.com/api/company/company/${companyId}/jobs/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch jobs: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // Assuming data is an array of jobs [{ id, title, job_type, ... }]
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      throw error;
    }
  };