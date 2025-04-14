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

export const ProfileHeader = ({ user, isOwner }) => {
  const user1 = useUser();

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    headline: user.headline,
    location: user.location?.city || '',
    about: user.about || ''
  });
  const [profileImage, setProfileImage] = useState(user.image);
  const [coverImage, setCoverImage] = useState(user.coverPhoto);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setEditOpen(false);
    toast.success("Profile updated");
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error("Invalid file. Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'profile') {
        setProfileImage(event.target.result);
      } else {
        setCoverImage(event.target.result);
      }
      toast.success(`Your ${type} image has been updated`);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type) => {
    if (type === 'profile') {
      setProfileImage(null);
    } else {
      setCoverImage(null);
    }
    toast.success(`Your ${type} image has been removed`);
  };

  return (
    <>
      <Card className="overflow-hidden  pt-0">
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
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => coverInputRef.current.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {coverImage ? 'Change' : 'Add'} Cover
                </Button>
                {coverImage && (
                  <Button
                    variant="destructive"
                    size="sm"
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

        {/* Profile Info */}
        <div className="px-4 sm:px-6 pb-6 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
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
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full h-10 w-10 p-0"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      {profileImage && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full h-10 w-10 p-0"
                          onClick={() => removeImage('profile')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 sm:mt-12 lg:mt-12 space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
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
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            />
          </div>
        </div>
      </EditModal>
    </>
  );
};
