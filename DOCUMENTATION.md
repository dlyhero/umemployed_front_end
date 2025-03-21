# UmEmployed Project Folder Structure

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
- **job/**: Components specific to job listings, such as .
- **company/**: Components for company-related sections, like .
- **recruiter/**: Recruiter-related UI components, such as .

## src/context/
This folder manages global state using React Context API:
- : Manages user authentication state.
- : Manages job filtering and saved job states.

## src/hooks/
Custom React hooks for managing logic across the app:
- : Handles authentication logic.
- : Manages job filtering functionality.

## src/services/
Handles API calls and data fetching:
- : Handles authentication API requests.
- : Fetches and manages job-related data.
- : Fetches and manages company-related data.

## src/styles/
Contains CSS files for styling:
- : Global styles applied throughout the app.
- : Specific styles for job-related pages.

## src/utils/
Utility functions and constants:
- : Utility function to format dates.
- : Stores reusable constants.

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
- : Stores environment variables.
- : Excludes sensitive files from version control.

## Global Brand Color
- Use  or  for styling elements with the primary color .

This documentation ensures a clear understanding of the project structure, making collaboration easier for developers.
