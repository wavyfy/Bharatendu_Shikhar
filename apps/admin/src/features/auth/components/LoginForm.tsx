"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/login";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#CC2200] transition-colors text-black"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#CC2200] transition-colors text-black"
        />
      </div>

      {state?.error && (
        <p className="text-xs text-[#CC2200] bg-[#CC2200]/5 border border-[#CC2200]/20 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-[#CC2200] hover:bg-[#B31E00] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded transition-colors"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
