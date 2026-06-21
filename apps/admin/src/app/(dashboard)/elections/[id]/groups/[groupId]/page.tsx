import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { CandidatesList } from "@/features/elections/components/CandidatesList";
import { getElectionCandidates } from "@/features/elections/queries";
import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";

export const metadata = { title: "Manage Candidates | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string; groupId: string }>;
}

async function getGroupDetails(groupId: string) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data, error } = await supabase
    .from("election_groups")
    .select("*, election:elections(title)")
    .eq("id", groupId)
    .single();

  if (error || !data) throw new Error("Group not found");
  return data;
}

async function CandidatesContent({ id, groupId }: { id: string, groupId: string }) {
  let group;
  let candidates;
  
  try {
    group = await getGroupDetails(groupId);
    candidates = await getElectionCandidates(groupId);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
        <Link href={`/elections/${id}`} className="hover:text-primary transition-colors">
          {group.election.title}
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-medium text-on-surface">{group.title}</span>
      </div>

      <section className="cms-card">
        <div className="cms-card-header border-b border-outline-variant">
          <h2 className="text-lg font-bold text-on-surface">Candidates: {group.title}</h2>
        </div>
        <div className="p-6">
          <CandidatesList groupId={groupId} electionId={id} candidates={candidates} />
        </div>
      </section>
    </div>
  );
}

export default async function CandidatesPage({ params }: PageProps) {
  const { id, groupId } = await params;

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/elections/${id}`} className="p-2 rounded-full hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="page-title">Manage Candidates</h1>
          <p className="page-subtitle">Add and configure candidates for this group.</p>
        </div>
      </div>

      <Suspense fallback={<div className="cms-card h-96 animate-pulse bg-surface-container-low rounded-xl border border-outline-variant" />}>
        <CandidatesContent id={id} groupId={groupId} />
      </Suspense>
    </AnimatedPage>
  );
}
