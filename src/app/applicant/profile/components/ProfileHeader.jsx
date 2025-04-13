'use client';

import { UserCircle, Edit, MessageSquare, Share2, Camera, X } from 'lucide-react';
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
import axios from 'axios';

export const ProfileHeader = ({ user, isOwner }) => {
  const { data: session, update } = useSession();
  const user1 = useUser();
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    headline: user.headline,
    location: user.location?.city || '',
    about: user.about || ''
  });
  const [profileImage, setProfileImage] = useState(user1.image);
  const [coverImage, setCoverImage] = useState(user.coverPhoto);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleSave = async () => {
    try {
      // Update profile data via your API
      const response = await axios.put(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/profile/',
        {
          ...formData,
          location: {
            city: formData.location,
            country: user.location?.country || ''
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update session with new data
      await update({
        name: response.data.name,
        image: profileImage // Use the current profile image
      });

      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error("Please upload a valid image file (JPEG, PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Uploading image...");

      // Create FormData and upload to your API
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/upload/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const imageUrl = response.data.url;

      // Update the specific image type
      if (type === 'profile') {
        setProfileImage(imageUrl);
        // Update session with new profile image
        await update({ image: imageUrl });
      } else {
        setCoverImage(imageUrl);
      }

      // Update the user's profile with the new image URL
      await axios.put(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/profile/',
        type === 'profile' ? { photo: imageUrl } : { coverPhoto: imageUrl },
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} image updated`);
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast.error(`Failed to upload ${type} image`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (type) => {
    try {
      setIsUploading(true);

      // Update the user's profile to remove the image
      await axios.put(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/profile/',
        type === 'profile' ? { photo: null } : { coverPhoto: null },
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      if (type === 'profile') {
        setProfileImage(null);
        // Update session to remove profile image
        await update({ image: null });
      } else {
        setCoverImage(null);
      }

      toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} image removed`);
    } catch (error) {
      console.error(`Error removing ${type} image:`, error);
      toast.error(`Failed to remove ${type} image`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden pt-0">
        {/* Cover Photo with Upload Option */}
        <div className="h-56 bg-gradient-to-r from-brand to-brand-dark relative group">
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}

          {isOwner && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <input
                type="file"
                ref={coverInputRef}
                onChange={(e) => handleImageUpload(e, 'cover')}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => coverInputRef.current.click()}
                  disabled={isUploading}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {coverImage ? 'Change' : 'Add'} Cover
                  {isUploading && <span className="ml-2">...</span>}
                </Button>
                {coverImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage('cover')}
                    disabled={isUploading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-4 -mt-16">
              {/* Profile Picture with Upload Option */}
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="bg-gray-100">
                    <UserCircle className="h-full w-full text-gray-300" />
                  </AvatarFallback>
                </Avatar>

                {isOwner && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleImageUpload(e, 'profile')}
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full h-10 w-10 p-0"
                        onClick={() => fileInputRef.current.click()}
                        disabled={isUploading}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      {profileImage && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full h-10 w-10 p-0"
                          onClick={() => removeImage('profile')}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 sm:mt-12 lg:mt-12 space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user1?.first_name} {user1?.last_name}
                </h1>
                <p className="text-brand font-medium">{user.headline}</p>
                <p className="text-gray-500 text-sm">
                  {user.location?.city}, {user.location?.country} · {user.connections} connections
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-0 self-end sm:self-auto">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Message</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand hover:text-brand"
                  onClick={() => setEditOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              )}
            </div>
          </div>

          {/* Unemployed Status Badge */}
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand/10 text-brand">
              Actively seeking opportunities
            </span>
          </div>
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                required
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
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              rows={6}
            />
          </div>
        </div>
      </EditModal>
    </>
  );
};