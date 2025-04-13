'use client';

import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EditModal } from './EditModal';

export const AboutSection = ({ about, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about || '');

  const handleSave = () => {
    onSave(editedAbout); // Call parent component's save handler
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">About</h2>
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
      
      <p className="text-gray-700 whitespace-pre-line">
        {about || (
          <span className="text-gray-500 italic">
            {isOwner ? 'Add information about yourself' : 'No information provided yet.'}
          </span>
        )}
      </p>

      {/* Edit About Modal */}
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
    </Card>
  );
};