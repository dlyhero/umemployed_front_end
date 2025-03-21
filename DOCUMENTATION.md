
## Overview
This is the folder structure for the UmEmployed job portal platform. Below is a breakdown of each directory and its purpose.

## src/app/
This folder contains the main pages of the application, structured as follows:
- **dashboard/**: Job seeker dashboard with subpages for profile editing, resume upload, saved jobs, applications, and career resources.
- **companies/**: Company listing, detailed pages, and company creation pages.
- **jobs/**: Job listings, job details, assessments, and application pages.
- **recruiter/**: Recruiter-specific pages, including onboarding, company/job creation, candidate management, and endorsements.

## src/components/
This folder contains reusable UI components for different sections of the platform:
- **common/**: Shared components like headers, footers, search bars, and buttons.
- **job/**: Components specific to job listings, such as `JobCard.jsx`.
- **company/**: Components for company-related sections, like `CompanyCard.jsx`.
- **recruiter/**: Recruiter-related UI components, such as `CandidateCard.jsx`.

## src/context/
This folder manages global state using React Context API:
- `AuthContext.jsx`: Manages user authentication state.
- `JobContext.jsx`: Manages job filtering and saved job states.

## src/hooks/
Custom React hooks for managing logic across the app:
- `useAuth.js`: Handles authentication logic.
- `useJobFilter.js`: Manages job filtering functionality.

## src/services/
Handles API calls and data fetching:
- `authService.js`: Handles authentication API requests.
- `jobService.js`: Fetches and manages job-related data.
- `companyService.js`: Fetches and manages company-related data.

## src/styles/
Contains CSS files for styling:
- `globals.css`: Global styles applied throughout the app.
- `job.module.css`: Specific styles for job-related pages.

## src/utils/
Utility functions and constants:
- `formatDate.js`: Utility function to format dates.
- `constants.js`: Stores reusable constants.

## src/app/api/
Backend API routes for handling requests:
- **auth/**: Handles authentication (login, register).
- **jobs/**: Handles job-related API requests.
- **companies/**: Handles company-related API requests.

## public/
Contains static assets such as images, icons, and logos.
- **images/**: Stores general images used across the application.
- **icons/**: Stores icon assets.
- **logos/**: Stores branding logos.

## Environment Configuration
- `.env.local`: Stores environment variables.
- `.gitignore`: Excludes sensitive files from version control.

## Global Brand Color
- Use `bg-brand` or `text-brand` for styling elements with the primary color `#1e90ff`.

This documentation ensures a clear understanding of the project structure, making collaboration easier for developers." > DOCUMENTATION.md
