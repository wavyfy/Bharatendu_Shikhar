import { EpaperForm } from "@/features/epapers/components/EpaperForm";
import { getRegions } from "@/features/regions/queries";

export const metadata = { title: "Upload E-Paper | Bharatendu Shikhar Admin" };

export default async function NewEpaperPage() {
  const { regions } = await getRegions();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#111]">Upload E-Paper</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload a new PDF digital edition</p>
      </div>

      <EpaperForm regions={regions} />
    </div>
  );
}
