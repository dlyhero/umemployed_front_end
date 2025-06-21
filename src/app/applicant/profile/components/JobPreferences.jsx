'use client';

import { Target, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditModal } from './EditModal';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MultiSelect } from './MultiSelect'; // You'll need to create this

const jobTypeOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Remote'
];

const industryOptions = [
  'Software Development',
  'Design',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education'
];

export const JobPreferencesSection = ({ preferences, isOwner, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrefs, setEditedPrefs] = useState(preferences || {
    title: '',
    jobTypes: [],
    industries: [],
    salary: '',
    notes: ''
  });

  const handleSave = () => {
    onSave(editedPrefs);
    setIsEditing(false);
  };

  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Job Preferences</h2>
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
      
      <div className="space-y-4">
        {preferences ? (
          <>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Desired Job Title</h3>
              <p className="text-gray-900">{preferences.title || 'Not specified'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Types</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {preferences.jobTypes?.length > 0 ? (
                  preferences.jobTypes.map((type, index) => (
                    <Badge key={index} variant="outline">
                      {type}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Not specified</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Industries</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {preferences.industries?.length > 0 ? (
                  preferences.industries.map((industry, index) => (
                    <Badge key={index} variant="outline">
                      {industry}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Not specified</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Salary Expectations</h3>
              <p className="text-gray-900">{preferences.salary || 'Not specified'}</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No job preferences</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isOwner ? 'Add your job preferences to help recruiters find the right opportunities for you.' : 'No job preferences specified.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Preferences Modal */}
      <EditModal
        title="Edit Job Preferences"
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Desired Job Title</Label>
            <Input
              id="title"
              value={editedPrefs.title}
              onChange={(e) => setEditedPrefs({...editedPrefs, title: e.target.value})}
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Job Types</Label>
            <MultiSelect
              options={jobTypeOptions}
              selected={editedPrefs.jobTypes}
              onChange={(selected) => setEditedPrefs({...editedPrefs, jobTypes: selected})}
              placeholder="Select job types"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Industries</Label>
            <MultiSelect
              options={industryOptions}
              selected={editedPrefs.industries}
              onChange={(selected) => setEditedPrefs({...editedPrefs, industries: selected})}
              placeholder="Select industries"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary">Salary Expectations</Label>
            <Input
              id="salary"
              value={editedPrefs.salary}
              onChange={(e) => setEditedPrefs({...editedPrefs, salary: e.target.value})}
              placeholder="e.g. $80,000 - $100,000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={editedPrefs.notes}
              onChange={(e) => setEditedPrefs({...editedPrefs, notes: e.target.value})}
              rows={3}
              placeholder="Any other preferences or requirements"
            />
          </div>
        </div>
      </EditModal>
    </div>
  );
};