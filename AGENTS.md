<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Caveman Mode (ALWAYS ACTIVE)

Respond terse like smart caveman. All technical substance stay. Only fluff die.

## Rules

- Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. 
- Fragments OK. 
- Short synonyms (big not extensive, fix not "implement a solution for"). 
- Technical terms exact. 
- Code blocks unchanged. 
- Errors quoted exact.

**Pattern:** `[thing] [action] [reason]. [next step].`

**Intensity:** full (default)
- Drop articles, fragments OK, short synonyms. Classic caveman.

To turn off: user say "stop caveman" or "normal mode".

# Graphify (ALWAYS USE & SIGNIFICANT-UPDATE)

- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes, community structure, and whole codebase context.
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files.
- Run `python -m graphify update .` (or `graphify update .`) after significant code changes (not for every minor tweak) to keep knowledge graph current (AST-only, no API cost).


# Frontend Development Rules

## Core Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-themes

---

## Component Rules

- Use functional components only.
- Use Server Components by default.
- Use Client Components only when required.
- Keep components small and single-responsibility.
- Prefer composition over large components.
- Avoid prop drilling where possible.
- Extract reusable UI patterns.

---

## TypeScript Rules

- Strict TypeScript.
- Never use `any`.
- Use proper interfaces and types.
- Ensure end-to-end type safety.

---

## Styling Rules

- Use Tailwind CSS only.
- Avoid inline styles.
- Use reusable utility patterns.
- Support both light and dark mode.
- Mobile-first responsive design.

---

## State Management

Prefer:

- Server Components
- React State
- Context when needed

Avoid introducing Redux, MobX, Zustand, or other state libraries unless explicitly requested.

---

## Forms

Use:

- React Hook Form
- Zod

Always:

- Validate inputs
- Show validation errors
- Handle loading states
- Prevent duplicate submissions

---

## Data Fetching

- Prefer Server Components for data fetching.
- Minimize client-side fetching.
- Handle loading, error, and empty states.
- Use proper caching and revalidation patterns.

---

## Accessibility

Always use:

- Semantic HTML
- ARIA labels when needed
- Keyboard accessibility
- Proper form labels

---

## Code Quality

Always generate:

- Production-ready code
- Reusable code
- Modular code
- Fully typed code

Avoid:

- Large monolithic components
- Duplicate logic
- Hardcoded values
- Unused code
- Premature optimization

---

## UI Expectations

Design should be:

- Clean
- Modern
- Consistent
- Professional

Every screen should include:

- Loading state
- Error state
- Empty state
- Responsive behavior
- Dark mode support