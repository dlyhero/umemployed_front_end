import { Edit, Mail, Phone, MapPin, Award } from 'lucide-react'
import Button from '../ui/Button'

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-brand to-brand-dark relative">
        <div className="absolute -bottom-16 left-6">
          <div className="relative group">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            />
            <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit className="w-4 h-4 text-brand" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="pt-20 px-6 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-brand font-medium">{user.title}</p>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-brand" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="w-5 h-5 mr-2 text-brand" />
                <span>{user.experience} years experience</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-brand" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-brand" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader