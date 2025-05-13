import { Briefcase, User } from 'lucide-react';
import baseUrl from '../baseUrl';

export const ACCOUNT_TYPES = {
  JOB_SEEKER: {
    value: 'job_seeker',
    label: 'Job Seeker',
    description: 'Find and apply to your dream job',
    icon: User
  },
  RECRUITER: {
    value: 'recruiter',
    label: 'Recruiter',
    description: 'Hire the best talent for your team',
    icon: Briefcase
  }
};

export const selectAccountType = async (accountType, token) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    // Validate account type
    if (accountType !== 'recruiter' && accountType !== 'job_seeker') {
      throw new Error('Invalid account type specified');
    }

    // Remove any accidental whitespace
    const trimmedAccountType = accountType.trim();
    
    const response = await fetch(
      `${baseUrl}/users/choose-account-type/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ account_type: trimmedAccountType }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      let errorMessage = "Failed to select account type";
      if (response.status === 400) {
        errorMessage = errorData.message || 
                      errorData.account_type?.[0] || 
                      "Invalid request";
      } else if (response.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Validate response matches expected format
    if (!data.message || !data.state) {
      throw new Error('Server responded with unexpected format');
    }
    
    return data;
  } catch (error) {
    console.error('Error in selectAccountType:', error);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection.");
    }
    throw error;
  }
};