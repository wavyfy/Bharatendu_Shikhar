"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/login";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import { Mail, LockKeyhole, ArrowRight } from "lucide-react";
import Image from "next/image";

import bsLogo from "../../../../public/images/bs_logo.png";
import { DashboardMockup } from "./DashboardMockup";

export function LoginForm({ logoUrl }: { logoUrl?: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, { error: undefined });

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left side: Cover Image / Mockup */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden border-r border-slate-800 m-5 rounded-3xl">
        <div className="absolute inset-0 w-[120%] h-[120%]">
          <DashboardMockup />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-slate-950/20 backdrop-blur-[2px]" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-16 text-white h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-50 h-15 bg-surface flex items-center justify-center rounded-2xl shadow-xl shadow-black/50 mb-8 relative overflow-hidden p-2 border border-slate-800">
              <Image 
                src={logoUrl ? (logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`) : bsLogo} 
                alt="Bharatendu Shikhar Logo" 
                fill
                sizes="100px"
                className="object-contain scale-90" 
              />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-sans tracking-tight mb-4 leading-tight drop-shadow-md">
              Empowering the voice of truth.
            </h1>
            <p className="text-lg text-slate-300 max-w-md font-light leading-relaxed drop-shadow-sm">
              Welcome to the Bharatendu Shikhar editorial dashboard. Manage your publications with precision and impact.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-surface lg:bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-sm lg:max-w-md bg-surface border border-slate-200 shadow-lg shadow-slate-300/70 rounded-3xl p-6 sm:p-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile logo (hidden on desktop where cover has the logo) */}
            <div className="lg:hidden flex justify-center mb-8">
               <div className="w-16 h-16 bg-surface flex items-center justify-center rounded-2xl shadow-lg shadow-black/10 relative overflow-hidden p-1">
                 <Image src={logoUrl ? (logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`) : bsLogo} alt="BS Logo" fill sizes="64px" className="object-contain scale-110" />
               </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans mb-2 text-center lg:text-left">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 mb-8 text-center lg:text-left">
              Please enter your details to access your account.
            </p>

            <form action={formAction} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-slate-700 dark:text-slate-200 mb-1"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  icon={<Mail className="h-4 w-4 text-slate-400" />}
                  required
                  className="bg-surface"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-slate-700 dark:text-slate-200"
                  >
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  icon={<LockKeyhole className="h-4 w-4 text-slate-400" />}
                  required
                  className="bg-surface"
                />
              </div>

              {state?.error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2"
                >
                  <div className="w-1 h-full bg-red-600 rounded-full" />
                  {state.error}
                </motion.div>
              )}

              <div className="pt-4">
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isPending} 
                  className="py-3 text-base group"
                >
                  Sign in
                  <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
