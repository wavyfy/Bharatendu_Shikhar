import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { CompetitionForm } from "@/features/sports/competitions/components/CompetitionForm";
import { CompetitionTabs } from "@/features/sports/competitions/components/CompetitionTabs";
import { PointsTableEditor } from "@/features/sports/competitions/components/PointsTableEditor";
import { CompetitionMatchesList } from "@/features/sports/competitions/components/CompetitionMatchesList";
import {
  getCompetitionById,
  getCompetitionMatches,
  getCompetitionPointsTable,
} from "@/features/sports/competitions/queries";
import { getRegions } from "@/features/regions/queries";
import { getAllTeams } from "@/features/sports/teams/queries";

export const metadata = { title: "Manage Competition | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

async function CompetitionDetailContent({ id }: { id: string }) {
  let competition, regions, matches, pointsTable, teams;
  try {
    [competition, { regions }, matches, pointsTable, teams] = await Promise.all([
      getCompetitionById(id),
      getRegions({ limit: 100 }),
      getCompetitionMatches(id),
      getCompetitionPointsTable(id),
      getAllTeams(),
    ]);
  } catch {
    notFound();
  }

  return (
    <CompetitionTabs
      detailsForm={<CompetitionForm initialData={competition} regions={regions} />}
      pointsTable={
        <PointsTableEditor
          competitionId={id}
          entries={pointsTable}
          teams={teams}
        />
      }
      matchesList={<CompetitionMatchesList matches={matches} />}
    />
  );
}

export default async function CompetitionDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Manage Competition</h1>
        <p className="page-subtitle">Edit details, update points table, and view matches.</p>
      </div>
      <Suspense
        fallback={
          <div className="cms-card h-96 animate-pulse bg-surface-container-low rounded-xl border border-outline-variant" />
        }
      >
        <CompetitionDetailContent id={id} />
      </Suspense>
    </AnimatedPage>
  );
}
