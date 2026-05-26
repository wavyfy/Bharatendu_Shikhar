import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Sign In | Bharatendu Shikhar Admin",
};

export default async function LoginPage() {
  // If already authenticated → go to dashboard
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    // read-only check - no cookies written on login page
    set: (_name, _value, _options) => {},
    remove: (_name, _options) => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-4">
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }`,
        }}
      />

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-playfair font-black text-3xl text-[#111] mb-1">
            Bharatendu Shikhar
          </h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase font-semibold">
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-sm font-bold text-[#111] mb-6">Sign in to continue</h2>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Access restricted to authorized staff only.
        </p>
      </div>
    </div>
  );
}
