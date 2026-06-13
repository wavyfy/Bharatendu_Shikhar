import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { BadgeFormPlaceholder } from "@/features/badges/components/BadgeFormPlaceholder";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "New Badge | Bharatendu Shikhar",
};

export default async function NewBadgePage() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/");

  return (
    <AnimatedPage className="space-y-6">
      <BadgeFormPlaceholder />
    </AnimatedPage>
  );
}
