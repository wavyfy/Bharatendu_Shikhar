# Graph Report - Bharatendu_Shikhar  (2026-05-30)

## Corpus Check
- 144 files · ~33,265 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 846 nodes · 1532 edges · 55 communities (47 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e64e4ed3`
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

## God Nodes (most connected - your core abstractions)
1. `createSupabaseServerClient()` - 60 edges
2. `useToast()` - 29 edges
3. `Button()` - 26 edges
4. `compilerOptions` - 17 edges
5. `compilerOptions` - 16 edges
6. `compilerOptions` - 16 edges
7. `RegionRow` - 15 edges
8. `cn()` - 15 edges
9. `validate()` - 14 edges
10. `getRegions()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/login/page.tsx → packages/api/src/supabase/server.ts
- `middleware()` --calls--> `createSupabaseMiddlewareClient()`  [EXTRACTED]
  apps/admin/src/middleware.ts → packages/api/src/supabase/middleware.ts
- `getSessionUser()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/layout.tsx → packages/api/src/supabase/server.ts
- `NewCategoryPage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/categories/new/page.tsx → packages/api/src/supabase/server.ts
- `EditCategoryPage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/categories/[id]/edit/page.tsx → packages/api/src/supabase/server.ts

## Communities (55 total, 8 thin omitted)

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
Cohesion: 0.09
Nodes (22): dependencies, next, react, react-dom, @supabase/supabase-js, devDependencies, eslint, eslint-config-next (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (37): computedHash, skillPath, source, sourceType, computedHash, skillPath, source, sourceType (+29 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (6): geistMono, geistSans, metadata, geistMono, geistSans, metadata

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (26): bool, Path, str, bool, Path, str, main(), print_usage() (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

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
Nodes (33): dependencies, clsx, framer-motion, lucide-react, next, nextjs-toploader, react, react-dom (+25 more)

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
Cohesion: 0.40
Nodes (4): Caveman Mode (ALWAYS ACTIVE), Graphify (ALWAYS USE & SIGNIFICANT-UPDATE), Rules, This is NOT the Next.js you know

### Community 36 - "Community 36"
Cohesion: 0.40
Nodes (4): compilerOptions, types, extends, include

### Community 37 - "Community 37"
Cohesion: 0.16
Nodes (12): cn(), Dropzone(), DropzoneProps, PageContainer(), PageContainerProps, Skeleton(), sizeClasses, Spinner() (+4 more)

### Community 38 - "Community 38"
Cohesion: 0.07
Nodes (38): createCategoryAction(), createRegionAction(), deleteCategoryAction(), deleteRegionAction(), updateCategoryAction(), updateRegionAction(), metadata, metadata (+30 more)

### Community 42 - "Community 42"
Cohesion: 0.06
Nodes (38): loginAction(), LoginState, logoutAction(), playfair, metadata, NAV_ITEMS, geistMono, geistSans (+30 more)

### Community 44 - "Community 44"
Cohesion: 0.07
Nodes (40): DashboardStats, getDashboardStats(), CategoriesPage(), metadata, PageProps, CategoriesTable(), EpapersTable(), PublisherFilters() (+32 more)

### Community 46 - "Community 46"
Cohesion: 0.07
Nodes (46): metadata, metadata, metadata, metadata, metadata, ArticlesPage(), metadata, PageProps (+38 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (22): createArticleAction(), deleteArticleAction(), getAuth(), publishArticleAction(), updateArticleAction(), createEpaperAction(), deleteEpaperAction(), epaperSchema (+14 more)

### Community 48 - "Community 48"
Cohesion: 0.15
Nodes (16): metadata, metadata, PublisherForm(), PublisherFormProps, EditPublisherPage(), Props, createPublisherAction(), togglePublisherActiveAction() (+8 more)

### Community 49 - "Community 49"
Cohesion: 0.18
Nodes (12): ArticleFiltersProps, EpaperFormProps, EpapersTableProps, RegionFormProps, RegionsTableProps, EpaperInsert, EpaperRow, EpaperUpdate (+4 more)

### Community 50 - "Community 50"
Cohesion: 0.22
Nodes (13): RegionsTable(), ActionMenu(), ActionMenuItem, ActionMenuProps, Button(), ConfirmContext, ConfirmContextValue, ConfirmOptions (+5 more)

### Community 51 - "Community 51"
Cohesion: 0.10
Nodes (35): updateContactAction(), updateHomepageAction(), updateMaintenanceAction(), updateNotificationsAction(), updateSeoAction(), updateSiteInfoAction(), updateSocialAction(), upsertSettings() (+27 more)

### Community 52 - "Community 52"
Cohesion: 0.17
Nodes (12): ArticleFilters(), ArticleFormProps, CategoriesTableProps, CategoryFormProps, CategoryInsert, CategoryRow, CategoryUpdate, RichEditor() (+4 more)

### Community 53 - "Community 53"
Cohesion: 0.20
Nodes (5): Toast, ToastContext, ToastContextValue, ToastVariant, VARIANT_STYLES

### Community 54 - "Community 54"
Cohesion: 0.28
Nodes (7): ArticlesTable(), ArticlesTableProps, ArticleInsert, ArticleRow, ArticleStatus, ArticleUpdate, ArticleWithRelations

## Knowledge Gaps
- **385 isolated node(s):** `name`, `version`, `packageManager`, `description`, `main` (+380 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createSupabaseServerClient()` connect `Community 46` to `Community 38`, `Community 42`, `Community 44`, `Community 47`, `Community 48`, `Community 51`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 50` to `Community 38`, `Community 42`, `Community 44`, `Community 46`, `Community 47`, `Community 48`, `Community 51`, `Community 52`, `Community 54`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `useToast()` connect `Community 51` to `Community 38`, `Community 44`, `Community 46`, `Community 47`, `Community 48`, `Community 50`, `Community 52`, `Community 53`, `Community 54`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `name`, `version`, `packageManager` to the rest of the system?**
  _394 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._