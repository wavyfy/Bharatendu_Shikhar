import { notFound } from "next/navigation";

import { getElectionBySlug } from "@/utils/fetchElections";
import { ElectionResultsTabbed } from "@/components/elections/ElectionResultsTabbed";
import { DialChart } from "@/components/elections/DialChart";
import { UpdatesTimeline } from "@/components/elections/UpdatesTimeline";
import { TopLeadersCarousel } from "@/components/elections/TopLeadersCarousel";


import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface Candidate {
  id: string;
  candidate_name: string;
  party_name?: string | null;
  party_symbol_url?: string | null;
  photo_url?: string | null;
  votes?: number;
  is_winner?: boolean;
}

interface Group {
  id: string;
  title: string;
  candidates: Candidate[];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const election = await getElectionBySlug(slug);
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();

  if (!election) return { title: "Not Found | Bharatendu Shikhar" };

  const title = election.title || settings?.meta_title || "Bharatendu Shikhar";
  const description = election.description || settings?.meta_description || `Live updates and results for ${title}.`;

  return {
    title: `${title} | Bharatendu Shikhar`,
    description,
    alternates: {
      canonical: `${siteUrl}/elections/${slug}`,
    },
    openGraph: {
      title: `${title} | Bharatendu Shikhar`,
      description,
      url: `${siteUrl}/elections/${slug}`,
      type: "website",
      images: settings?.og_image_url ? [settings.og_image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Bharatendu Shikhar`,
      description,
    },
  };
}

export default async function ElectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const election = await getElectionBySlug(slug);

  if (!election) {
    notFound();
  }

  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();

  const breadcrumbs = [
    { label: "होम", href: "/" },
    { label: "चुनाव", href: "/elections" },
    { label: election.title }
  ];  // Data processing for the new layout
  const sortedGroups = election.groups.map((group: Group) => ({
    ...group,
    candidates: [...group.candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0))
  }));

  const allCandidates = sortedGroups.flatMap((g: Group) => g.candidates);
  
  // Find top leaders across the entire election (deduplicated by candidate name since we copied candidates)
  const uniqueCandidatesMap = new Map();
  [...allCandidates]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .forEach(candidate => {
      if (!uniqueCandidatesMap.has(candidate.candidate_name)) {
        uniqueCandidatesMap.set(candidate.candidate_name, candidate);
      }
    });
  const topLeaders = Array.from(uniqueCandidatesMap.values()).slice(0, 4);

  // Summary statistics
  const totalGroups = sortedGroups.length;
  const majority = Math.floor(totalGroups / 2) + 1;

  // Party Standings Calculation
  interface PartyStanding {
    party_name: string;
    won: number;
    leading: number;
    votes: number;
  }
  
  const partyMap = new Map<string, PartyStanding>();

  sortedGroups.forEach((group: Group) => {
    // Top candidate in this group is leading
    const leadingCandidate = group.candidates.length > 0 && (group.candidates[0].votes || 0) > 0 ? group.candidates[0] : null;

    group.candidates.forEach((candidate: Candidate) => {
      const pName = candidate.party_name || "Independent";
      if (!partyMap.has(pName)) {
        partyMap.set(pName, { party_name: pName, won: 0, leading: 0, votes: 0 });
      }
      const pStats = partyMap.get(pName)!;
      pStats.votes += (candidate.votes || 0);
      if (candidate.is_winner) {
        pStats.won += 1;
      } else if (leadingCandidate && leadingCandidate.id === candidate.id) {
        pStats.leading += 1;
      }
    });
  });

  const partyStandings = Array.from(partyMap.values()).sort((a, b) => {
    const aTotal = a.won + a.leading;
    const bTotal = b.won + b.leading;
    if (bTotal !== aTotal) return bTotal - aTotal;
    return b.votes - a.votes;
  });

  // Top Party for Dial Chart
  const topParty = partyStandings.length > 0 ? partyStandings[0] : null;
  const leadingSeats = topParty ? topParty.won + topParty.leading : 0;
  // Let's sum up all leading/won across all parties:
  const totalWonOrLeading = partyStandings.reduce((sum, p) => sum + p.won + p.leading, 0);
  const losingSeats = totalWonOrLeading - leadingSeats;
  const yetToWin = totalGroups - leadingSeats - losingSeats;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
      <Breadcrumbs items={breadcrumbs} siteUrl={siteUrl} />
      {/* 1. Header Box */}
      <div className="bg-card border-2 border-gray-200 dark:border-news-border rounded-sm p-8 mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-red-600 text-white mb-4">
            राज्य चुनाव अपडेट
          </span>
          <h1 className="text-4xl font-medium text-foreground mb-2">{election.title}</h1>
          {election.description && (
            <p className="text-base text-red-500 max-w-2xl">{election.description}</p>
          )}
        </div>
        {election.voting_date && (
          <div className="text-base font-medium text-foreground whitespace-nowrap">
            {new Date(election.voting_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>

      {/* 2. Updates & Party Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Live Updates Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-card border-2 border-gray-200 dark:border-news-border rounded-sm h-[420px] flex flex-col">
            <div className="p-5 border-b border-gray-200 dark:border-news-border shrink-0">
              <h2 className="text-base font-medium flex items-center gap-3">
                <span className="text-red-600 uppercase border border-red-200 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold">लाइव</span>
                <span className="text-foreground border-l border-gray-600 pl-3">सेंसर चुनाव अपडेट</span>
              </h2>
            </div>
            <div className="p-0 flex-1 overflow-y-auto custom-scrollbar">
              <UpdatesTimeline updates={election.updates} />
            </div>
          </div>
        </div>

        {/* Party Standings Box */}
        <div className="lg:col-span-1">
          <div className="bg-card border-2 border-gray-200 dark:border-news-border rounded-sm p-6 h-[420px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-news-border pb-4 shrink-0">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-red-600 text-white">
                पार्टी की स्थिति
              </span>
              <span className="text-red-600 uppercase border border-red-200 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold">लाइव</span>
            </div>
            
            <div className="flex justify-between text-xs font-bold text-foreground mb-4 shrink-0">
              <span>पार्टियां</span>
              <span className="w-16 text-center">स्थिति</span>
            </div>
            
            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {partyStandings.slice(0, 3).map((party, idx) => {
                const positionText = idx === 0 ? "LEAD" : idx === 1 ? "SECOND" : "THIRD";
                return (
                  <div key={party.party_name} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-foreground leading-relaxed mb-1">
                        {party.party_name}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">{party.votes.toLocaleString()} वोट</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16">
                      <span className="text-2xl font-bold text-red-600 leading-none mb-1.5">{party.won + party.leading}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">{positionText}</span>
                    </div>
                  </div>
                );
              })}
              {partyStandings.length === 0 && (
                <p className="text-xs text-muted-foreground italic">अभी तक कोई डेटा नहीं।</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Leaders Section */}
      <div className="mb-12 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-medium text-foreground">शीर्ष नेता</h2>
        </div>
        <TopLeadersCarousel topLeaders={topLeaders} sortedGroups={sortedGroups} />
      </div>

      {/* 4. Main Content Split (Dial Chart & Tabs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Dial Chart */}
        <div className="lg:col-span-1">
          <div className="bg-card border-2 border-gray-200 dark:border-news-border rounded-sm h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-news-border">
              <h2 className="text-base font-medium flex items-center gap-1 mb-1 text-foreground">
                {election.region ? election.region.name : "ग्लोबल"}
              </h2>
              <p className="text-sm text-foreground">चुनाव परिणाम 2026</p>
            </div>
            <div className="p-0 flex-1">
              <DialChart 
                totalSeats={totalGroups} 
                majority={majority}
                leadingSeats={leadingSeats}
                losingSeats={losingSeats}
                yetToWin={yetToWin}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Results */}
        <div className="lg:col-span-2">
          <ElectionResultsTabbed groups={sortedGroups} />
        </div>

      </div>

    </div>
  );
}
