import Link from "next/link";
import Image from "next/image";
import { Vote, Calendar, BarChart2 } from "lucide-react";
import { getElections } from "@/utils/fetchElections";
import { fetchNavbarData } from "@/utils/fetchData";

import { RegionSelect } from "./RegionSelect";

export const metadata = {
  title: "चुनाव | भारतेंदु शिखर",
  description: "आगामी और पिछले चुनावों के लाइव अपडेट, परिणाम और जानकारी।",
};

export default async function ElectionsListingPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const params = await searchParams;
  const regionId = params?.region;

  const [elections, { regions }] = await Promise.all([
    getElections({ regionId }),
    fetchNavbarData()
  ]);

  interface Election {
    id: string;
    slug: string;
    title: string;
    status: string;
    featured_image_url?: string | null;
    description?: string | null;
    voting_date?: string | null;
    result_date?: string | null;
    region?: { name: string } | null;
  }

  const typedElections = elections as unknown as Election[];
  const liveElections = typedElections.filter(e => e.status === "live");
  const upcomingElections = typedElections.filter(e => e.status === "upcoming");
  const completedElections = typedElections.filter(e => e.status === "completed");

  const ElectionCard = ({ election }: { election: Election }) => (
    <Link href={`/elections/${election.slug}`} className="flex flex-col border-2 border-gray-200 dark:border-news-border rounded-sm overflow-hidden hover:shadow-md transition-shadow bg-card group">
      {election.featured_image_url ? (
        <div className="aspect-video w-full overflow-hidden bg-muted relative">
          <Image 
            src={election.featured_image_url} 
            alt={election.title} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <Vote className="w-12 h-12 text-muted-foreground/30" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {election.status === "live" ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
              लाइव
            </span>
          ) : election.status === "upcoming" ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              आगामी
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              संपन्न
            </span>
          )}
          {election.region && (
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{election.region.name}</span>
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">{election.title}</h3>
        {election.description && (
          <p className="text-sm text-muted-foreground/80 dark:text-gray-400 leading-relaxed line-clamp-3 mb-5">{election.description}</p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-news-border flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {election.voting_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>मतदान: {new Date(election.voting_date).toLocaleDateString()}</span>
            </div>
          )}
          {election.result_date && (
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>परिणाम: {new Date(election.result_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">चुनाव</h1>
          <p className="text-muted-foreground">लाइव अपडेट, परिणाम और कवरेज।</p>
        </div>
        
        {/* Region Filter */}
        <div className="w-full md:w-auto">
          <RegionSelect regions={regions} defaultRegionId={regionId || ""} />
        </div>
      </div>

      {elections.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-sm border border-dashed border-gray-200 dark:border-news-border">
          <p className="text-muted-foreground">कोई चुनाव नहीं मिला।</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Live Elections */}
          {liveElections.length > 0 && (
            <section>
              <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                अभी लाइव
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveElections.map(e => <ElectionCard key={e.id} election={e} />)}
              </div>
            </section>
          )}

          {/* Upcoming Elections */}
          {upcomingElections.length > 0 && (
            <section>
              <h2 className="text-xl font-medium mb-4 text-foreground">आगामी चुनाव</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingElections.map(e => <ElectionCard key={e.id} election={e} />)}
              </div>
            </section>
          )}

          {/* Completed Elections */}
          {completedElections.length > 0 && (
            <section>
              <h2 className="text-xl font-medium mb-4 text-foreground">पिछले चुनाव</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedElections.map(e => <ElectionCard key={e.id} election={e} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
