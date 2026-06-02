import { EpaperForm } from "@/features/epapers/components/EpaperForm";
import { getRegions } from "@/features/regions/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Upload E-Paper | Bharatendu Shikhar Admin" };

export default async function NewEpaperPage() {
  const { regions } = await getRegions();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <EpaperForm regions={regions} />
    </div>
  );
}
