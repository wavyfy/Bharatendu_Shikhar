import { supabaseAdmin } from "@repo/api";
import type { PublisherWithAuth } from "../types";

export async function getPublishers(): Promise<PublisherWithAuth[]> {
  // Fetch profiles with article counts
  const { data: profilesData, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("*, articles(count)")
    .eq("role", "publisher")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Error fetching publisher profiles:", profilesError);
    return [];
  }

  // Fetch users from Auth to get emails
  // For small-medium sets this is fine, for large sets we would paginate
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (usersError) {
    console.error("Error fetching auth users:", usersError);
    return [];
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
  return profilesData.map((profile: unknown) => {
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
