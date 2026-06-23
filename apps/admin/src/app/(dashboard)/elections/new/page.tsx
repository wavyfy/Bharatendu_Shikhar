import { Suspense } from "react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { ElectionForm } from "@/features/elections/components/ElectionForm";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Create Election | Bharatendu Shikhar Admin" };

import { ElectionTabs } from "@/features/elections/components/ElectionTabs";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Prepares the election creation interface with fetched regions and placeholder content.
 *
 * @returns An ElectionTabs component containing the election form with regions, and placeholder content for groups and live updates.
 */
async function CreateElectionContent() {
  const { regions } = await getRegions({ limit: 100 });

  const placeholderGroups = (
    <div className="p-8">
      <EmptyState 
        title="Election Not Created Yet" 
        description="Please fill out and save the General Settings first to create the election before adding groups and candidates." 
      />
    </div>
  );

  const placeholderUpdates = (
    <div className="p-8">
      <EmptyState 
        title="Election Not Created Yet" 
        description="Please fill out and save the General Settings first to create the election before posting live updates." 
      />
    </div>
  );

  return (
    <ElectionTabs 
      electionForm={<ElectionForm regions={regions} />}
      groupsList={placeholderGroups}
      liveUpdatesList={placeholderUpdates}
    />
  );
}

/**
 * Displays the election creation page with form and placeholder sections.
 *
 * @returns The election creation page component.
 */
export default function CreateElectionPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Create Election</h1>
        <p className="page-subtitle">Setup a new generic election module.</p>
      </div>

      <Suspense fallback={<div className="cms-card h-96 animate-pulse bg-surface-container-low rounded-xl border border-outline-variant" />}>
        <CreateElectionContent />
      </Suspense>
    </AnimatedPage>
  );
}
