"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { useRouter } from "next/navigation";

export function NoResumeCard() {
  const router = useRouter();

  return (
   <div className="h-[70vh] flex flex-col justify-center bg-white">
     <Card className="w-full max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">No Resume Found</CardTitle>
        <CardDescription className="text-center">
          You haven't uploaded a resume yet
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
          <FileUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Upload your resume to create your profile
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => router.push("/applicant/upload-resume")}
          className="gap-2"
        >
          <FileUp className="w-4 h-4" />
          Upload Resume
        </Button>
      </CardFooter>
    </Card>
   </div>
  );
}