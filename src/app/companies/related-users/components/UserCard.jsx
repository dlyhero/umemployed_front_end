import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { User, ThumbsUp } from "lucide-react";

export default function UserCard({ user }) {
  const router = useRouter();

  const handleEndorse = () => {
    router.push(`/companies/rate-candidate/${user.id}/`);
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            {user.profileImage ? (
              <div className="p-1 rounded-lg bg-white/90 w-16 h-16">
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#1e90ff]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-600 mt-1 truncate">{user.email}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 border-t border-gray-200">
        <Button 
          onClick={handleEndorse}
          className="w-full bg-[#1e90ff] hover:bg-[#1a82e6] text-white cursor-pointer font-semibold rounded-md flex items-center justify-center gap-2"
        >
          <ThumbsUp className="w-4 h-4" />
          Endorse
        </Button>
      </CardFooter>
    </Card>
  );
}