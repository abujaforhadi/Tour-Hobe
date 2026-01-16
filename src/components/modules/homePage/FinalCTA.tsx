import { Button } from '@/components/ui/button';
import Link from 'next/link';
export const FinalCTA = () => (
  <section className="container mx-auto px-6 pb-24">
    <div className="relative overflow-hidden rounded-[4rem] bg-zinc-900 p-12 text-center text-white shadow-2xl md:p-24">
      <div className="relative z-10 mx-auto max-w-3xl space-y-10">
        <h2 className="text-5xl font-black leading-tight tracking-tighter md:text-7xl">
          Don&apos;t travel <span className="text-primary italic">solo</span> unless you want to.
        </h2>
        <div className="pt-6">
          <Button size="lg" className="h-20 rounded-full bg-primary px-16 text-2xl font-black text-white hover:scale-105 transition-transform" asChild>
            <Link href="/register">Join the Community</Link>
          </Button>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
    </div>
  </section>
);