import { notFound } from "next/navigation";
import { PublisherForm } from "@/features/publishers/components/PublisherForm";
import { getPublisherById } from "@/features/publishers/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Edit Publisher | Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPublisherPage({ params }: Props) {
  const { id } = await params;
  const publisher = await getPublisherById(id);

  if (!publisher) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <PublisherForm initialData={publisher} />
    </div>
  );
}
