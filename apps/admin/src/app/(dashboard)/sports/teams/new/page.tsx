import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TeamForm } from "@/features/sports/teams/components/TeamForm";

export const metadata = { title: "Add Team | Bharatendu Shikhar Admin" };

export default function NewTeamPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Add Team</h1>
        <p className="page-subtitle">Create a new team record for use in matches.</p>
      </div>
      <div className="cms-card p-6">
        <TeamForm />
      </div>
    </AnimatedPage>
  );
}
