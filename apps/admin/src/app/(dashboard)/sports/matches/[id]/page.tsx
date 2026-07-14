import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { MatchForm } from "@/features/sports/matches/components/MatchForm";
import { MatchTabs } from "@/features/sports/matches/components/MatchTabs";
import { ScorePanel } from "@/features/sports/matches/components/ScorePanel";
import { MatchUpdatesList } from "@/features/sports/matches/components/MatchUpdatesList";
import {
  getMatchById,
  getMatchUpdates,
} from "@/features/sports/matches/queries";
import { getAllTeams } from "@/features/sports/teams/queries";
import { getCompetitions } from "@/features/sports/competitions/queries";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Manage Match | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

async function MatchDetailContent({ id }: { id: string }) {
  let match, teams, competitions, regions, updates;
  try {
    [match, teams, { competitions }, { regions }, updates] = await Promise.all([
      getMatchById(id),
      getAllTeams(),
      getCompetitions({ limit: 200 }),
      getRegions({ limit: 100 }),
      getMatchUpdates(id),
    ]);
  } catch {
    notFound();
  }

  return (
    <MatchTabs
      detailsForm={
        <MatchForm
          initialData={match}
          teams={teams}
          competitions={competitions}
          regions={regions}
        />
      }
      scorePanel={<ScorePanel matchId={id} match={match} />}
      updatesList={
        <MatchUpdatesList
          matchId={id}
          updates={updates}
          sport={match.sport as "cricket" | "football"}
        />
      }
    />
  );
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Manage Match</h1>
        <p className="page-subtitle">Update details, score, and post live commentary.</p>
      </div>
      <Suspense
        fallback={
          <div className="cms-card h-96 animate-pulse bg-surface-container-low rounded-xl border border-outline-variant" />
        }
      >
        <MatchDetailContent id={id} />
      </Suspense>
    </AnimatedPage>
  );
}
