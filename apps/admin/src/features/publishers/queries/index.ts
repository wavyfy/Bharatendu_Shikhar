import { supabaseAdmin } from "@repo/api";
import type { PublisherWithAuth } from "../types";

export interface GetPublishersOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export async function getPublishers(options: GetPublishersOptions = {}) {
  const { page = 1, limit = 10, search, status } = options;
  
  let query = supabaseAdmin
    .from("profiles")
    .select("*, articles(count)", { count: "exact" })
    .eq("role", "publisher");

  if (status === "active") {
    query = query.eq("is_active", true);
  } else if (status === "inactive") {
    query = query.eq("is_active", false);
  }

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data: profilesData, count, error: profilesError } = await query;

  if (profilesError) {
    console.error("Error fetching publisher profiles:", profilesError);
    return { publishers: [], count: 0, totalPages: 0 };
  }

  // Fetch users from Auth to get emails
  // For production with thousands of users, consider syncing emails to profiles via trigger
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (usersError) {
    console.error("Error fetching auth users:", usersError);
    return { publishers: [], count: 0, totalPages: 0 };
  }

  // Map users to a dictionary by ID
  const usersById = usersData.users.reduce((acc, user) => {
    acc[user.id] = user.email || "";
    return acc;
  }, {} as Record<string, string>);

  type ProfileWithCount = {
    id: string;
    full_name: string;
    role: string;
    created_at: string;
    is_active: boolean;
    articles: { count: number }[];
  };

  // Combine data
  const publishers = profilesData.map((profile: unknown) => {
    const p = profile as ProfileWithCount;
    return {
      id: p.id,
      full_name: p.full_name,
      role: p.role,
      created_at: p.created_at,
      is_active: p.is_active,
      email: usersById[p.id] || "No Email",
      article_count: p.articles?.[0]?.count || 0,
    };
  });

  return {
    publishers,
    count: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function getPublisherById(id: string): Promise<PublisherWithAuth | null> {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(id);

  if (userError || !user.user) {
    return null;
  }

  type ProfileRow = {
    id: string;
    full_name: string;
    role: string;
    created_at: string;
    is_active: boolean;
  };
  const p = profile as ProfileRow;

  return {
    id: p.id,
    full_name: p.full_name,
    role: p.role,
    created_at: p.created_at,
    is_active: p.is_active,
    email: user.user.email || "",
  };
}
