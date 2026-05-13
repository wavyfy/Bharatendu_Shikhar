# Graph Report - Bharatendu_Shikhar  (2026-05-13)

## Corpus Check
- 9 files · ~1,868 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 25 nodes · 16 edges · 9 communities (6 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3da4e229`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `Caveman Mode (ALWAYS ACTIVE)` - 2 edges
2. `Getting Started` - 2 edges
3. `eslintConfig` - 1 edges
4. `nextConfig` - 1 edges
5. `config` - 1 edges
6. `geistSans` - 1 edges
7. `geistMono` - 1 edges
8. `metadata` - 1 edges
9. `This is NOT the Next.js you know` - 1 edges
10. `Rules` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (9 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.4
Nodes (3): geistMono, geistSans, metadata

### Community 1 - "Community 1"
Cohesion: 0.4
Nodes (4): Caveman Mode (ALWAYS ACTIVE), Graphify (AUTO-UPDATE), Rules, This is NOT the Next.js you know

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **12 isolated node(s):** `eslintConfig`, `nextConfig`, `config`, `geistSans`, `geistMono` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `eslintConfig`, `nextConfig`, `config` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._