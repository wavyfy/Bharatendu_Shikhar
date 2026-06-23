import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { ElectionForm } from "@/features/elections/components/ElectionForm";
import { GroupsList } from "@/features/elections/components/GroupsList";
import { LiveUpdatesList } from "@/features/elections/components/LiveUpdatesList";
import { ElectionTabs } from "@/features/elections/components/ElectionTabs";
import { getElectionById, getElectionGroups, getElectionUpdates } from "@/features/elections/queries";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Manage Election | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Loads election details and related data for display in the management interface.
 *
 * @param id - The election identifier
 * @returns A tabbed UI component with the election form, groups list, and live updates
 */
async function ElectionDetailContent({ id }: { id: string }) {
  let election;
  let regions;
  let groups;
  let updates;

  try {
    const [electionRes, regionsRes, groupsRes, updatesRes] = await Promise.all([
      getElectionById(id),
      getRegions({ limit: 100 }),
      getElectionGroups(id),
      getElectionUpdates(id)
    ]);
    
    election = electionRes;
    regions = regionsRes.regions;
    groups = groupsRes;
    updates = updatesRes;
  } catch {
    notFound();
  }

  return (
    <ElectionTabs 
      electionForm={<ElectionForm initialData={election} regions={regions} />}
      groupsList={<GroupsList electionId={id} groups={groups} />}
      liveUpdatesList={<LiveUpdatesList electionId={id} updates={updates} />}
    />
  );
}

export default async function ElectionDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Manage Election</h1>
        <p className="page-subtitle">Configure groups, candidates, and post live updates.</p>
      </div>

      <Suspense fallback={<div className="cms-card h-96 animate-pulse bg-surface-container-low rounded-xl border border-outline-variant" />}>
        <ElectionDetailContent id={id} />
      </Suspense>
    </AnimatedPage>
  );
}
