import { notFound } from "next/navigation";
import { PublisherForm } from "@/features/publishers/components/PublisherForm";
import { getPublisherById } from "@/features/publishers/queries";

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-playfair tracking-tight">Edit Publisher</h1>
        <p className="text-sm text-gray-500 mt-1">Manage publisher profile, email, and access state.</p>
      </div>

      <PublisherForm initialData={publisher} />
    </div>
  );
}
