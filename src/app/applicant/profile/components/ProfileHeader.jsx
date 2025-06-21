'use client';

import { UserCircle, Edit, MessageSquare, Share2, Camera, X, Phone, Mail, Cake, Maximize2, Plus, FileText, Send, Star, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditModal } from './EditModal';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
// Note: In actual implementation, import axios and baseUrl
// import axios from 'axios';
// import baseUrl from '@/src/app/api/baseUrl';

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
  const [aboutEditOpen, setAboutEditOpen] = useState(false);
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

  const [aboutData, setAboutData] = useState(user.about || '');

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
    setAboutData(user.about || '');
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
        await mutateUser();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAboutSave = async () => {
    setIsSaving(true);
    try {
      // Optimistic update
      const optimisticUser = {
        ...user,
        about: aboutData
      };

      setUser(optimisticUser);

      if (currentUser?.id === user.id) {
        await mutateUser(optimisticUser);
      }

      // API call would go here
      toast.success("About section updated successfully!");
      setAboutEditOpen(false);
    } catch (error) {
      console.error('Error saving about:', error);
      toast.error("Failed to update about section");
      setUser(initialUser);
      if (currentUser?.id === user.id) {
        await mutateUser();
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
    <div className=''>
      {/* Cover Photo Section */}
      <div className="border border-gray-200 pb-6 max-w-2xl  bg-white">
        <div className="relative border-b">
          <div className="h-64 bg-gradient-to-r from-slate-100 to-slate-200 relative group overflow-hidden r ">
            {coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openImageModal(coverImage, 'cover')}
                />
                <button
                  className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-all"
                  onClick={() => openImageModal(coverImage, 'cover')}
                >
                  <Maximize2 className="h-4 w-4 text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-50 to-indigo-100" />
            )}

            {isOwner && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                    onClick={() => coverInputRef.current.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {coverImage ? 'Change' : 'Add'} Cover
                  </Button>
                  {coverImage && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-red-600 shadow-lg"
                      onClick={() => removeImage('cover')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-0">
              {/* Profile Header */}
              <div className="relative -mt-20 pb-8">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  {/* Profile Image */}
                  <div className="relative group">
                    <div className="relative">
                      <Avatar
                        className="h-40 w-40 border-4 border-white shadow-2xl cursor-pointer"
                        onClick={() => profileImage !== "/default-avatar.jpg" && openImageModal(profileImage, 'profile')}
                      >
                        <AvatarImage src={profileImage} className="object-cover" />
                        <AvatarFallback className="bg-gray-100 text-4xl">
                          <UserCircle className="h-full w-full text-gray-300" />
                        </AvatarFallback>
                      </Avatar>
                      {profileImage !== "/default-avatar.jpg" && (
                        <button
                          className="absolute top-2 right-2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-all"
                          onClick={() => openImageModal(profileImage, 'profile')}
                        >
                          <Maximize2 className="h-3 w-3 text-white" />
                        </button>
                      )}
                    </div>

                    {isOwner && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleImageUpload(e, 'profile')}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                          {profileImage !== "/default-avatar.jpg" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-red-600 shadow-lg"
                              onClick={() => removeImage('profile')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 mt-4 lg:mt-16">
                    <div className="space-y-3">
                      <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>

                      {user.job_title?.name && (
                        <div className="text-xl text-brand font-medium">
                          {user.job_title.name}
                        </div>
                      )}

                      {/* Info Items */}
                      <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        {user.personalInfo?.country && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-brand hover:underline cursor-pointer">
                              {user.location?.city && `${user.location.city}, `}
                              {user.personalInfo.country}
                            </span>
                          </div>
                        )}

                        {user.personalInfo?.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              ${user.personalInfo.salary}/month
                            </span>
                          </div>
                        )}

                        {user.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{user.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({user.reviewsCount || 0} Reviews)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Additional Personal Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2">
                        {user.personalInfo?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{user.personalInfo.phone}</span>
                          </div>
                        )}
                        {user.personalInfo?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{user.personalInfo.email}</span>
                          </div>
                        )}
                        {user.personalInfo?.dateOfBirth && (
                          <div className="flex items-center gap-2">
                            <Cake className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(user.personalInfo.dateOfBirth)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-8 px-8">


                  <Button
                    variant="outline"
                    className="p-6 rounded-full border-brand text-brand"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Save to PDF
                  </Button>

                  <Button
                    variant="outline"
                    className="p-6 rounded-full"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Invite
                  </Button>



                  {isOwner && (
                    <Button
                      variant="outline"
                      className="text-white bg-brand p-6 rounded-full"
                      onClick={() => setEditOpen(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {/* Status Badge */}
                {user.seekingOpportunities && (
                  <div className="mt-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Open to work
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white mt-2">
          <div className="max-w-7xl px-6">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">About me</h2>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand hover:text-brand/90 hover:bg-blue-50"
                    onClick={() => setAboutEditOpen(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="prose prose-gray max-w-none">
                {user.about ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {user.about}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    {isOwner ? 'Add information about yourself' : 'No information provided yet.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
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
                  <SelectValue placeholder={loadingJobTitles ? "Loading..." : "Select a job title"} />
                </SelectTrigger>
                <SelectContent className="max-h-90 overflow-y-auto">
                  {jobTitles.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
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

      {/* Edit About Modal */}
      <EditModal
        title="Edit About"
        open={aboutEditOpen}
        onOpenChange={setAboutEditOpen}
        onSave={handleAboutSave}
        isSaving={isSaving}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={aboutData}
              onChange={(e) => setAboutData(e.target.value)}
              placeholder="Tell others about yourself, your skills, and experiences"
              rows={8}
              className="min-h-[200px]"
            />
            <p className="text-sm text-gray-500">
              {aboutData.length}/2,000 characters
            </p>
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

export const AboutSection = ({ about, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about || '');

  const handleSave = () => {
    onSave(editedAbout);
    setIsEditing(false);
  };

  return (
    <div className="p-8 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">About me</h2>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            className="text-brand hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <div className="prose prose-gray max-w-none">
        {about ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {about}
          </p>
        ) : (
          <p className="text-gray-500 italic">
            {isOwner ? 'Add information about yourself' : 'No information provided yet.'}
          </p>
        )}
      </div>

      <EditModal
        title="Edit About"
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={editedAbout}
              onChange={(e) => setEditedAbout(e.target.value)}
              placeholder="Tell others about yourself, your skills, and experiences"
              rows={8}
              className="min-h-[200px]"
            />
            <p className="text-sm text-gray-500">
              {editedAbout.length}/2,000 characters
            </p>
          </div>
        </div>
      </EditModal>
    </div>
  );
};