'use client';

import { MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditModal } from './EditModal';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const LocationSection = ({ location, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState(location || {
    city: '',
    country: '',
    remote: false
  });

  const handleSave = () => {
    onSave(editedLocation);
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Location</h2>
        </div>
        
        {isOwner && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand hover:text-brand"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {location ? (
          <>
            <p className="text-gray-900">
              {location.city}, {location.country}
            </p>
            {location.remote && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand">
                Open to remote work
              </span>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">
            {isOwner ? 'Add your location to help recruiters find you' : 'No location specified.'}
          </p>
        )}
      </div>

      {/* Edit Location Modal */}
      <EditModal
        title="Edit Location"
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={editedLocation.city}
                onChange={(e) => setEditedLocation({...editedLocation, city: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={editedLocation.country}
                onChange={(e) => setEditedLocation({...editedLocation, country: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="remote">Open to remote work</Label>
            <Switch
              id="remote"
              checked={editedLocation.remote}
              onCheckedChange={(checked) => setEditedLocation({...editedLocation, remote: checked})}
            />
          </div>
        </div>
      </EditModal>
    </Card>
  );
};