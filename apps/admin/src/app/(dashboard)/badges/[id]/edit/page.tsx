import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { BadgeFormPlaceholder } from "@/features/badges/components/BadgeFormPlaceholder";
import { getBadgeById } from "@/features/badges/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Edit Badge | Bharatendu Shikhar",
};

interface EditBadgePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBadgePage({ params }: EditBadgePageProps) {
  const resolvedParams = await params;
  const badgeId = parseInt(resolvedParams.id, 10);

  if (isNaN(badgeId)) redirect("/badges");

  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/");

  const badge = await getBadgeById(badgeId);
  if (!badge) redirect("/badges");

  return (
    <AnimatedPage className="space-y-6">
      <BadgeFormPlaceholder initialData={badge} />
    </AnimatedPage>
  );
}
