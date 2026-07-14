import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TeamForm } from "@/features/sports/teams/components/TeamForm";
import { getTeamById } from "@/features/sports/teams/queries";

export const metadata = { title: "Edit Team | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

async function EditTeamContent({ id }: { id: string }) {
  let team;
  try {
    team = await getTeamById(id);
  } catch {
    notFound();
  }
  return (
    <div className="cms-card p-6">
      <TeamForm initialData={team} />
    </div>
  );
}

export default async function EditTeamPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Edit Team</h1>
        <p className="page-subtitle">Update team details.</p>
      </div>
      <Suspense fallback={<div className="cms-card h-64 animate-pulse bg-surface-container-low rounded-xl border border-outline-variant" />}>
        <EditTeamContent id={id} />
      </Suspense>
    </AnimatedPage>
  );
}
