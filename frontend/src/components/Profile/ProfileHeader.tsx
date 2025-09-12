import { User, Trophy } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { getRankTitle } from "../../types/auth";

interface ProfileHeaderProps {
  isLoading: boolean;
  userName: string;
  totalPoints: number;
}

export function ProfileHeader({ isLoading, userName, totalPoints }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-primary p-8 text-center">
      <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="w-12 h-12 text-primary-foreground" />
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">
            {userName}
          </h1>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">{getRankTitle(totalPoints)}</span>
          </div>
        </>
      )}
    </div>
  );
}
