"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/login";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

import { Mail, LockKeyhole } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: undefined });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center rounded-2xl shadow-lg shadow-red-600/20">
             <span className="font-playfair text-3xl font-bold">BS</span>
           </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 font-sans">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to the <span className="font-medium text-slate-900">Bharatendu Shikhar</span> admin and publisher dashboard
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 border border-slate-100 sm:rounded-2xl sm:px-10">
          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-slate-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-slate-700"
              >
                Password
              </label>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  icon={<LockKeyhole className="h-4 w-4" />}
                  required
                />
              </div>
            </div>

            {state?.error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md border border-red-200 text-center"
              >
                {state.error}
              </motion.div>
            )}

            <div className="pt-2">
              <Button type="submit" fullWidth isLoading={isPending} className="py-2.5 shadow-md shadow-red-600/20">
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
