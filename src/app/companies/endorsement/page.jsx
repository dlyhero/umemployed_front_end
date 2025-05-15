'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChevronLeft,
  ThumbsUp,
  User,
  Briefcase,
  Star,
  MessageSquare,
  Mail,
  Linkedin,
  Globe,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";

const EndorsementsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('received');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    relationship: '',
    message: '',
    skills: []
  });

  // Mock data - replace with real data from your API
  const endorsements = {
    received: [
      {
        id: 1,
        sender: 'Alex Johnson',
        role: 'Senior Product Manager at TechCorp',
        avatar: '/avatars/alex.jpg',
        message: 'Jane has exceptional problem-solving skills and was instrumental in delivering our last project ahead of schedule. Her React expertise is top-notch!',
        skills: ['React', 'Project Management', 'Problem Solving'],
        date: '2023-11-15',
        connection: 'Worked together at TechCorp (2021-2023)'
      },
      {
        id: 2,
        sender: 'Sam Wilson',
        role: 'CTO at StartupX',
        avatar: '/avatars/sam.jpg',
        message: 'One of the most detail-oriented designers I\'ve worked with. Her UI/UX skills transformed our product experience.',
        skills: ['UI/UX Design', 'Figma', 'User Research'],
        date: '2023-09-28',
        connection: 'Colleagues at DesignHub'
      }
    ],
    given: [
      {
        id: 3,
        recipient: 'Michael Chen',
        role: 'Backend Engineer at DataSystems',
        avatar: '/avatars/michael.jpg',
        message: 'Michael\'s API design skills are exceptional. He consistently delivers clean, well-documented code under tight deadlines.',
        skills: ['Node.js', 'API Design', 'Database Architecture'],
        date: '2023-10-10',
        connection: 'Collaborated on 3 projects'
      }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit to your API here
    console.log('Form submitted:', formData);
    setShowForm(false);
    setFormData({
      recipient: '',
      relationship: '',
      message: '',
      skills: []
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Endorsements</h1>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <Button
            variant={activeTab === 'received' ? 'brand' : 'ghost'}
            className={`w-fit`}
            onClick={() => setActiveTab('received')}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Received ({endorsements.received.length})
          </Button>
          <Button
            variant={activeTab === 'given' ? 'brand' : 'ghost'}
            className={`w-fit`}
            onClick={() => setActiveTab('given')}
          >
            <User className="h-4 w-4 mr-2" />
            Given ({endorsements.given.length})
          </Button>
        </div>
        
        <Button onClick={() => setShowForm(true)} className={`bg-brand text-white hover:bg-brand/80 hover:text-white`}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Give Endorsement
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Write Endorsement</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Recipient</label>
                  <Input
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    placeholder="Name or email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Your Relationship</label>
                  <Input
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    placeholder="E.g. Worked together at CompanyX"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Skills to Endorse</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {skill}
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            skills: prev.skills.filter(s => s !== skill)
                          }))}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex">
                    <Input
                      placeholder="Add skill (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          e.preventDefault();
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, e.target.value]
                          }));
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe what you appreciate about this person's work..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" variant={`brand`} className={`w-fit`}>
                    Submit Endorsement
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {(activeTab === 'received' ? endorsements.received : endorsements.given).map((endorsement) => (
          <motion.div
            key={endorsement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {endorsement.avatar ? (
                    <img 
                      src={endorsement.avatar} 
                      alt={activeTab === 'received' ? endorsement.sender : endorsement.recipient}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {activeTab === 'received' ? endorsement.sender : endorsement.recipient}
                    </h3>
                    <p className="text-sm text-gray-600">{endorsement.role}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>5.0</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-gray-800">{endorsement.message}</p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {endorsement.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>{endorsement.connection}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(endorsement.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Thank
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="h-4 w-4 mr-2" />
                Share
              </Button>
              {activeTab === 'received' && (
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Endorse Back
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        
        {(activeTab === 'received' && endorsements.received.length === 0) && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ThumbsUp className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No endorsements yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              When colleagues endorse your skills, they'll appear here. Keep building your network!
            </p>
          </div>
        )}
        
        {(activeTab === 'given' && endorsements.given.length === 0) && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No endorsements given yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Recognize your colleagues' skills by writing them an endorsement.
            </p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              Give Your First Endorsement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndorsementsPage;