import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { ElectionForm } from "@/features/elections/components/ElectionForm";
import { GroupsList } from "@/features/elections/components/GroupsList";
import { LiveUpdatesList } from "@/features/elections/components/LiveUpdatesList";
import { getElectionById, getElectionGroups, getElectionUpdates } from "@/features/elections/queries";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Manage Election | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ElectionDetailContent({ id }: { id: string }) {
  let election;
  let regions;
  let groups;
  let updates;

  try {
    election = await getElectionById(id);
    const regionsRes = await getRegions({ limit: 100 });
    regions = regionsRes.regions;
    groups = await getElectionGroups(id);
    updates = await getElectionUpdates(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Election Information */}
      <section className="cms-card">
        <div className="cms-card-header border-b border-outline-variant">
          <h2 className="text-lg font-bold text-on-surface">Election Details</h2>
        </div>
        <div className="p-6">
          <ElectionForm initialData={election} regions={regions} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Groups Management */}
        <section className="cms-card flex flex-col min-h-[400px]">
          <div className="cms-card-header border-b border-outline-variant">
            <h2 className="text-lg font-bold text-on-surface">Groups Management</h2>
          </div>
          <div className="p-0 flex-1">
            <GroupsList electionId={id} groups={groups} />
          </div>
        </section>

        {/* Live Updates */}
        <section className="cms-card flex flex-col min-h-[400px]">
          <div className="cms-card-header border-b border-outline-variant">
            <h2 className="text-lg font-bold text-on-surface">Live Updates</h2>
          </div>
          <div className="p-0 flex-1">
            <LiveUpdatesList electionId={id} updates={updates} />
          </div>
        </section>
      </div>
    </div>
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
