import Image from "next/image";
import React from "react";
// Format experience levels
export const experienceLevelsMap = {
    'under1Year': 'Under 1 year',
    '1to2Years': '1-2 years',
    '2to5Years': '2-5 years',
    '5to10Years': '5-10 years',
    'over10Years': '10+ years'
  };
  
  // Format job levels
  export const levelMap = {
    'Entry': 'Entry Level',
    'Mid': 'Mid Level',
    'Senior': 'Senior Level',
    'Lead': 'Lead',
    'Executive': 'Executive'
  };
  
  // Format shifts
  export const shiftMap = {
    'fourHourShift': '4-hour shift',
    'eightHourShift': '8-hour shift',
    'twelveHourShift': '12-hour shift',
    'flexibleShift': 'Flexible hours',
    'nightShift': 'Night shift'
  };
  
  // Format weekly ranges
  export const weeklyRangesMap = {
    'mondayToFriday': 'Monday to Friday',
    'weekends': 'Weekends',
    'flexibleDays': 'Flexible days',
    'rotational': 'Rotational schedule',
    'any5Days': 'Any 5 days/week'
  };
  

  
  export const cleanDescription = (html) => {
    if (!html || typeof html !== 'string') return '';
    
    // Create a temporary div to parse HTML
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    
    // Get text content and clean it
    let text = tmp.textContent || tmp.innerText || '';
    
    return text
      .replace(/<[^>]*>/g, ' ')          // Remove any remaining HTML tags
      .replace(/[*_\-]/g, ' ')           // Remove *, _, and -
      .replace(/&nbsp;/gi, ' ')          // Replace HTML non-breaking spaces
      .replace(/[ \t\r\n]+/g, ' ')       // Replace multiple spaces/tabs/newlines
      .replace(/^[ \t]+/g, '')           // Remove leading spaces
      .replace(/[* \t]+$/g, '')           // Remove trailing spaces
      .trim();
  };
  
  export const getInitials = (name) => {
    if (!name) return '?';
  
    const words = name.split(' ');
    let initials = words[0][0].toUpperCase();
  
    if (words.length > 1) {
      initials += words[words.length - 1][0].toUpperCase();
    }
  
    return initials;
  };

  export const CompanyLogo = ( company ) => {
    const initials = getInitials(company?.name);
    const colors = [
      'bg-blue-500 text-white',
      'bg-green-500 text-white',
      'bg-purple-500 text-white',
      'bg-red-500 text-white',
      'bg-yellow-500 text-white',
      'bg-indigo-500 text-white',
      'bg-pink-500 text-white',
      'bg-teal-500 text-white',
    ];
  
    const colorIndex = (company?.name?.charCodeAt(0) || 0) % colors.length;
    const colorClass = colors[colorIndex];
  
    if (company?.logo && company.logo !== 'https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg') {
      return (
        <Image
          src={company.logo}
          alt={`${company.name} Logo`}
          className="w-full h-full object-contain"
        />
      );
    }
  
    return (
      <div className={`w-full h-full rounded-lg flex items-center justify-center ${colorClass} font-bold text-2xl`}>
        {initials}
      </div>
    );
  };

  export const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


 export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 604800);
    if (interval >= 1) return `${interval} week${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;

    return 'Just now';
  };



  export const formatSalary = (salaryRange) => {
    if (!salaryRange || typeof salaryRange !== 'string') return 'N/A';

    if (salaryRange.includes('$')) {
      return salaryRange.split('/')[0];
    }

    if (!salaryRange.includes('-')) return salaryRange;

    const [minStr, maxStr] = salaryRange.split('-');
    const min = parseInt(minStr);
    const max = maxStr ? parseInt(maxStr) : null;

    if (isNaN(min)) return 'N/A';

    const format = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
      return value.toLocaleString();
    };

    return max && !isNaN(max) ? `${format(min)}-${format(max)}` : format(min);
  };
