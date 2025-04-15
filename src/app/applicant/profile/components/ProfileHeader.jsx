'use client';

import { UserCircle, Edit, MessageSquare, Share2, Camera, X, Phone, Mail, Cake, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditModal } from './EditModal';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export const ProfileHeader = ({ user, isOwner }) => {
  const { data: session } = useSession();
  const user1 = useUser();

  const [editOpen, setEditOpen] = useState(false);
  const [viewImageOpen, setViewImageOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageType, setImageType] = useState('');
  const [formData, setFormData] = useState({
    name: user.name,
    headline: user.headline,
    location: user.location?.city || '',
    about: user.about || '',
    phone: user.personalInfo?.phone || '',
    dateOfBirth: user.personalInfo?.dateOfBirth || ''
  });
  
  const [profileImage, setProfileImage] = useState(user.profileImage || "/default-avatar.jpg");
  const [coverImage, setCoverImage] = useState(user.coverPhoto);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setEditOpen(false);
    toast.success("Profile updated successfully!");
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'profile') {
        setProfileImage(event.target.result);
      } else {
        setCoverImage(event.target.result);
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image updated`);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type) => {
    if (type === 'profile') {
      setProfileImage("/default-avatar.jpg");
    } else {
      setCoverImage(null);
    }
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image removed`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openImageModal = (image, type) => {
    setCurrentImage(image);
    setImageType(type);
    setViewImageOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-sm rounded-lg bg-white">
        {/* Cover Photo */}
        <div className="h-48 bg-gray-100 relative group">
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openImageModal(coverImage, 'cover')}
              />
              <button 
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-all"
                onClick={() => openImageModal(coverImage, 'cover')}
              >
                <Maximize2 className="h-4 w-4 text-gray-700" />
              </button>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300" />
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
                  className="bg-white/90 hover:bg-white text-gray-800 shadow"
                  onClick={() => coverInputRef.current.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {coverImage ? 'Change' : 'Add'} Cover
                </Button>
                {coverImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-red-600 shadow"
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
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-6 -mt-16">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="relative">
                  <Avatar 
                    className="h-32 w-32 border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => profileImage !== "/default-avatar.jpg" && openImageModal(profileImage, 'profile')}
                  >
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="bg-gray-100">
                      <UserCircle className="h-full w-full text-gray-300" />
                    </AvatarFallback>
                  </Avatar>
                  {profileImage !== "/default-avatar.jpg" && (
                    <button 
                      className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-all"
                      onClick={() => openImageModal(profileImage, 'profile')}
                    >
                      <Maximize2 className="h-4 w-4 text-gray-700" />
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
                        className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-gray-800 shadow"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      {profileImage !== "/default-avatar.jpg" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-red-600 shadow"
                          onClick={() => removeImage('profile')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 sm:mt-12 lg:mt-12 space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-700 font-medium">{user.headline}</p>
                <p className="text-gray-500 text-sm">
                  {user.location?.city}, {user.location?.country}
                </p>
                
                {/* Personal Info Section */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
                  {user.personalInfo?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{user.personalInfo.phone}</span>
                    </div>
                  )}
                  {user.personalInfo?.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user.personalInfo.email}</span>
                    </div>
                  )}
                  {user.personalInfo?.dateOfBirth && (
                    <div className="flex items-center gap-1">
                      <Cake className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(user.personalInfo.dateOfBirth)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 sm:mt-0 self-end sm:self-auto">
              <Button variant="outline" className="gap-2 hover:bg-gray-50 border-gray-300">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Message</span>
              </Button>
              <Button variant="outline" className="gap-2 hover:bg-gray-50 border-gray-300">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              {isOwner && (
                <Button
                  variant="outline"
                  className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                  onClick={() => setEditOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              )}
            </div>
          </div>

          {/* Status Badge - Only show if user is seeking opportunities */}
          {user.seekingOpportunities && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Open to work
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <EditModal
        title="Edit Profile"
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
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
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="min-h-[120px]"
              placeholder="Tell us about your professional experience, skills, and goals..."
            />
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
    </>
  );
};