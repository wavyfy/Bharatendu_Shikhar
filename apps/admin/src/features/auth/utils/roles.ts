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
  ],
  publisher: ["dashboard", "articles", "epapers"],
};

export function hasPermission(role: UserRole, section: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(section) ?? false;
}

export function isValidRole(role: unknown): role is UserRole {
  return role === "admin" || role === "publisher";
}
