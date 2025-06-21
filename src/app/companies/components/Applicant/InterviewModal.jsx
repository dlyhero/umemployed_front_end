'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const InterviewModal = ({ isOpen, onClose, candidate, companyId, jobId, accessToken }) => {
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Unauthorized: No access token available');
      return;
    }

    if (!interviewDate || !interviewTime || !timezone) {
      toast.error('Please provide date, time, and timezone for the interview.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      candidate_id: candidate?.user_id,
      job_id: jobId,
      company_id: companyId,
      date: interviewDate,
      time: interviewTime,
      timezone,
      notes,
    };

    try {
      console.log('Sending interview creation request:', { payload });
      const response = await fetch(
        'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/company/create-interview/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.statusText || 'Unknown error'}` };
        }
        console.error('Interview creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestPayload: payload,
        });
        throw new Error(`Failed to schedule interview: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Interview creation success:', result);
      toast.success(`Interview scheduled successfully for ${candidate?.profile?.firstName} ${candidate?.profile?.lastName}!`);
      onClose();
    } catch (err) {
      console.error('Schedule interview error:', err);
      toast.error(err.message || 'Failed to schedule interview.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview for {candidate?.profile?.firstName} {candidate?.profile?.lastName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="interviewDate">Interview Date</Label>
            <Input
              id="interviewDate"
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              required
              className="border-brand focus:ring-brand"
            />
          </div>
          <div>
            <Label htmlFor="interviewTime">Interview Time</Label>
            <Input
              id="interviewTime"
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              required
              className="border-brand focus:ring-brand"
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone} required>
              <SelectTrigger className="border-brand focus:ring-brand">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">America/New_York</SelectItem>
                <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes for the interview..."
              className="border-brand focus:ring-brand"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-brand text-brand"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand text-white hover:bg-brand/90"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                'Schedule'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewModal;