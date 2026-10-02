import Image from "next/image";
import Link from "next/link";
import { fetchAdsForSlot } from "@/utils/fetchAdvertisements";

export async function Advertisement({
  slotId,
  orientation = "horizontal",
  position = "left",
  stickyTop = "top-15",
  className = "",
}: {
  slotId: string;
  orientation?: "horizontal" | "vertical";
  position?: "left" | "right";
  stickyTop?: string;
  className?: string;
}) {
  const ad = await fetchAdsForSlot(slotId);

  if (!ad) {
    return null; 
  }

  const containerClass = `${
    orientation === "horizontal"
      ? "w-full"
      : "w-full h-auto mx-auto block"
  }`;

  const adImage = (
    <Image 
      src={ad.image_url} 
      alt={ad.title || "Advertisement"} 
      width={0}
      height={0}
      sizes="(max-width: 1024px) 100vw, 250px"
      className="w-full h-auto max-h-[80vh] object-contain rounded transition-all duration-300"
      style={{ width: '100%', height: 'auto' }}
    />
  );

  const adNode = ad.redirect_url ? (
    <Link href={ad.redirect_url} target="_blank" rel="noopener noreferrer" className={containerClass}>
      {adImage}
    </Link>
  ) : (
    <div className={containerClass}>
      {adImage}
    </div>
  );

  if (orientation === "vertical") {
    const borderClass = position === "right" 
      ? "border-l-2 border-gray-300 dark:border-news-border lg:pl-6" 
      : "border-r-2 border-gray-300 dark:border-news-border lg:pr-6";

    return (
      <div className={`hidden lg:block w-32 xl:w-40 2xl:w-48 shrink-0 sticky ${stickyTop} mt-8 ${borderClass} ${className}`}>
        {adNode}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {adNode}
    </div>
  );
}
