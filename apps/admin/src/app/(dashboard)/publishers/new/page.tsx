import { PublisherForm } from "@/features/publishers/components/PublisherForm";

export const metadata = {
  title: "New Publisher | Admin",
};

export default function NewPublisherPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-playfair tracking-tight">Create Publisher</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new publisher account with access to the CMS.</p>
      </div>

      <PublisherForm />
    </div>
  );
}
