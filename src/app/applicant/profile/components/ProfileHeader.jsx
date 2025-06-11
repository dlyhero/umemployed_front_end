'use client';

import { UserCircle, Edit, MessageSquare, Share2, Camera, X, Phone, Mail, Cake, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditModal } from './EditModal';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import useUser from '@/src/hooks/useUser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';

export const ProfileHeader = ({ initialUser, isOwner }) => {
  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const { data: session } = useSession();
  const { user: currentUser, mutate: mutateUser } = useUser();
  const [user, setUser] = useState(initialUser);
  const [jobTitles, setJobTitles] = useState([]);
  const [loadingJobTitles, setLoadingJobTitles] = useState(false);
  
  // Sync with parent if initialUser changes
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Fetch job titles on mount
  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        setLoadingJobTitles(true);
        const response = await axios.get(`${baseUrl}/resume/skill-categories/`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          }
        });
        setJobTitles(response.data);
      } catch (error) {
        console.error('Error fetching job titles:', error);
        toast.error('Failed to load job titles');
      } finally {
        setLoadingJobTitles(false);
      }
    };

    fetchJobTitles();
  }, [session?.accessToken]);

  const [editOpen, setEditOpen] = useState(false);
  const [viewImageOpen, setViewImageOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageType, setImageType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.personalInfo?.email || '',
    phone: user.personalInfo?.phone || '',
    country: user.personalInfo?.country || '',
    job_title_id: user.job_title?.id || '',
    dateOfBirth: user.personalInfo?.dateOfBirth || '',
  });

  // Update form data when user changes
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.personalInfo?.email || '',
      phone: user.personalInfo?.phone || '',
      country: user.personalInfo?.country || '',
      job_title_id: user.job_title?.id || '',
      dateOfBirth: user.personalInfo?.dateOfBirth || '',
    });
  }, [user]);

  const [profileImage, setProfileImage] = useState(user.profileImage || "/default-avatar.jpg");
  const [coverImage, setCoverImage] = useState(user.coverPhoto);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        job_title_id: formData.job_title_id,
        dateOfBirth: formData.dateOfBirth
      };

      const selectedJobTitle = jobTitles.find(job => job.id === formData.job_title_id);

      // Optimistic update
      const optimisticUser = {
        ...user,
        name: formData.name,
        job_title: selectedJobTitle || null,
        personalInfo: {
          ...user.personalInfo,
          ...payload
        }
      };

      setUser(optimisticUser);
      
      // Use the mutate function
      if (currentUser?.id === user.id) {
        await mutateUser(optimisticUser);
      }

      const response = await axios.put(
        `${baseUrl}/resume/contact-info/${user.personalInfo.id}/`,
        payload,
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setEditOpen(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to update profile");
      setUser(initialUser);
      if (currentUser?.id === user.id) {
        await mutateUser(); // Re-fetch correct data
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${baseUrl}/upload/${type}-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${session?.accessToken}`
          }
        }
      );

      if (response.data.url) {
        if (type === 'profile') {
          setProfileImage(response.data.url);
          setUser(prev => ({ ...prev, profileImage: response.data.url }));
        } else {
          setCoverImage(response.data.url);
          setUser(prev => ({ ...prev, coverPhoto: response.data.url }));
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image updated`);
        mutateUser();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to update ${type} image`);
    }
  };

  const removeImage = async (type) => {
    try {
      await axios.delete(
        `${baseUrl}/upload/${type}-image/`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          }
        }
      );

      if (type === 'profile') {
        setProfileImage("/default-avatar.jpg");
        setUser(prev => ({ ...prev, profileImage: "/default-avatar.jpg" }));
      } else {
        setCoverImage(null);
        setUser(prev => ({ ...prev, coverPhoto: null }));
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image removed`);
      mutateUser();
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(`Failed to remove ${type} image`);
    }
  };

  const openImageModal = (image, type) => {
    setCurrentImage(image);
    setImageType(type);
    setViewImageOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hidden sm:flex">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="hidden sm:flex">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {isOwner && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setEditOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Avatar Section */}
          <div className="p-8 border-b">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="bg-gray-100">
                    <UserCircle className="h-full w-full text-gray-300" />
                  </AvatarFallback>
                </Avatar>
                
                {isOwner && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleImageUpload(e, 'profile')}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      {profileImage !== "/default-avatar.jpg" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600"
                          onClick={() => removeImage('profile')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    {isOwner && (
                      <div className="flex items-center space-x-3 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Upload new photo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => removeImage('profile')}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="p-8 border-b">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name*
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {user.job_title?.name || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio*
              </label>
              <div className="p-3 bg-gray-50 rounded-md border min-h-[100px]">
                {user.bio || 'Write something interesting about you...'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Brief description for your profile. URLs are hyperlinked.
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="p-8 border-b">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Social Media</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network 1
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {user.socialMedia?.network1 || '#'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network 2
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {user.socialMedia?.network2 || '#'}
                </div>
              </div>
              {isOwner && (
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add more link
                </Button>
              )}
            </div>
          </div>

          {/* Address & Location Section */}
          <div className="p-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Address & Location</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address*
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {user.personalInfo?.address || user.location?.address || 'Not specified'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country*
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {user.personalInfo?.country || 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City*
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {user.location?.city || 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code*
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {user.location?.zipCode || 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State*
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {user.location?.state || 'Not specified'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Map Location*
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="p-3 bg-gray-50 rounded-md border pr-12">
                      {user.location?.coordinates || 'XC23+6XC, Location coordinates'}
                    </div>
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      <MapPin className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Map placeholder */}
                  <div className="h-64 bg-gray-100 rounded-md border flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Map would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t">
                {user.personalInfo?.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{user.personalInfo.phone}</span>
                  </div>
                )}
                {user.personalInfo?.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.personalInfo.email}</span>
                  </div>
                )}
                {user.personalInfo?.dateOfBirth && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Cake className="h-4 w-4" />
                    <span>{formatDate(user.personalInfo.dateOfBirth)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isOwner && (
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  onClick={() => setEditOpen(true)}
                >
                  Save
                </Button>
                <Button variant="outline" className="px-6">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {user.seekingOpportunities && (
          <div className="mt-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Open to work
            </span>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditModal
        title="Edit Profile"
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
        isSaving={isSaving}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Select
                value={formData.job_title_id}
                onValueChange={(value) => setFormData({ ...formData, job_title_id: value })}
                disabled={loadingJobTitles}
              >
                <SelectTrigger>
                  <SelectValue placeholder={user.job_title?.name || (loadingJobTitles ? "Loading..." : "Select a job title")} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {jobTitles.map((job) => (
                    <SelectItem 
                      key={job.id} 
                      value={job.id}
                      className={job.id === user.job_title?.id ? "bg-gray-100 font-medium" : ""}
                    >
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>
        </div>
      </EditModal>

      {/* Image View Modal */}
      <Dialog open={viewImageOpen} onOpenChange={setViewImageOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-transparent border-none">
          <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center">
            {currentImage && (
              <Image
                src={currentImage}
                alt={imageType === 'profile' ? 'Profile' : 'Cover'}
                width={imageType === 'profile' ? 800 : 1200}
                height={imageType === 'profile' ? 800 : 600}
                className="object-contain max-w-full max-h-full rounded-lg"
              />
            )}
            <button
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all"
              onClick={() => setViewImageOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};