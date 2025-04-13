'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/src/hooks/use-media-query';
import { Card } from '@/components/ui/card';
import { ProfileHeader } from './ProfileHeader';
import { AboutSection } from './About';
import { ExperienceSection } from './Experiences';
import { SkillsSection } from './Skills';
import { LanguagesSection } from './Languages';
import { LocationSection } from './Location';
import { CVSection } from './CV';
import { EducationSection } from './Education';
import { JobPreferencesSection } from './JobPreferences';

export const Profile = ({ user, isOwner = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="container bg-white px-4 py-4">
        <Tabs defaultValue="about" className="w-full">
          <ScrollArea className="w-full pb-4" orientation="horizontal">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="about" className="whitespace-nowrap">About</TabsTrigger>
              <TabsTrigger value="experience" className="whitespace-nowrap">Experience</TabsTrigger>
              <TabsTrigger value="education" className="whitespace-nowrap">Education</TabsTrigger>
              <TabsTrigger value="skills" className="whitespace-nowrap">Skills</TabsTrigger>
              <TabsTrigger value="more" className="whitespace-nowrap">More</TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          <div className="mt-4">
            <ProfileHeader user={user} isOwner={isOwner} />
          </div>
          
          <div className="space-y-4 mt-4">
            <TabsContent value="about">
              <AboutSection about={user.about} isOwner={isOwner} />
            </TabsContent>
            
            <TabsContent value="experience">
              <ExperienceSection experiences={user.experiences} isOwner={isOwner} />
            </TabsContent>
            
            <TabsContent value="education">
              <EducationSection educations={user.educations} isOwner={isOwner} />
            </TabsContent>
            
            <TabsContent value="skills">
              <SkillsSection skills={user.skills} isOwner={isOwner} />
              <LanguagesSection languages={user.languages} isOwner={isOwner} />
            </TabsContent>
            
            <TabsContent value="more">
              <LocationSection location={user.location} isOwner={isOwner} />
              <JobPreferencesSection preferences={user.jobPreferences} isOwner={isOwner} />
              <CVSection cv={user.cv} isOwner={isOwner} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className='bg-white'>
        <div className="container px-4 py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader user={user} isOwner={isOwner} />
          <AboutSection about={user.about} isOwner={isOwner} />
          <ExperienceSection experiences={user.experiences} isOwner={isOwner} />
          <EducationSection educations={user.educations} isOwner={isOwner} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <SkillsSection skills={user.skills} isOwner={isOwner} />
          <LanguagesSection languages={user.languages} isOwner={isOwner} />
          <LocationSection location={user.location} isOwner={isOwner} />
          <JobPreferencesSection preferences={user.jobPreferences} isOwner={isOwner} />
          <CVSection cv={user.cv} isOwner={isOwner} />
        </div>
      </div>
    </div>
    </div>
  );
};