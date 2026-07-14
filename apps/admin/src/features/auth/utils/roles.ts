export type UserRole = "admin" | "publisher";

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "dashboard",
    "articles",
    "categories",
    "regions",
    "badges",
    "publishers",
    "epapers",
    "settings",
    "advertisements",
    "elections",
    "sports_competitions",
    "sports_matches",
    "sports_teams",
  ],
  publisher: [
    "dashboard",
    "articles",
    "epapers",
    "advertisements",
    "elections",
    "sports_competitions",
    "sports_matches",
  ],
};

export function hasPermission(role: UserRole, section: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(section) ?? false;
}

export function isValidRole(role: unknown): role is UserRole {
  return role === "admin" || role === "publisher";
}
