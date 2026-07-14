import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { MatchForm } from "@/features/sports/matches/components/MatchForm";
import { getAllTeams } from "@/features/sports/teams/queries";
import { getCompetitions } from "@/features/sports/competitions/queries";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Create Match | Bharatendu Shikhar Admin" };

export default async function NewMatchPage() {
  const [teams, { competitions }, { regions }] = await Promise.all([
    getAllTeams(),
    getCompetitions({ limit: 200 }),
    getRegions({ limit: 100 }),
  ]);
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Create Match</h1>
        <p className="page-subtitle">Schedule a new cricket or football match.</p>
      </div>
      <div className="cms-card p-6">
        <MatchForm teams={teams} competitions={competitions} regions={regions} />
      </div>
    </AnimatedPage>
  );
}
