import useUser from "@/src/hooks/useUser";

export default userProfileData = () => {
    const userData = useUser();

const user = {
    name: `${userData.first_name} ${userData.last_name}`,
    headline: "Frontend Developer | React Specialist",
    location: {
      city: "San Francisco",
      country: "United States",
      remote: true
    },
    connections: 243,
    about: "Passionate frontend developer with 5+ years of experience building responsive and accessible web applications. Currently seeking new opportunities to contribute my skills in React and TypeScript to innovative projects.",
    experiences: [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp",
        startDate: "Jan 2020",
        endDate: "Mar 2023",
        duration: "3 yrs 2 mos",
        location: "San Francisco, CA",
        description: "Led a team of 5 developers to rebuild the company's flagship product using React and Next.js."
      }
    ],
    educations: [
      {
        school: "Stanford University",
        degree: "Bachelor of Science in Computer Science",
        startYear: "2014",
        endYear: "2018"
      }
    ],
    skills: [
      { name: "React", endorsements: 42 },
      { name: "JavaScript", endorsements: 38 },
      { name: "TypeScript", endorsements: 25 }
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Spanish", proficiency: "Intermediate" }
    ],
    jobPreferences: {
      title: "Senior Frontend Developer",
      jobTypes: ["Full-time", "Contract", "Freelance"],
      industries: ["Software Development", "FinTech", "E-commerce"],
      salary: "$100,000 - $120,000"
    },
    cv: {
      name: "John_Doe_Resume_2023.pdf",
      size: "1.2 MB",
      date: "2 months ago"
    }
  };

  return user;
}