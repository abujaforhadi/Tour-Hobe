import { ShieldCheck, TrendingUp, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Features = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black tracking-tight mb-4">Travel Smarter, Together</h2>
        <p className="text-zinc-500 font-medium">Everything you need to find the perfect companion for your next journey.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Verified Partners", desc: "Every member undergoes social and background verification.", icon: ShieldCheck },
          { title: "Cost Efficiency", desc: "Share transport, food, and hotel costs fairly with your group.", icon: TrendingUp },
          { title: "Solo Friendly", desc: "Find groups that match your personality and travel style.", icon: Compass },
        ].map((f, i) => (
          <Card key={i} className="border-none shadow-xl shadow-zinc-100 rounded-[2.5rem] p-4 transition-transform hover:-translate-y-2">
            <CardContent className="pt-8 space-y-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);