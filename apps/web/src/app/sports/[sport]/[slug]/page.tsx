import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ArrowRight } from "lucide-react";
import { getCompetitionBySlug } from "@/utils/fetchSports";
import { fetchTickerArticles } from "@/utils/fetchData";
import { PointsTable } from "@/components/sports/PointsTable";
import { MatchTabs } from "@/components/sports/MatchTabs";

interface PageProps {
  params: Promise<{ sport: string; slug: string }>;
}

interface ArticleItem {
  id: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  seo_description?: string;
  featured_image?: string;
  categories?: { slug: string };
}

interface MatchData {
  id: string;
  slug: string;
  status: string;
  home_team?: { name: string; logo_url?: string };
  home_team_name?: string;
  away_team?: { name: string; logo_url?: string };
  away_team_name?: string;
  match_number?: string | number;
  match_date?: string;
  venue?: string;
  home_score?: string | number;
  away_score?: string | number;
  stage?: string;
  live_status_text?: string;
  result_text?: string;
}

export default async function CompetitionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getCompetitionBySlug(slug);
  if (!result) notFound();

  const { competition, matches, pointsTable } = result;

  // News
  const news = await fetchTickerArticles();
  const sportsNews = news.filter((article: ArticleItem) => article.categories?.slug === "sports");
  const displayNews = sportsNews.slice(0, 4);

  // Identify Live Match or next Upcoming Match for Hero
  const liveMatch = (matches as MatchData[]).find((m) => m.status === "live");
  const upcomingMatch = (matches as MatchData[]).find((m) => m.status === "upcoming");
  const heroMatch = liveMatch || upcomingMatch || matches[0];

  // Unique Teams
  const uniqueTeamsMap = new Map();
  matches.forEach((m: MatchData) => {
    if (m.home_team?.name) uniqueTeamsMap.set(m.home_team.name, m.home_team.logo_url);
    if (m.away_team?.name) uniqueTeamsMap.set(m.away_team.name, m.away_team.logo_url);
  });

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Header Component (Left) */}
          <div className="lg:w-2/3 relative rounded-3xl overflow-hidden bg-slate-900 flex items-end md:items-center min-h-[340px] md:min-h-0 p-6 sm:p-8 shadow-sm">
            {competition.banner_url && (
              <>
                <Image src={competition.banner_url} alt="Banner" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/90 via-black/50 to-transparent md:to-black/10" />
              </>
            )}
            
            <div className="relative z-10 w-full flex flex-col items-center md:items-start text-center md:text-left mt-auto md:mt-0">
              <div className="flex flex-col items-center md:items-start gap-3 md:gap-4">
                {competition.logo_url && (
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center p-2 shadow-sm overflow-hidden shrink-0">
                    <Image src={competition.logo_url} alt={competition.title} width={52} height={52} className="object-contain" unoptimized />
                  </div>
                )}
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-sm tracking-tight font-serif font-bold">
                  {competition.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-white font-medium">
                  {competition.competition_type && (
                    <span className="bg-black/30 backdrop-blur-sm border border-white/10 text-white px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-bold shadow-sm">
                      {competition.competition_type}
                    </span>
                  )}
                  {competition.season && <span className="font-bold tracking-wide text-sm">{competition.season}</span>}
                  {competition.start_date && competition.end_date && (
                    <span className="opacity-90 text-sm">
                      {new Date(competition.start_date).toLocaleDateString()} - {new Date(competition.end_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <p className="text-white/90 max-w-2xl mt-1 text-xs md:text-sm leading-relaxed">
                  {competition.title} टूर्नामेंट कवरेज जिसमें लाइव मैच, परिणाम, शेड्यूल और अंक तालिका शामिल हैं।
                </p>
              </div>
            </div>
          </div>

          {/* Live Match Component (Right) */}
          <div className="lg:w-1/3 bg-news-card rounded-3xl p-6 shadow-sm border border-news-border flex flex-col relative">
            {heroMatch ? (
              <>
                <div className="text-center mb-5">
                  <h3 className="text-lg font-serif text-news-text">लाइव मैच</h3>
                  {heroMatch.status === 'live' && (
                    <span className="text-green-600 font-bold text-[10px] uppercase tracking-widest mt-0.5 block">Live</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-6 px-2">
                  {heroMatch.home_team?.logo_url ? (
                    <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <Image src={heroMatch.home_team.logo_url} alt={heroMatch.home_team_name || "Home"} width={40} height={40} className="object-contain w-full h-full" unoptimized />
                    </div>
                  ) : <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />}
                  
                  <div className="bg-indigo-50/70 text-indigo-900 font-bold text-base px-4 py-1.5 rounded-full shrink-0">
                    {heroMatch.home_score || '0/0'} - {heroMatch.away_score || '—'}
                  </div>
                  
                  {heroMatch.away_team?.logo_url ? (
                    <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <Image src={heroMatch.away_team.logo_url} alt={heroMatch.away_team_name || "Away"} width={40} height={40} className="object-contain w-full h-full" unoptimized />
                    </div>
                  ) : <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />}
                </div>
                
                <div className="flex-1 flex flex-col gap-3.5">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-news-text-secondary">मैच</span>
                    <span className="text-news-text font-semibold">{heroMatch.match_number || 'टीबीए'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-news-text-secondary">स्टेज</span>
                    <span className="text-news-text font-semibold">{heroMatch.stage || 'ग्रुप स्टेज'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-news-text-secondary">स्थान</span>
                    <span className="text-news-text font-semibold">{heroMatch.venue || 'टीबीए'}</span>
                  </div>
                  
                  <hr className="border-news-border my-1" />
                  
                  <div className="w-full">
                    <div className="bg-[#e4002b] text-white text-[11px] font-medium px-4 py-2 rounded-full w-full text-center shadow-sm">
                      {heroMatch.live_status_text || heroMatch.result_text || 'मैच अपडेट जल्द ही उपलब्ध होंगे'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-news-text-secondary h-full min-h-[150px]">
                <h3 className="font-bold text-news-text mb-2">कोई सक्रिय मैच नहीं</h3>
                <p className="text-sm">आगामी खेलों के लिए शेड्यूल देखें</p>
              </div>
            )}
          </div>
          
        </div>

        {/* Points Table Section */}
        {pointsTable.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-news-text">अंक तालिका</h2>
            </div>
            
            <div className="bg-news-card rounded-3xl p-6 shadow-sm border border-news-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-news-text">
                  {competition.logo_url && <Image src={competition.logo_url} alt="Logo" width={24} height={24} className="rounded-full" unoptimized />}
                  <span>{competition.title}</span>
                </div>
                <Link href="/sports/competitions" className="flex items-center gap-1 text-sm text-news-text-secondary hover:text-primary transition-colors">
                  सभी देखें <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <PointsTable entries={pointsTable} sport={competition.sport} />
            </div>
          </section>
        )}

        {/* Football Match Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">⚽</span>
            <h2 className="text-xl font-bold text-news-text capitalize">{competition.sport} मैच</h2>
          </div>
          <MatchTabs matches={matches} />
        </section>



        {/* News Section */}
        {displayNews.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">📰</span>
              <h2 className="text-xl font-bold text-news-text">खेल समाचार</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayNews.map((article: ArticleItem) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="group flex flex-col gap-3">
                  <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-3 bg-news-card">
                    {article.featured_image && (
                      <Image src={article.featured_image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <h3 className="font-semibold text-[15px] leading-snug text-news-text line-clamp-2 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                    <p className="text-[13px] text-gray-500 line-clamp-2 mt-1">{article.excerpt || article.seo_description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
