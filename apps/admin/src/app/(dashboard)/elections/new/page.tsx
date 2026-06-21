import { Suspense } from "react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { ElectionForm } from "@/features/elections/components/ElectionForm";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Create Election | Bharatendu Shikhar Admin" };

async function CreateElectionContent() {
  const { regions } = await getRegions({ limit: 100 });

  return (
    <div className="cms-card">
      <div className="p-6">
        <ElectionForm regions={regions} />
      </div>
    </div>
  );
}

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
