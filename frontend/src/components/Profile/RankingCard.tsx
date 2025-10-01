import { Star } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { getRankTitle } from "../../types/auth";
import type { CompleteProfileData } from "../../types/auth";

interface RankingCardProps {
  isLoading: boolean;
  profileData: CompleteProfileData | null;
}

export function RankingCard({ isLoading, profileData }: RankingCardProps) {
  const userData = profileData?.user;
  const totalPoints = userData?.totalPoints || 0;
  const solved = profileData?.solutions.filter((s) => s.isApproved).length || 0;
  const pending =
    profileData?.solutions.filter((s) => !s.isApproved).length || 0;

  return (
    <div className="bg-background rounded-lg p-6 border border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <Star className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Ranking</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-2 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Pontos totais:</span>
            <span className="text-2xl font-bold text-primary">
              {totalPoints}
            </span>
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <span className="text-muted-foreground mr-1 sm:mr-0.5">Título atual:</span>
            <span className="font-medium text-foreground">
              {getRankTitle(totalPoints)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Problemas resolvidos:</span>
            <span className="font-medium text-foreground">{solved}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Problemas pendentes:</span>
            <span className="font-medium text-foreground">{pending}</span>
          </div>
        </div>
      )}
    </div>
  );
}
