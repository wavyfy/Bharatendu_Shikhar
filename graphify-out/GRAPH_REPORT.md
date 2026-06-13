# Graph Report - Bharatendu_Shikhar  (2026-06-13)

## Corpus Check
- 200 files · ~66,718 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1064 nodes · 2126 edges · 63 communities (54 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `884217a2`
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

## God Nodes (most connected - your core abstractions)
1. `createSupabaseServerClient()` - 72 edges
2. `useToast()` - 37 edges
3. `Button()` - 30 edges
4. `AnimatedPage()` - 23 edges
5. `compilerOptions` - 17 edges
6. `cn()` - 17 edges
7. `compilerOptions` - 16 edges
8. `compilerOptions` - 16 edges
9. `useConfirm()` - 15 edges
10. `RegionRow` - 15 edges

## Surprising Connections (you probably didn't know these)
- `middleware()` --calls--> `createSupabaseMiddlewareClient()`  [EXTRACTED]
  apps/admin/src/middleware.ts → packages/api/src/supabase/middleware.ts
- `getSessionUser()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/layout.tsx → packages/api/src/supabase/server.ts
- `ArticlesPage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/articles/page.tsx → packages/api/src/supabase/server.ts
- `EditArticlePage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/articles/[id]/edit/page.tsx → packages/api/src/supabase/server.ts
- `NewBadgePage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/badges/new/page.tsx → packages/api/src/supabase/server.ts

## Communities (63 total, 9 thin omitted)

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
Cohesion: 0.11
Nodes (17): author, description, devDependencies, turbo, typescript, keywords, license, main (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (27): dependencies, framer-motion, lucide-react, next, next-themes, react, react-dom, @repo/api (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (37): computedHash, skillPath, source, sourceType, computedHash, skillPath, source, sourceType (+29 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (15): geistMono, geistSans, metadata, geistMono, geistSans, generateMetadata(), metadata, RootLayout() (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (26): bool, Path, str, bool, Path, str, main(), print_usage() (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (9): ExpandableSectionLayout(), getImageUrl(), LiveUpdatesSection(), TopicSection(), Advertisement(), CategoryHeader(), RelatedArticle, RelatedArticlesList() (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (23): Path, Path, str, benchmark_pair(), count_tokens(), main(), print_table(), count_bullets() (+15 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (20): Before / After, Benchmarks, code:block1 (/caveman-compress CLAUDE.md), code:block2 (CLAUDE.md          ← compressed (Claude reads this — fewer t), code:bash (caveman-compress/), code:block4 (/caveman-compress <filepath>), code:block5 (/caveman-compress CLAUDE.md), code:block6 (/caveman-compress CLAUDE.md) (+12 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (9): Auto-clarity (inherited), Chaining patterns, code:block1 (<Header>:), code:block2 (<path:line-range> — <change ≤10 words>.), code:block3 (path:line: <emoji> <severity>: <problem>. <fix>.), Output contracts, What NOT to do, When to use cavecrew vs alternatives (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (8): caveman-commit, code:block1 (/caveman-commit), code:block2 (feat(api): add GET /users/:id/profile), code:block3 (feat(api)!: rename /v1/orders to /v1/checkout), Example output, How to invoke, See also, What it does

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (8): Caveman Help, code:bash (export CAVEMAN_DEFAULT_MODE=ultra), code:json ({ "defaultMode": "lite" }), Configure Default Mode, Deactivate, Modes, More, Skills

### Community 20 - "Community 20"
Cohesion: 0.25
Nodes (7): Auth behavior, File size limit, Reporting a vulnerability, Security, Snyk High Risk Rating, What the skill does NOT do, What triggers the rating

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (7): caveman-help, code:block1 (/caveman-help), code:block2 (Modes:), Example output, How to invoke, See also, What it does

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (7): caveman-review, code:block1 (/caveman-review), code:block2 (L42: 🔴 bug: user can be null after .find(). Add guard before), Example output, How to invoke, See also, What it does

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (7): caveman-stats, code:block1 (/caveman-stats), code:block2 (Session: 47 turns), Example output, How to invoke, See also, What it does

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (6): Auto-Clarity, Boundaries, code:block1 (feat(api): add GET /users/:id/profile), code:block2 (feat(api)!: rename /v1/orders to /v1/checkout), Examples, Rules

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (6): caveman, code:block1 (/caveman              # full mode (default)), Example output, How to invoke, See also, What it does

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (5): cavecrew, Example chaining, How to invoke, See also, What it does

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (5): Auto-Clarity, Boundaries, Intensity, Persistence, Rules

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (4): Auto-Clarity, Boundaries, Examples, Rules

### Community 31 - "Community 31"
Cohesion: 0.06
Nodes (35): dependencies, clsx, expo-server-sdk, framer-motion, lucide-react, next, next-themes, nextjs-toploader (+27 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.15
Nodes (12): dependencies, @supabase/ssr, @supabase/supabase-js, devDependencies, next, @types/node, main, name (+4 more)

### Community 34 - "Community 34"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 35 - "Community 35"
Cohesion: 0.12
Nodes (15): Accessibility, Caveman Mode (ALWAYS ACTIVE), Code Quality, Component Rules, Core Stack, Data Fetching, Forms, Frontend Development Rules (+7 more)

### Community 36 - "Community 36"
Cohesion: 0.40
Nodes (4): compilerOptions, types, extends, include

### Community 37 - "Community 37"
Cohesion: 0.14
Nodes (16): loginAction(), LoginState, logoutAction(), metadata, NAV_ITEMS, Home(), DashboardLayout(), getSessionUser() (+8 more)

### Community 38 - "Community 38"
Cohesion: 0.07
Nodes (39): createBadgeAction(), createCategoryAction(), createRegionAction(), deleteBadgeAction(), deleteCategoryAction(), deleteRegionAction(), toggleCategoryActiveAction(), toggleRegionActiveAction() (+31 more)

### Community 42 - "Community 42"
Cohesion: 0.08
Nodes (24): inter, playfair, plusJakarta, geistMono, geistSans, metadata, DashboardShellProps, NAV_ITEMS (+16 more)

### Community 44 - "Community 44"
Cohesion: 0.06
Nodes (56): metadata, PageProps, metadata, PageProps, ArticleFilters(), ArticlesTable(), BadgesTable(), CategoriesTable() (+48 more)

### Community 46 - "Community 46"
Cohesion: 0.10
Nodes (19): metadata, metadata, metadata, metadata, metadata, metadata, metadata, BadgeFormPlaceholder() (+11 more)

### Community 47 - "Community 47"
Cohesion: 0.10
Nodes (31): createArticleAction(), deleteArticleAction(), ensureLiveBadge(), getAuth(), publishArticleAction(), resolveLiveBadgeId(), sendPushNotificationAction(), updateArticleAction() (+23 more)

### Community 48 - "Community 48"
Cohesion: 0.15
Nodes (15): metadata, PublisherForm(), PublisherFormProps, EditPublisherPage(), Props, createPublisherAction(), togglePublisherActiveAction(), updatePublisherAction() (+7 more)

### Community 49 - "Community 49"
Cohesion: 0.05
Nodes (59): BadgeRow, ArticleFiltersProps, ArticleFormProps, BadgeFormProps, PRESET_COLORS, CategoriesTableProps, CategoryFormProps, EpaperFormProps (+51 more)

### Community 50 - "Community 50"
Cohesion: 0.15
Nodes (12): SearchContext, SearchContextType, SearchProvider(), useSearch(), CurrentDate(), useTranslateToggle(), Header(), MobileThemeToggle() (+4 more)

### Community 51 - "Community 51"
Cohesion: 0.09
Nodes (37): updateContactAction(), updateHomepageAction(), updateMaintenanceAction(), updateNotificationsAction(), updateSeoAction(), updateSiteInfoAction(), updateSocialAction(), upsertSettings() (+29 more)

### Community 52 - "Community 52"
Cohesion: 0.10
Nodes (21): DashboardStats, getDashboardStats(), LiveTimeline(), LiveUpdate, DashboardPage(), supabase, supabaseAdmin, supabase (+13 more)

### Community 53 - "Community 53"
Cohesion: 0.21
Nodes (13): calculateReadTime(), FeatureArticle(), getImageUrl(), calculateReadTime(), SplitArticles(), ArticleMeta(), calculateReadTime(), ArticleRow (+5 more)

### Community 54 - "Community 54"
Cohesion: 0.24
Nodes (11): NotFound(), Home(), ArticlePage(), DynamicRoutePage(), fetchArticleBySlug(), fetchBottomSlidersData(), fetchDynamicPageData(), fetchHomepageData() (+3 more)

### Community 55 - "Community 55"
Cohesion: 0.17
Nodes (16): metadata, EditEpaperPage(), PageProps, EPapersPage(), LiveUpdatesPage(), metadata, PreviewArticlePage(), PreviewArticlePageProps (+8 more)

### Community 56 - "Community 56"
Cohesion: 0.36
Nodes (9): createLiveUpdateAction(), deleteLiveUpdateAction(), getAuth(), updateLiveUpdateAction(), verifyArticleAccess(), CreateLiveUpdateInput, createLiveUpdateSchema, UpdateLiveUpdateInput (+1 more)

### Community 57 - "Community 57"
Cohesion: 0.14
Nodes (19): metadata, metadata, metadata, ArticlesPage(), BadgesPage(), metadata, PageProps, CategoriesPage() (+11 more)

### Community 58 - "Community 58"
Cohesion: 0.31
Nodes (5): DoubleRowRelatedSlider(), HorizontalArticleSlider(), SliderItem, Ticker(), ArticleWithAuthor

### Community 59 - "Community 59"
Cohesion: 0.29
Nodes (6): getCookie(), GoogleTranslateButton(), readLang(), useLang(), Window, ThemeToggle()

### Community 60 - "Community 60"
Cohesion: 0.38
Nodes (4): DashboardMockup(), LoginForm(), LoginPage(), metadata

## Knowledge Gaps
- **439 isolated node(s):** `name`, `version`, `packageManager`, `description`, `main` (+434 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createSupabaseServerClient()` connect `Community 55` to `Community 37`, `Community 38`, `Community 44`, `Community 46`, `Community 47`, `Community 48`, `Community 49`, `Community 51`, `Community 52`, `Community 54`, `Community 56`, `Community 57`, `Community 60`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `fetchHomepageData()` connect `Community 54` to `Community 6`, `Community 9`, `Community 53`, `Community 55`, `Community 58`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 44` to `Community 38`, `Community 42`, `Community 47`, `Community 49`, `Community 51`, `Community 55`, `Community 60`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `name`, `version`, `packageManager` to the rest of the system?**
  _448 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._