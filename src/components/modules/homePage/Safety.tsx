import {  ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export const Safety = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="bg-primary/5 rounded-[3.5rem] p-8 md:p-16 border border-primary/10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary text-white px-4 py-1">SAFETY FIRST</Badge>
            <h2 className="text-4xl font-black tracking-tight leading-tight">We prioritize your <br/> safety above all else.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Identity Verification", "Community Reviews", "Secure Messaging", "Host Badges"].map((item) => (
                <div key={item} className="flex items-center gap-3 font-bold text-zinc-700">
                  <ShieldCheck className="w-5 h-5 text-primary" /> {item}
                </div>
              ))}
            </div>
            <Button variant="outline" className="h-12 rounded-xl border-zinc-900 font-bold px-8">Read Security Guidelines</Button>
          </div>
          <div >
             <div className="w-full h-full ">
                <Image src="/ss.png" alt="Safety Illustration" width={600} height={400} className="object-cover"/>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);