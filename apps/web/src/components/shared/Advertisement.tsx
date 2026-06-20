import Image from "next/image";
import Link from "next/link";
import { fetchAdsForSlot } from "@/utils/fetchAdvertisements";

export async function Advertisement({
  slotId,
  orientation = "horizontal",
  className = "",
}: {
  slotId: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const ad = await fetchAdsForSlot(slotId);

  if (!ad) {
    return null; 
  }

  const containerClass = `${
    orientation === "horizontal"
      ? "w-full"
      : "w-full max-w-[160px] mx-auto"
  } block ${className}`;

  const adImage = (
    <Image 
      src={ad.image_url} 
      alt={ad.title || "Advertisement"} 
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
    />
  );

  return ad.redirect_url ? (
    <Link href={ad.redirect_url} target="_blank" rel="noopener noreferrer" className={containerClass}>
      {adImage}
    </Link>
  ) : (
    <div className={containerClass}>
      {adImage}
    </div>
  );
}
