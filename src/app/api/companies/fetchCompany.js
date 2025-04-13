// src/app/api/companies/fetchCompany.js
const BASE_URL = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

export async function fetchCompany(companyId, token) {
  if (!token) {
    throw new Error('No authentication token provided');
  }

  try {
    const response = await fetch(`${BASE_URL}/api/company/company-details/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch company: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
}

export async function fetchJobs(companyId, token) {
  if (!token) {
    throw new Error('No authentication token provided');
  }

  try {
    const response = await fetch(`${BASE_URL}/api/company/company/${companyId}/jobs/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status}`);
    }

    const data = await response.json();
    // Slice to ensure only 2 jobs, in case API doesn't support limit
    return Array.isArray(data) ? data.slice(0, 2) : [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}