import { Suspense } from "react";
import { PublisherForm } from "@/features/publishers/components/PublisherForm";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "New Publisher | Admin",
};

async function NewPublisherContent() {
  return (
    <div className="animate-in fade-in duration-300">
      <PublisherForm />
    </div>
  );
}

export default function NewPublisherPage() {
  return (
    <AnimatedPage className="space-y-6 max-w-2xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="page-title">New Publisher</h1>
        <p className="page-subtitle">Onboard a new publishing partner.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <NewPublisherContent />
      </Suspense>
    </AnimatedPage>
  );
}
