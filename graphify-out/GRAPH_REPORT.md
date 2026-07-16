# Graph Report - Bhartendu_Shikhar  (2026-07-16)

## Corpus Check
- 338 files · ~101,979 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1701 nodes · 3828 edges · 94 communities (83 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `55c0acf0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]

## God Nodes (most connected - your core abstractions)
1. `createSupabaseServerClient()` - 96 edges
2. `useToast()` - 71 edges
3. `Button()` - 41 edges
4. `AnimatedPage()` - 40 edges
5. `getRegions()` - 36 edges
6. `getSessionUser` - 31 edges
7. `getSiteUrl()` - 30 edges
8. `useConfirm()` - 29 edges
9. `supabaseAdmin` - 23 edges
10. `Input` - 21 edges

## Surprising Connections (you probably didn't know these)
- `benchmark_pair()` --references--> `Path`  [EXTRACTED]
  D:/PROJECTS/Bharatendu_Shikhar/.agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/benchmark.py
- `main()` --calls--> `Path`  [EXTRACTED]
  D:/PROJECTS/Bharatendu_Shikhar/.agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/benchmark.py
- `is_sensitive_path()` --references--> `Path`  [EXTRACTED]
  D:/PROJECTS/Bharatendu_Shikhar/.agents/skills/caveman-compress/scripts/compress.py → .agents/skills/caveman-compress/scripts/compress.py
- `is_sensitive_path()` --references--> `bool`  [EXTRACTED]
  D:/PROJECTS/Bharatendu_Shikhar/.agents/skills/caveman-compress/scripts/compress.py → .agents/skills/caveman-compress/scripts/compress.py
- `compress_file()` --references--> `Path`  [EXTRACTED]
  D:/PROJECTS/Bharatendu_Shikhar/.agents/skills/caveman-compress/scripts/compress.py → .agents/skills/caveman-compress/scripts/compress.py

## Communities (94 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (19): dependsOn, inputs, outputs, cache, cache, persistent, dependsOn, $schema (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): compilerOptions, declaration, declarationMap, esModuleInterop, exactOptionalPropertyTypes, isolatedModules, lib, module (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (35): author, description, devDependencies, turbo, typescript, keywords, license, main (+27 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (27): dependencies, framer-motion, lucide-react, next, next-themes, react, react-dom, @repo/api (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (37): computedHash, skillPath, source, sourceType, computedHash, skillPath, source, sourceType (+29 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (24): devanagari, geistMono, metadata, newsreader, geistMono, geistSans, inter, metadata (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (32): bool, Path, str, bool, Path, str, bool, Path (+24 more)

### Community 8 - "Community 8"
Cohesion: 0.47
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (29): metadata, PageProps, metadata, metadata, PageProps, metadata, CompetitionsContent(), metadata (+21 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (33): AdvertisementsTable(), ArticlesTable(), BadgesTable(), BadgesTableProps, CategoriesTable(), CompetitionsTable(), CompetitionsTableProps, SPORT_STYLES (+25 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (20): Before / After, Benchmarks, code:block1 (/caveman-compress CLAUDE.md), code:block2 (CLAUDE.md          ← compressed (Claude reads this — fewer t), code:bash (caveman-compress/), code:block4 (/caveman-compress <filepath>), code:block5 (/caveman-compress CLAUDE.md), code:block6 (/caveman-compress CLAUDE.md) (+12 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.27
Nodes (9): Auto-clarity (inherited), Chaining patterns, code:block1 (<Header>:), code:block2 (<path:line-range> — <change ≤10 words>.), code:block3 (path:line: <emoji> <severity>: <problem>. <fix>.), Output contracts, What NOT to do, When to use cavecrew vs alternatives (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (8): caveman-commit, code:block1 (/caveman-commit), code:block2 (feat(api): add GET /users/:id/profile), code:block3 (feat(api)!: rename /v1/orders to /v1/checkout), Example output, How to invoke, See also, What it does

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (8): Caveman Help, code:bash (export CAVEMAN_DEFAULT_MODE=ultra), code:json ({ "defaultMode": "lite" }), Configure Default Mode, Deactivate, Modes, More, Skills

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (7): Auth behavior, File size limit, Reporting a vulnerability, Security, Snyk High Risk Rating, What the skill does NOT do, What triggers the rating

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (7): caveman-help, code:block1 (/caveman-help), code:block2 (Modes:), Example output, How to invoke, See also, What it does

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (7): caveman-review, code:block1 (/caveman-review), code:block2 (L42: 🔴 bug: user can be null after .find(). Add guard before), Example output, How to invoke, See also, What it does

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (7): caveman-stats, code:block1 (/caveman-stats), code:block2 (Session: 47 turns), Example output, How to invoke, See also, What it does

### Community 24 - "Community 24"
Cohesion: 0.36
Nodes (6): Auto-Clarity, Boundaries, code:block1 (feat(api): add GET /users/:id/profile), code:block2 (feat(api)!: rename /v1/orders to /v1/checkout), Examples, Rules

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (6): caveman, code:block1 (/caveman              # full mode (default)), Example output, How to invoke, See also, What it does

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (5): cavecrew, Example chaining, How to invoke, See also, What it does

### Community 27 - "Community 27"
Cohesion: 0.48
Nodes (5): Auto-Clarity, Boundaries, Intensity, Persistence, Rules

### Community 28 - "Community 28"
Cohesion: 0.53
Nodes (4): Auto-Clarity, Boundaries, Examples, Rules

### Community 31 - "Community 31"
Cohesion: 0.06
Nodes (35): dependencies, clsx, expo-server-sdk, framer-motion, lucide-react, next, next-themes, nextjs-toploader (+27 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.16
Nodes (15): dependencies, isomorphic-dompurify, sanitize-html, @supabase/ssr, @supabase/supabase-js, devDependencies, next, @types/node (+7 more)

### Community 34 - "Community 34"
Cohesion: 0.47
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 35 - "Community 35"
Cohesion: 0.14
Nodes (15): Accessibility, Caveman Mode (ALWAYS ACTIVE), Code Quality, Component Rules, Core Stack, Data Fetching, Forms, Frontend Development Rules (+7 more)

### Community 36 - "Community 36"
Cohesion: 0.47
Nodes (4): compilerOptions, types, extends, include

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (18): loginAction(), LoginState, metadata, NAV_ITEMS, Home(), ADMIN_PATHS, config, middleware() (+10 more)

### Community 38 - "Community 38"
Cohesion: 0.15
Nodes (10): getCookie(), GoogleTranslateButton(), readLang(), useLang(), useTranslateToggle(), Window, MobileThemeToggle(), Navbar() (+2 more)

### Community 42 - "Community 42"
Cohesion: 0.19
Nodes (13): robots(), sitemap(), generateMetadata(), generateMetadata(), GET(), escapeXml(), GET(), escapeXml() (+5 more)

### Community 44 - "Community 44"
Cohesion: 0.16
Nodes (10): generateMetadata(), generateMetadata(), generateMetadata(), generateMetadata(), iconMap, LegalDialog(), LegalDialogProps, generateLegalMetadata() (+2 more)

### Community 46 - "Community 46"
Cohesion: 0.07
Nodes (46): createArticleAction(), deleteArticleAction(), ensureLiveBadge(), getAuth(), publishArticleAction(), resolveLiveBadgeId(), sendPushNotificationAction(), updateArticleAction() (+38 more)

### Community 47 - "Community 47"
Cohesion: 0.11
Nodes (24): metadata, PageProps, metadata, metadata, metadata, metadata, CompetitionForm(), EpaperForm() (+16 more)

### Community 48 - "Community 48"
Cohesion: 0.24
Nodes (7): ElectionUpdate, UpdatesTimeline(), metadata, PreviewArticlePage(), PreviewArticlePageProps, getLiveUpdatesByArticleId(), sanitize()

### Community 49 - "Community 49"
Cohesion: 0.13
Nodes (30): BadgeFormProps, PRESET_COLORS, CandidatesListProps, LiveUpdatesListProps, MatchUpdatesListProps, UPDATE_TYPE_STYLES, TeamFormProps, cn() (+22 more)

### Community 50 - "Community 50"
Cohesion: 0.08
Nodes (30): BadgeRow, ArticleFiltersProps, ArticleFormProps, ArticlesTableProps, CategoriesTableProps, CategoryFormProps, CompetitionFormProps, ElectionFormProps (+22 more)

### Community 51 - "Community 51"
Cohesion: 0.05
Nodes (66): updateAdvertisementsAction(), updateContactAction(), updateHomepageAction(), updateLegalAction(), updateMaintenanceAction(), updateNotificationsAction(), updateSeoAction(), updateSiteInfoAction() (+58 more)

### Community 52 - "Community 52"
Cohesion: 0.15
Nodes (16): AdvertisementPlacementRow, supabase, supabaseAdmin, createSupabaseMiddlewareClient(), updateSession(), CookieMethods, CompositeTypes, Constants (+8 more)

### Community 53 - "Community 53"
Cohesion: 0.15
Nodes (22): calculateReadTime(), FeatureArticle(), getImageUrl(), getImageUrl(), LiveUpdatesSection(), getImageUrl(), SecondaryFeatureArticle(), calculateReadTime() (+14 more)

### Community 54 - "Community 54"
Cohesion: 0.47
Nodes (4): LiveTimeline(), LiveUpdate, getRelativeTime(), RelativeTime()

### Community 55 - "Community 55"
Cohesion: 0.25
Nodes (8): NotFound(), ContactPage(), EditPublisherContent(), EditPublisherPage(), getPublisherById(), ArticleContent(), CategoryContent(), DynamicRoutePage()

### Community 56 - "Community 56"
Cohesion: 0.05
Nodes (24): Skeleton(), PublisherFilters(), PublisherFiltersProps, PublisherFormProps, createPublisherAction(), togglePublisherActiveAction(), updatePublisherAction(), verifyAdmin() (+16 more)

### Community 57 - "Community 57"
Cohesion: 0.12
Nodes (27): metadata, metadata, ArticlesContent(), ArticlesPage(), metadata, PageProps, BadgesPage(), CategoriesContent() (+19 more)

### Community 58 - "Community 58"
Cohesion: 0.12
Nodes (20): metadata, metadata, metadata, metadata, BadgeFormPlaceholder(), CategoryFormPlaceholder(), EditBadgeContent(), EditBadgePage() (+12 more)

### Community 59 - "Community 59"
Cohesion: 0.14
Nodes (15): Accessibility, Caveman Mode (ALWAYS ACTIVE), Code Quality, Component Rules, Core Stack, Data Fetching, Forms, Frontend Development Rules (+7 more)

### Community 60 - "Community 60"
Cohesion: 0.15
Nodes (26): Path, Path, str, Path, Path, str, benchmark_pair(), count_tokens() (+18 more)

### Community 61 - "Community 61"
Cohesion: 0.16
Nodes (14): LiveUpdateModal(), LiveUpdateModalProps, LiveUpdatesSectionProps, LiveUpdateRow, ButtonProps, Size, SIZES, Variant (+6 more)

### Community 63 - "Community 63"
Cohesion: 0.07
Nodes (26): getAdvertisementById(), metadata, PageProps, metadata, metadata, metadata, PageProps, metadata (+18 more)

### Community 64 - "Community 64"
Cohesion: 0.11
Nodes (15): JsonLdSchema(), generateMetadata(), Ticker(), Advertisement(), BreadcrumbItem, Breadcrumbs(), BreadcrumbsProps, CategoryPageSkeleton() (+7 more)

### Community 65 - "Community 65"
Cohesion: 0.06
Nodes (49): createBadgeAction(), createCategoryAction(), createRegionAction(), deleteBadgeAction(), deleteCategoryAction(), deleteRegionAction(), toggleCategoryActiveAction(), toggleRegionActiveAction() (+41 more)

### Community 66 - "Community 66"
Cohesion: 0.14
Nodes (9): BLANK_ROW, groupBy(), PointsTableEditor(), PointsTableEditorProps, Toast, ToastContext, ToastContextValue, ToastVariant (+1 more)

### Community 67 - "Community 67"
Cohesion: 0.07
Nodes (34): AdvertisementsContent(), metadata, PageProps, getAdvertisements(), metadata, CategoryFilters(), CategoryFiltersProps, EpaperFilters() (+26 more)

### Community 68 - "Community 68"
Cohesion: 0.19
Nodes (12): DashboardLayout(), getSessionUser(), DashboardShell(), DashboardShellProps, NAV_ITEMS, Sidebar(), SidebarProps, TopbarProps (+4 more)

### Community 69 - "Community 69"
Cohesion: 0.08
Nodes (24): metadata, generateMetadata(), DialChart(), Candidate, ElectionResultsTabbed(), ElectionResultsTabbedProps, Group, UpdatesTimeline() (+16 more)

### Community 73 - "Community 73"
Cohesion: 0.35
Nodes (10): Home(), RootLayout(), _fetchBottomSlidersData(), _fetchDynamicPageData(), _fetchHomepageData(), fetchInBatches(), _fetchNavbarData(), _fetchTickerArticles() (+2 more)

### Community 74 - "Community 74"
Cohesion: 0.50
Nodes (3): BadgeRow, BadgeInsert, BadgeUpdate

### Community 75 - "Community 75"
Cohesion: 0.10
Nodes (21): metadata, PageProps, metadata, CandidatesList(), ElectionForm(), ElectionTabs(), ElectionTabsProps, GroupsList() (+13 more)

### Community 76 - "Community 76"
Cohesion: 0.16
Nodes (10): generateMetadata(), DoubleRowRelatedSlider(), HorizontalArticleSlider(), SliderItem, ArticleSkeleton(), RelatedArticlesSkeleton(), ArticlePage(), JsonLdSchema() (+2 more)

### Community 77 - "Community 77"
Cohesion: 0.18
Nodes (10): 📜 Available Scripts, Bharatendu Shikhar, code:text (.), code:bash (pnpm install), code:bash (pnpm run dev), 🏃‍♂️ Getting Started, 🛠️ Prerequisites, 📁 Project Structure (+2 more)

### Community 78 - "Community 78"
Cohesion: 0.36
Nodes (9): createLiveUpdateAction(), deleteLiveUpdateAction(), getAuth(), updateLiveUpdateAction(), verifyArticleAccess(), CreateLiveUpdateInput, createLiveUpdateSchema, UpdateLiveUpdateInput (+1 more)

### Community 79 - "Community 79"
Cohesion: 0.50
Nodes (3): LoginForm(), LoginPage(), metadata

### Community 81 - "Community 81"
Cohesion: 0.27
Nodes (6): TOPIC_CATEGORIES, ExpandableSectionLayout(), TopicCategoryData, TopicSection(), CategoryHeader(), SectionLayout()

### Community 82 - "Community 82"
Cohesion: 0.15
Nodes (18): MatchesTableProps, SPORT_STYLES, STATUS_STYLES, ScorePanel(), ScorePanelProps, createMatchAction(), createMatchUpdateAction(), deleteMatchAction() (+10 more)

### Community 87 - "Community 87"
Cohesion: 0.13
Nodes (12): geistSans, inter, playfair, plusJakarta, geistMono, geistSans, inter, metadata (+4 more)

### Community 88 - "Community 88"
Cohesion: 0.23
Nodes (7): logoutAction(), Topbar(), Badge(), BadgeVariant, VARIANTS, DarkModeToggleItem(), useTheme()

### Community 89 - "Community 89"
Cohesion: 0.67
Nodes (3): AdvertisementRow, AdvertisementFormProps, AdvertisementsTableProps

### Community 92 - "Community 92"
Cohesion: 0.07
Nodes (37): CompetitionsPage(), metadata, PageProps, PageProps, metadata, LivePage(), metadata, metadata (+29 more)

## Knowledge Gaps
- **539 isolated node(s):** `name`, `version`, `packageManager`, `description`, `main` (+534 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createSupabaseServerClient()` connect `Community 57` to `Community 37`, `Community 46`, `Community 47`, `Community 48`, `Community 49`, `Community 51`, `Community 52`, `Community 56`, `Community 58`, `Community 65`, `Community 67`, `Community 68`, `Community 69`, `Community 73`, `Community 75`, `Community 78`, `Community 79`, `Community 82`, `Community 88`, `Community 92`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Skeleton()` connect `Community 56` to `Community 64`, `Community 67`, `Community 76`, `Community 49`, `Community 57`, `Community 92`, `Community 63`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `_fetchHomepageData()` connect `Community 73` to `Community 64`, `Community 6`, `Community 76`, `Community 53`, `Community 57`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `name`, `version`, `packageManager` to the rest of the system?**
  _547 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._