import { Briefcase, User } from 'lucide-react';

export const ACCOUNT_TYPES = {
  APPLICANT: {
    value: 'applicant',
    label: 'Job Seeker',
    description: 'Find and apply to your dream job',
    icon: User,
    redirectPath: '/upload'
  },
  RECRUITER: {
    value: 'recruiter',
    label: 'Recruiter',
    description: 'Hire the best talent for your team',
    icon: Briefcase,
    redirectPath: '/recruiter/company/create'
  }
};

export const selectAccountType = async (accountType, token) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/choose-account-type/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ account_type: accountType }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
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

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection.");
    }
    throw error;
  }
};