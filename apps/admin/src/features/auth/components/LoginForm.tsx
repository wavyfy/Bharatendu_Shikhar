"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions/login";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeTogglePill } from "@/components/ui/ThemeTogglePill";
import { motion } from "framer-motion";
import { Mail, LockKeyhole, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Image from "next/image";


import { DashboardMockup } from "./DashboardMockup";

/**
 * Renders a responsive login page with email and password authentication.
 *
 * @param logoUrl - Optional logo URL to display in the top-left pill. HTTP URLs are displayed directly; other paths are rewritten as Supabase Storage URLs. Defaults to "BS Admin" text if not provided.
 */
export function LoginForm({ logoUrl }: { logoUrl?: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, { error: undefined });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans">
      {/* Left side: Cover Image / Mockup */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden items-center justify-center p-12 lg:p-16">
        {/* Radial space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-red-900/40 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col h-full w-full max-w-xl">
          {/* Logo Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-48 h-12 bg-white flex items-center justify-center rounded-full shadow-lg mb-12 relative overflow-hidden px-4"
          >
            {logoUrl ? (
              <Image 
                src={logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`} 
                alt="Bharatendu Shikhar Logo" 
                fill
                sizes="192px"
                className="object-contain p-2" 
              />
            ) : (
              <span className="font-bold text-xl text-slate-800">BS Admin</span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-4xl lg:text-[2.8rem] font-bold tracking-tight mb-6 leading-tight text-white drop-shadow-md">
              Powering Modern <br/>
              Digital <span className="text-[#F14B3E]">Journalism</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed font-light drop-shadow-sm">
              A unified platform to create, manage and publish impactful news that informs, inspires and creates change.
            </p>
          </motion.div>

          {/* 3D Dashboard Mockup */}
          <div className="flex-1 relative w-full mt-5 z-20 pointer-events-none">
            <div className="absolute top-0 left-0 origin-top-left scale-[0.55] xl:scale-[0.65]">
              <motion.div 
                initial={{ opacity: 0, y: 150 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              >
                <div
                  className="w-[850px] h-[650px] relative"
                  style={{ 
                    perspective: 2000, 
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(12deg) rotateY(-10deg) rotateZ(3deg)'
                  }}
                >
                {/* Bottom Layer */}
                <motion.div 
                  initial={{ z: 0, x: 0, y: 0 }}
                  animate={{ z: -160, x: 80, y: 80 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-0 transform-gpu border border-slate-800/40 rounded-2xl overflow-hidden bg-slate-950/60"
                  style={{ filter: 'blur(3px)' }}
                >
                  <DashboardMockup />
                </motion.div>
                
                {/* Middle Layer */}
                <motion.div 
                  initial={{ z: 0, x: 0, y: 0 }}
                  animate={{ z: -80, x: 40, y: 40 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                  className="absolute inset-0 transform-gpu border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl bg-slate-950/80"
                  style={{ filter: 'blur(1px)' }}
                >
                  <DashboardMockup />
                </motion.div>

                {/* Top Layer */}
                <motion.div 
                  initial={{ z: 0, x: 0, y: 0 }}
                  animate={{ z: 0, x: 0, y: 0 }}
                  className="absolute inset-0 transform-gpu border border-slate-700 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] bg-slate-950"
                >
                  <DashboardMockup />
                </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col relative py-20 lg:py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-slate-50 dark:bg-[#0B0F19] justify-center items-center lg:items-stretch">
        
        {/* Mobile Navbar */}
        <div className="lg:hidden absolute top-0 left-0 right-0 p-5 sm:p-6 flex justify-between items-center z-20">
           <div className="w-36 h-10 bg-white flex items-center justify-center rounded-full shadow-sm relative overflow-hidden px-3">
             {logoUrl ? (
               <Image src={logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`} alt="BS Logo" fill sizes="144px" className="object-contain p-1.5" />
             ) : (
               <span className="font-bold text-lg text-slate-800">BS Admin</span>
             )}
           </div>
           <ThemeTogglePill />
        </div>

        {/* Desktop Theme Toggle */}
        <div className="hidden lg:block absolute top-8 right-10 z-20">
          <ThemeTogglePill />
        </div>

        <div className="w-full max-w-sm lg:max-w-[460px] mx-auto mt-8 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-300/50 dark:shadow-black/60 rounded-3xl p-8 sm:p-12 relative w-full"
          >

            <div className="mb-10">
              <p className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                Welcome back
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                Sign in to your account
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Access the Admin & Publisher dashboard to manage content, publications, and platform operations.
              </p>
            </div>

            <form action={formAction} className="space-y-4">
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
                  placeholder="you@example.com"
                  icon={<Mail className="h-4 w-4 text-slate-400" />}
                  required
                  className="h-12 bg-white dark:bg-[#0B0D12] border-slate-200 dark:border-slate-800/80 shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-slate-700 dark:text-slate-200 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  icon={<LockKeyhole className="h-4 w-4 text-slate-400" />}
                  endIcon={
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPassword(!showPassword);
                      }}
                      className="relative z-10 p-1 pointer-events-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  required
                  className="h-12 bg-white dark:bg-[#0B0D12] border-slate-200 dark:border-slate-800/80 shadow-sm"
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
                  className="h-12 text-base group"
                >
                  Sign in
                  <ArrowRight className="h-4 w-4 ml-2 opacity-90 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </motion.div>
          
          <div className="mt-4 text-center flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Secure admin access · Protected by <span className="font-semibold text-slate-700 dark:text-slate-300">Bharatendu Shikhar</span></span>
            </div>
            
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Bharatendu Shikhar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
