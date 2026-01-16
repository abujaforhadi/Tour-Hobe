import { Globe, Zap } from "lucide-react";

export const HowItWorks = () => (
  <section className="py-24 bg-zinc-900 text-white overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <h2 className="text-5xl font-black tracking-tight leading-tight">Your journey starts <br/> in <span className="text-primary italic">3 simple steps</span></h2>
          <div className="space-y-10">
            {[
              { step: "01", t: "Post Your Itinerary", d: "Share where you want to go, your dates, and budget." },
              { step: "02", t: "Review Requests", d: "Check profiles of travelers who want to join you." },
              { step: "03", t: "Confirm & Explore", d: "Finalize your group and start your adventure safely." },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 group">
                <span className="text-5xl font-black text-white/10 group-hover:text-primary/40 transition-colors">{item.step}</span>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold">{item.t}</h4>
                  <p className="text-zinc-400 font-medium">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="aspect-square w-full max-w-md bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center p-12">
            <Globe className="w-full h-full text-primary opacity-20 animate-pulse" />
            <Zap className="absolute w-24 h-24 text-primary blur-[2px]" />
          </div>
        </div>
      </div>
    </div>
  </section>
);