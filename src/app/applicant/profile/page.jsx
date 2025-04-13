'use client'
import { useState } from 'react'
import { 
  BarChart2, Bookmark, Briefcase, ChevronRight, 
  LayoutDashboard, Settings, User, FileText, 
  ClipboardList, Laptop, Info, GraduationCap,
  Clock, TrendingUp, DollarSign, Plus, Edit,
  Mail,
  Phone,
  Globe,
  MoreVertical,
  Icon
} from 'lucide-react'
import Link from 'next/link'

// ======================
// Job Card Component
// ======================
const JobCard = ({ job }) => (
  <Link href={`/job/details/${job.id}/`} className="block p-4 bg-gray-50 rounded-lg flex flex-col items-start hover:bg-gray-100 transition group">
    <div className="flex items-center mb-2">
      <div className="w-12 h-12 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-4">
        <Laptop className="text-xl" />
      </div>
      <div className="flex flex-col">
        <span className="text-gray-800 font-semibold text-sm truncate">{job.title}</span>
        <span className="text-gray-600 text-xs truncate">{job.company}</span>
      </div>
    </div>
    <button className="text-gray-600 text-xs font-semibold hover:text-gray-800 flex items-center ml-16 mt-2 group-hover:text-brand">
      <Info className="text-base mr-1" /> View More
    </button>
  </Link>
)

// ======================
// Top Jobs Section
// ======================
const TopJobsSection = () => {
  const jobs = [
    { id: 1664, title: "PHP Developers", company: "Food MCDO" },
    { id: 1402, title: "Test", company: "UmEmployed" },
    { id: 1401, title: "Software Engineer", company: "UmEmployed" },
    { id: 1400, title: "Software Engineer", company: "UmEmployed" },
    { id: 1367, title: "Test", company: "UmEmployed" }
  ]

  return (
    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Jobs</h3>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={job.id}>
            <JobCard job={job} />
            {index !== jobs.length - 1 && <hr className="border-t border-gray-200 my-2" />}
          </div>
        ))}
      </div>
    </section>
  )
}

// ======================
// Descriptive Image Section
// ======================
const DescriptiveImageSection = () => (
  <section className="relative bg-gray-200 rounded-lg overflow-hidden h-64 mb-6">
    <Link href="/jobs/" className="block h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center text-center text-white p-4">
        <p className="text-xl font-bold">See who's hiring on UmEmployed</p>
      </div>
    </Link>
  </section>
)

// ======================
// Profile Header
// ======================
const ProfileHeader = () => (
  <div className="profile-header mb-6 flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4">
    <div className="relative">
      <img 
        className="w-32 h-32 rounded-full border-4 border-white shadow-md" 
        src="https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg" 
        alt="profile-pic"
      />
      <button className="absolute bottom-0 right-0 bg-brand text-white rounded-full p-2 text-xs shadow-lg hover:bg-brand-dark transition-colors">
        <Edit className="w-4 h-4" />
      </button>
    </div>
    <div className="text-center md:text-left">
      <h1 className="font-bold text-2xl text-gray-900 mb-1">
        <span className="uppercase">Enu</span>
      </h1>
      <div className="text-gray-500 font-semibold text-sm">Tester</div>
    </div>
  </div>
)

// ======================
// Profile Info
// ======================
const ProfileInfo = () => (
  <div className="profile-info text-gray-700 space-y-2 mb-6">
    <div className="flex items-center">
      <Mail className="text-brand mr-2 w-5 h-5" />
      <span>clintonenu18@gmail.com</span>
    </div>
    <div className="flex items-center">
      <Phone className="text-brand mr-2 w-5 h-5" />
      <span>653300022</span>
    </div>
    <div className="flex items-center">
      <Globe className="text-brand mr-2 w-5 h-5" />
      <span>Cameroon</span>
    </div>
  </div>
)

// ======================
// CV Section
// ======================
const CVSection = () => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <section className="bg-white p-4 rounded-lg my-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FileText className="text-brand" size={40} />
          <div>
            <div className="font-bold text-lg">My Cv.pdf</div>
            <div className="text-gray-500 text-sm">Added today</div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Download className="w-4 h-4 mr-2 text-red-500" /> Download
                </Link>
                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Share2 className="w-4 h-4 mr-2 text-green-500" /> Share
                </Link>
                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Eye className="w-4 h-4 mr-2 text-blue-500" /> View
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ======================
// Job Selection Section
// ======================
const JobSelectionSection = () => {
  const jobs = [
    { id: 1, title: "Engineering" },
    { id: 2, title: "Finance" },
    { id: 4, title: "Designer" },
    // ... other job options
  ]

  return (
    <section className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="font-bold text-xl text-brand">Select Job</h2>
      </div>
      
      <form className="space-y-4">
        <div className="w-full">
          <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1">Job</label>
          <select 
            id="job" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
          >
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <button 
            type="submit" 
            className="bg-brand hover:bg-brand-dark text-white font-bold px-6 py-2 rounded-full shadow-md transition"
          >
            Save
          </button>
        </div>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg font-bold">
        <p>Current role set to: Tester</p>
      </div>
    </section>
  )
}

// ======================
// Skills Section
// ======================
const SkillsSection = () => {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <section className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl text-brand">Skills</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="text-brand hover:text-brand-dark"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
      
      {/* Skills list would go here */}
      
      {/* Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="font-bold text-lg">Add skill</h3>
              <button onClick={() => setShowModal(false)} className="text-2xl">×</button>
            </div>
            
            <div className="p-4">
              <label htmlFor="input-skill" className="block font-medium mb-2">Skill</label>
              <input 
                type="text" 
                id="input-skill" 
                placeholder="Skill (ex: Reactjs)" 
                className="border w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <div id="feedback-message" className="text-red-500 mt-2 hidden">Skill already exists</div>
            </div>

            <div className="p-4 border rounded-lg mb-4 bg-gray-50">
              <p className="mb-3 font-bold">Suggested skills</p>
              <div className="flex flex-wrap gap-2">
                {/* Suggested skills would go here */}
              </div>
            </div>

            <div className="p-4 flex justify-end border-t">
              <button 
                className="bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2 rounded-full"
                onClick={() => setShowModal(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ======================
// Analytics Card
// ======================
const AnalyticsCard = ({ title, value, description, ic}) => {
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center mr-3">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <span className="text-sm text-gray-600">{description}</span>
    </div>
  )
}

// ======================
// Resource Card
// ======================
const ResourceCard = ({ title, description, icon }) => {
  const IconComponent = icon
  
  return (
    <Link href="#" className="block p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-300 group">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center mr-4">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm font-medium group-hover:text-brand">{title}</span>
          <span className="text-gray-600 text-xs">{description}</span>
        </div>
      </div>
    </Link>
  )
}

// ======================
// Feature Card
// ======================
const FeatureCard = ({ title, description, icon }) => {
  const IconComponent = icon
  
  return (
    <Link href="#" className="block p-4 bg-gray-50 rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:bg-gray-100 group">
      <div className="flex items-start">
        <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center mr-4">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm font-medium group-hover:text-brand">{title}</span>
          <span className="text-gray-600 text-xs">{description}</span>
        </div>
      </div>
    </Link>
  )
}

// ======================
// Main Dashboard Layout
// ======================
export default function DashboardLayout() {
  return (
    <main className="flex flex-col lg:flex-row mx-auto container max-w-7xl px-4 md:mt-4 gap-6 bg-white md:bg-transparent">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-1/4 space-y-6 order-3 lg:order-1">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <TopJobsSection />
          <DescriptiveImageSection />
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2 text-gray-800">
            Recommended for You
          </h2>
          
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Job Features</h3>
            <div className="space-y-4">
              <FeatureCard 
                icon={Clock}
                title="Flexible Work Hours"
                description="Enjoy flexible work hours that fit your lifestyle."
              />
              <FeatureCard 
                icon={TrendingUp}
                title="Career Development"
                description="Access to professional training and career development resources."
              />
              <FeatureCard 
                icon={DollarSign}
                title="Competitive Salary"
                description="Earn a competitive salary with benefits and bonuses."
              />
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggested Jobs</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-800 text-sm">No similar jobs found.</p>
              <p className="text-gray-600 text-xs mt-2">
                You can upload your resume <Link href="/resume/upload/" className="text-brand underline">here</Link>.
              </p>
            </div>
          </section>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="w-full lg:w-2/4 space-y-6 order-2">
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <ProfileHeader />
          <ProfileInfo />
          <div className="flex justify-end">
            <Link 
              href="/resume/update-resume/" 
              className="text-brand border border-brand px-6 py-2 rounded-full shadow-md hover:bg-brand hover:text-white transition"
            >
              Edit Profile
            </Link>
          </div>
        </section>
        
        <CVSection />
        <JobSelectionSection />
        <SkillsSection />
        
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2 text-brand">
            Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnalyticsCard 
              icon={User}
              title="Profile Views"
              value="1,200"
              description="Last 30 days"
            />
            <AnalyticsCard 
              icon={Briefcase}
              title="Job Apps"
              value="350"
              description="Last 30 days"
            />
            <AnalyticsCard 
              icon={Bookmark}
              title="Endorsements"
              value="85"
              description="Total endorsements"
            />
          </div>
        </section>
        
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2 text-brand">
            Resources
          </h2>
          <div className="space-y-4">
            <ResourceCard 
              icon={Bookmark}
              title="Career Development Guide"
              description="A comprehensive guide to advance your career."
            />
            <ResourceCard 
              icon={GraduationCap}
              title="Online Courses"
              description="Access top-rated online courses to upskill yourself."
            />
            <ResourceCard 
              icon={Link}
              title="Useful Job Boards"
              description="Explore the best job boards for your industry."
            />
          </div>
        </section>
      </div>
      
      {/* Right Sidebar */}
      <aside className="w-full lg:w-1/4 space-y-6 order-1 lg:order-3">
        {/* Additional sidebar content can go here */}
      </aside>
    </main>
  )
}