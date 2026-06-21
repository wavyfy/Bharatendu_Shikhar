import { notFound } from "next/navigation";
import Image from "next/image";
import { getElectionBySlug } from "@/utils/fetchElections";
import { fetchRelatedArticles } from "@/utils/fetchData";
import { ElectionResultsTabbed } from "@/features/elections/components/ElectionResultsTabbed";

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

interface Update {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Article {
  id: string | number;
  slug: string;
  title: string;
  featured_image?: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const election = await getElectionBySlug(slug);
  if (!election) return { title: "Not Found | Bharatendu Shikhar" };

  return {
    title: `${election.title} | Bharatendu Shikhar`,
    description: election.description || `Live updates and results for ${election.title}.`,
  };
}

export default async function ElectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const election = await getElectionBySlug(slug);

  if (!election) {
    notFound();
  }

  const { regionArticles } = await fetchRelatedArticles(null, election.region_id);

  // Data processing for the new layout
  const sortedGroups = election.groups.map((group: Group) => ({
    ...group,
    candidates: [...group.candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0))
  }));

  const allCandidates = sortedGroups.flatMap((g: Group) => g.candidates);
  
  // Find top leaders across the entire election
  const topLeaders = [...allCandidates]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 4);

  // Summary statistics
  const totalGroups = sortedGroups.length;
  const totalVotesCast = allCandidates.reduce((sum: number, c: Candidate) => sum + (c.votes || 0), 0);
  const declaredGroups = sortedGroups.filter((g: Group) => g.candidates.some(c => c.is_winner)).length;
  const pendingGroups = totalGroups - declaredGroups;

  // Party Standings Calculation
  interface PartyStanding {
    party_name: string;
    party_symbol_url: string | null;
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
        partyMap.set(pName, { party_name: pName, party_symbol_url: candidate.party_symbol_url || null, won: 0, leading: 0, votes: 0 });
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-12 shadow-sm">
        {election.featured_image_url && (
          <div className="w-full h-[300px] md:h-[400px] overflow-hidden bg-muted relative">
            <Image 
              src={election.featured_image_url} 
              alt={election.title} 
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            {election.status === "live" ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                LIVE ELECTION
              </span>
            ) : election.status === "upcoming" ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                UPCOMING
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                COMPLETED
              </span>
            )}
            {election.region && (
              <span className="text-sm text-muted-foreground font-semibold uppercase tracking-widest">{election.region.name}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">{election.title}</h1>
          {election.description && (
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">{election.description}</p>
          )}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-foreground">
            {election.voting_date && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-muted-foreground">calendar_month</span>
                <span>Voting: {new Date(election.voting_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
            )}
            {election.result_date && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-muted-foreground">analytics</span>
                <span>Results: {new Date(election.result_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Leaders Section */}
      {topLeaders.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
            <h2 className="text-xl font-bold text-foreground">Top Leaders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {topLeaders.map((leader: Candidate, idx: number) => {
              // Simple heuristic for leading: if they are the first in their group or have a winner flag
              // Since we don't know exactly which group they are from without finding it, we can just assume 
              // the top 4 overall are leading or we can find their group.
              const group = sortedGroups.find((g: Group) => g.candidates.some(c => c.id === leader.id));
              const isActuallyLeading = group?.candidates[0].id === leader.id && leader.votes! > 0;
              const badgeStatus = leader.is_winner ? "WON" : isActuallyLeading ? "LEADING" : "TRAILING";
              
              return (
                <div key={leader.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 shrink-0 relative rounded overflow-hidden bg-muted">
                      {leader.photo_url ? (
                        <Image src={leader.photo_url} alt={leader.candidate_name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-muted-foreground">person</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight mb-1">{leader.candidate_name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{leader.party_name || "Independent"}</p>
                      <p className="text-xs font-mono font-bold text-foreground mt-1">{(leader.votes || 0).toLocaleString()} votes</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-3 border-t border-border">
                    <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded ${
                      badgeStatus === "WON" ? "bg-green-100 text-green-700" :
                      badgeStatus === "LEADING" ? "bg-red-600 text-white" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {badgeStatus}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground truncate max-w-[100px] text-right" title={group?.title}>
                      in {group?.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Live Updates */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Summary Box */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-1">{election.title}</h2>
            <p className="text-sm text-muted-foreground mb-6 pb-4 border-b border-border">Election Overview</p>
            
            <div className="flex gap-8 mb-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Groups</p>
                <p className="text-3xl font-black text-red-600">{totalGroups}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Votes</p>
                <p className="text-3xl font-black text-foreground">{totalVotesCast.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-muted/30 rounded-lg p-3 border border-border/50">
              <div className="text-center px-2 border-r border-border/50 flex-1">
                <p className="text-lg font-bold text-foreground mb-0">{declaredGroups}</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-[10px] text-muted-foreground uppercase">Declared</p>
                </div>
              </div>
              <div className="text-center px-2 flex-1">
                <p className="text-lg font-bold text-foreground mb-0">{pendingGroups}</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <p className="text-[10px] text-muted-foreground uppercase">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Party Standings Box */}
          {partyStandings.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 border-b border-border pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                Party Standings
              </h2>
              <div className="space-y-4">
                {partyStandings.slice(0, 5).map((party, idx) => (
                  <div key={party.party_name} className="flex items-center justify-between p-2 -mx-2 rounded hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-5 font-mono text-muted-foreground text-xs font-bold text-center">#{idx + 1}</div>
                      {party.party_symbol_url ? (
                        <Image src={party.party_symbol_url} alt="" width={24} height={24} className="object-contain" unoptimized />
                      ) : (
                        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-muted-foreground">P</span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm text-foreground leading-tight max-w-[120px] truncate" title={party.party_name}>
                          {party.party_name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">{party.votes.toLocaleString()} votes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-center shrink-0">
                      {party.won > 0 && (
                        <div>
                          <p className="text-sm font-black text-green-600 leading-none">{party.won}</p>
                          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Won</p>
                        </div>
                      )}
                      {party.leading > 0 && (
                        <div>
                          <p className="text-sm font-black text-red-500 leading-none">{party.leading}</p>
                          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Lead</p>
                        </div>
                      )}
                      {party.won === 0 && party.leading === 0 && (
                        <div>
                          <p className="text-sm font-black text-muted-foreground leading-none">-</p>
                          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Total</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Updates */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">sensors</span>
              Live Updates
            </h2>
            
            {election.updates.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center">No live updates currently available.</p>
            ) : (
              <div className="relative border-l-2 border-muted ml-3 space-y-6 pl-5 pb-2">
                {election.updates.map((update: Update, index: number) => (
                  <div key={update.id} className="relative">
                    <div className={`absolute w-2.5 h-2.5 rounded-full left-[-26px] top-1.5 ${index === 0 ? 'bg-red-500 animate-pulse ring-4 ring-red-500/20' : 'bg-primary'}`} />
                    <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                      {new Date(update.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1 leading-tight">{update.title}</h4>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{update.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Tabbed Results */}
        <div className="lg:col-span-2">
          <ElectionResultsTabbed groups={sortedGroups} />
        </div>

      </div>

      {/* Related News */}
      {regionArticles && regionArticles.length > 0 && (
        <div className="mt-20 pt-10 border-t border-border">
          <h2 className="text-2xl font-black mb-8 border-b-2 border-primary pb-2 inline-block">Related News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {regionArticles.slice(0, 4).map((article: Article) => (
              <a key={article.id} href={`/article/${article.slug}`} className="group flex flex-col gap-3">
                {article.featured_image ? (
                  <div className="aspect-4/3 w-full overflow-hidden bg-muted rounded-xl relative">
                    <Image 
                      src={article.featured_image.startsWith('http') ? article.featured_image : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${article.featured_image}`} 
                      alt={article.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="aspect-4/3 w-full bg-muted rounded-xl" />
                )}
                <h3 className="font-playfair font-bold text-lg leading-tight group-hover:text-red-600 transition-colors line-clamp-3">
                  {article.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
