'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/src/hooks/use-media-query';
import { Card } from '@/components/ui/card';
import { ProfileHeader } from './ProfileHeader';
import { ExperienceSection } from './Experiences';
import { LanguagesSection } from './Languages';
import { LocationSection } from './Location';
import { CVSection } from './CV';
import { EducationSection } from './Education';
import { JobPreferencesSection } from './JobPreferences';
import { SkillsSection } from './Skills';

export const Profile = ({ initialUser, isOwner = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="container mx-auto bg-white py-4">
        <Tabs defaultValue="experience" className="w-full">
          <ScrollArea className="w-full pb-4" orientation="horizontal">
            <TabsList className="flex w-[98%]  mx-auto overflow-auto">
              <TabsTrigger value="experience" className="whitespace-nowrap">Experience</TabsTrigger>
              <TabsTrigger value="education" className="whitespace-nowrap">Education</TabsTrigger>
              <TabsTrigger value="skills" className="whitespace-nowrap">Skills</TabsTrigger>
              <TabsTrigger value="more" className="whitespace-nowrap">More</TabsTrigger>
            </TabsList>
          </ScrollArea>

          <div className="mt-4">
            <ProfileHeader initialUser={initialUser} isOwner={isOwner} />
          </div>

          <div className="space-y-4 mt-4">


            <TabsContent value="experience">
              <ExperienceSection experiences={initialUser?.experiences} isOwner={isOwner} />
            </TabsContent>

            <TabsContent value="education">
              <EducationSection educations={initialUser?.educations} isOwner={isOwner} />
            </TabsContent>

            <TabsContent value="skills" className={`space-y-2`}>
              <SkillsSection skills={initialUser?.skills} isOwner={isOwner} />
              <LanguagesSection languages={initialUser.languages} isOwner={isOwner} />
            </TabsContent>

            <TabsContent value="more" className={`space-y-2`}>
              <LocationSection location={initialUser?.location} isOwner={isOwner} />
              <JobPreferencesSection preferences={initialUser?.jobPreferences} isOwner={isOwner} />
              <CVSection cv={initialUser?.cv} isOwner={isOwner} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className=''>
      <div className="  ">
        <div className="flex flex-col lg:flex-row gap-6 max-w-5xl">
          {/* Left Column */}
          <div className="space-y-2">
            <ProfileHeader initialUser={initialUser} isOwner={isOwner} />
            <ExperienceSection experiences={initialUser.experiences} isOwner={isOwner} />
            <EducationSection educations={initialUser?.educations} isOwner={isOwner} />
          </div>

          {/* Right Column */}
          <div className="space-y-2 bg-white border rounded-xl max-w-2xl">
            <SkillsSection skills={initialUser?.skills} isOwner={isOwner} />
            <LanguagesSection languages={initialUser?.languages} isOwner={isOwner} />
            <LocationSection location={initialUser?.location} isOwner={isOwner} />
            <JobPreferencesSection preferences={initialUser?.jobPreferences} isOwner={isOwner} />
            <CVSection cv={initialUser?.cv} isOwner={isOwner} />
          </div>
          <div className="space-y-2">
           
          </div>
        </div>
      </div>
    </div>
  );
};