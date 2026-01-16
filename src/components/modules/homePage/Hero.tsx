"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

export const Hero = () => (
  <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-50 border-b">
    <div className="container relative z-10 mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center"
      >
        <Badge variant="outline" className="mb-6 rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 font-bold uppercase tracking-widest text-primary">
          Bangladesh&apos;s Premier Travel Network
        </Badge>
        <h1 className="text-5xl font-black leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
          Stop Waiting. <br />
          <span className="italic text-primary underline decoration-zinc-200 underline-offset-8">Tour Hobe!</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-zinc-600 md:text-xl">
          No more cancelled plans. Connect with verified travel partners across Bangladesh. 
          Share the costs and double the fun.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="h-14 rounded-2xl px-8 text-lg font-black shadow-xl transition-transform hover:scale-105" asChild>
            <Link href="/travel-plans">Find a Travel Buddy</Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 rounded-2xl border-2 bg-white px-8 text-lg font-black" asChild>
            <Link href="/explore">Explore Recent Trips</Link>
          </Button>
        </div>
      </motion.div>
    </div>
    
    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-400">
      <ChevronDown className="w-8 h-8" />
    </motion.div>

    <div className="absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
  </section>
);