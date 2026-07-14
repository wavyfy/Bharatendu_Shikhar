import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { CompetitionForm } from "@/features/sports/competitions/components/CompetitionForm";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Create Competition | Bharatendu Shikhar Admin" };

export default async function NewCompetitionPage() {
  const { regions } = await getRegions({ limit: 100 });
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Create Competition</h1>
        <p className="page-subtitle">Set up a new tournament, series, league, or cup.</p>
      </div>
      <div className="cms-card p-6">
        <CompetitionForm regions={regions} />
      </div>
    </AnimatedPage>
  );
}
