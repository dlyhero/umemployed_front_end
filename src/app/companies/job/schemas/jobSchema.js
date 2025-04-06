// /job/schemas/jobSchema.js
import { z } from 'zod';

// Full list of countries (ISO 3166-1 alpha-2 country names)
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon',
  'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia',
  'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
  'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
  'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
  'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

// List of salary ranges
const salaryRanges = [
  'Less than $30,000',
  '$30,000 - $50,000',
  '$50,000 - $70,000',
  '$70,000 - $90,000',
  '$90,000 - $120,000',
  '$120,000 - $150,000',
  '$150,000 - $200,000',
  'More than $200,000',
];

export const jobSchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(3, 'Title must be at least 3 characters long').max(100, 'Title must be less than 100 characters'),
  country: z.enum(countries, { required_error: 'Country is required' }), // Changed from location to country
  salary: z.enum(salaryRanges).optional(), // Optional salary range

  // Step 2: Requirements
  jobTypes: z.array(z.enum(['Full Time', 'Part Time', 'Internship', 'Contract'])).min(1, 'At least one job type is required'),
  experienceLevel: z.array(z.enum(['No Experience Needed', 'Under 1 Year', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'])).min(1, 'At least one experience level is required'),
  weeklyRange: z.array(z.enum(['Monday to Friday', 'Weekends needed', 'Every weekend', 'Rotating weekend', 'No weekend', 'Weekends only', 'Other', 'None'])).min(1, 'At least one weekly range is required'),
  shift: z.array(z.enum(['Morning shift', 'Day shift', 'Evening shift', 'Night shift', '8 hours shift', '10 hours shift', '12 hours shift', 'Other', 'None'])).min(1, 'At least one shift is required'),

  // Step 3: Description, Responsibilities, Benefits
  description: z.string().min(10, 'Description must be at least 10 characters long').max(5000, 'Description must be less than 5000 characters'),
  responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters long').max(5000, 'Responsibilities must be less than 5000 characters'),
  benefits: z.string().min(10, 'Benefits must be at least 10 characters long').max(5000, 'Benefits must be less than 5000 characters'),

  // Step 4: Skills
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});