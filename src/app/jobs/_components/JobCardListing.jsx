'use client';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CompanyLogo, formatSalary } from '@/src/utils/jobFormater';

const JobCardListing = ({ job, onToggleSave }) => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleSave?.(job.id);
    };

    const handleViewJob = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/jobs/${job.id}`);
    };

    return (
        <div className="job-list-one style-two relative border border-gray-200 rounded-lg mb-5 p-4 ">
            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                {/* Left Column - Job Title */}
                <div className="w-full md:w-5/12 mb-4 md:mb-0">
                    <div className="flex items-center gap-4">
                        <a
                            className="logo flex-shrink-0 cursor-pointer"
                            onClick={handleViewJob}
                        >
                            <div className="w-15 h-15 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                {/* Replace with your actual logo component */}
                                {CompanyLogo(job.company)}
                            </div>
                        </a>
                        <div>
                            <a
                                className={`job-duration block mb-1 cursor-pointer font-bold ${job?.job_location_type === 'remote'
                                    ? 'text-green-600'
                                    : job?.job_location_type === 'hybrid'
                                        ? 'text-yellow-600'
                                        : job?.job_location_type === 'onsite'
                                            ? 'text-brand'
                                            : job?.job_location_type === 'freelance'
                                                ? 'text-purple-600'
                                                : job?.job_location_type === 'internship'
                                                    ? 'text-blue-400'
                                                    : 'text-gray-600'
                                    }`}
                                onClick={handleViewJob}
                            >
                                {job?.job_location_type.charAt(0).toUpperCase() + job?.job_location_type.slice(1).toLowerCase()
                                }
                            </a>
                            <a
                                className="title block text-nowrap truncate sm:max-w-[60px]  md:max-w-[195px]  lg:-w-[250px] text-lg font-medium text-gray-900 hover:text-brand transition-colors cursor-pointer"
                                onClick={handleViewJob}
                            >
                                {job.title}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Middle Column - Location & Salary */}
                <div className="w-full md:w-4/12 mb-4 md:mb-0">
                    <div className="job-location mb-2">
                        <a
                            className="text-gray-600 hover:text-brand transition-colors cursor-pointer"
                            onClick={handleViewJob}
                        >
                            {job.company?.location || 'Remote'}, {job.company?.country_name}
                        </a>
                    </div>
                    <div className="job-salary">
                        <span className="font-medium text-gray-900">
                            ${formatSalary(job.salary_range || job.formattedSalary)}
                        </span>
                        <span className="text-gray-600"> / Monthly · {job.experience_level || 'Fresher'}</span>
                    </div>
                </div>

                {/* Right Column - Action Buttons */}
                <div className="w-full md:w-3/12 flex items-center justify-end">
                    {session && (
                        <div className="flex items-center justify-start md:justify-end  w-full">
                            <button
                                className={`save-btn p-3 rounded-full hover:bg-gray-100 transition-colors mr-3 border rounded-full cursor-pointer ${job.is_saved ? 'text-brand' : 'text-gray-400'
                                    }`}
                                title={job.is_saved ? 'Unsave Job' : 'Save Job'}
                                onClick={handleSave}
                            >
                                <Bookmark className={`w-5 h-5 ${job.is_saved ? 'fill-current' : ''}`} />
                            </button>

                            {session && (
                                <button
                                    disabled={job.is_applied}
                                    className={`apply-btn text-center tran3s ${job.is_applied ? "" : "bg-brand hover:bg-brand/90 text-white transition-all duration-300"} px-4 py-2 rounded-full text-sm font-medium    cursor-pointer`}
                                    onClick={handleViewJob}
                                >
                                    {job.is_applied ? 'Applied' : 'Apply'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobCardListing;