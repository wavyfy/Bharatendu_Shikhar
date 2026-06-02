import { PublisherForm } from "@/features/publishers/components/PublisherForm";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "New Publisher | Admin",
};

export default function NewPublisherPage() {
  return <PublisherForm />;
}
