import { User, Mail } from "lucide-react";
import type { CompleteProfileData } from "../../types/auth";

interface PersonalInfoCardProps {
  profileData: CompleteProfileData | null;
  fallbackUser: { username: string; email: string };
}

export function PersonalInfoCard({ profileData, fallbackUser }: PersonalInfoCardProps) {
  const userData = profileData?.user;

  return (
    <div className="bg-background rounded-lg p-6 border border-border/50">
      <h2 className="text-xl font-semibold text-foreground mb-4">Informações Pessoais</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Nome de usuário:</span>
            <p className="font-medium text-foreground">{userData?.userName || fallbackUser.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Email:</span>
            <p className="font-medium text-foreground">{userData?.email || fallbackUser.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
