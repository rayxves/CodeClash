import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { type CompleteProfileData } from "../../types/auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCompleteProfile } from "../../api/services";
import { ProfileHeader } from "./ProfileHeader";
import { RankingCard } from "./RankingCard";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { SolutionsCard } from "./SolutionsCard";
import { ErrorState } from "./ErrorState";

export default function OptimizedProfilePage() {
  const [profileData, setProfileData] = useState<CompleteProfileData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSolutions, setExpandedSolutions] = useState<Set<number>>(
    new Set()
  );
  const [showCode, setShowCode] = useState<Set<number>>(new Set());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  const loadData = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setError(null);
    try {
      const completeProfile = await getCompleteProfile();
      setProfileData(completeProfile);
    } catch {
      setError(
        "Não foi possível carregar os dados do perfil. Tente recarregar a página."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [loadData]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRetry = () => {
    setIsLoading(true);
    loadData();
  };

  const userProblemSolutions = profileData?.solutions || [];
  const userData = profileData?.user;
  const totalPages = Math.ceil(userProblemSolutions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSolutions = userProblemSolutions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (!user) {
    return null;
  }

  if (error && !isLoading) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl shadow-elegant border border-border/50 overflow-hidden">
          <ProfileHeader
            isLoading={isLoading}
            userName={userData?.userName || user.username}
            totalPoints={userData?.totalPoints || 0}
          />

          <div className="p-8 space-y-6">
            <RankingCard isLoading={isLoading} profileData={profileData} />

            <PersonalInfoCard
              profileData={profileData}
              fallbackUser={{ username: user.username, email: user.email }}
            />

            <SolutionsCard
              isLoading={isLoading}
              userProblemSolutions={userProblemSolutions}
              currentSolutions={currentSolutions}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              expandedSolutions={expandedSolutions}
              setExpandedSolutions={setExpandedSolutions}
              showCode={showCode}
              setShowCode={setShowCode}
            />

            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
