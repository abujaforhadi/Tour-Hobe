import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Compass, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Users 
} from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50/50 py-16 px-6">
      <div className="container mx-auto max-w-5xl">
        
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary font-bold tracking-wider">
            OUR STORY
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-tight">
            About <span className="text-primary italic underline decoration-zinc-200 underline-offset-8">Tour Hobe</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl font-medium leading-relaxed">
            Bangladesh&apos;s premier social travel platform designed to bridge the gap between solo curiosity and group security.
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[3rem] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-16 space-y-16">
            
            <div className="grid md:grid-cols-2 gap-12">
              <section className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Compass className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-zinc-900">
                  Project Overview
                </h2>
                <p className="text-zinc-600 leading-relaxed font-medium">
                  Tour Hobe is a modern travel meetup ecosystem built for the Bangladeshi community. 
                  We transform the hesitation of traveling alone into a shared adventure by connecting you with verified companions heading to the same destinations. 
                  Whether it&apos;s trekking in Bandarban or relaxing in Cox&apos;s Bazar, we make group travel accessible and safe.
                </p>
              </section>

              <section className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Target className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-zinc-900">
                  Our Mission
                </h2>
                <p className="text-zinc-600 leading-relaxed font-medium">
                  Our mission is to democratize travel across Bangladesh. We believe journeys are safer, more affordable, and infinitely more memorable when shared. 
                  By fostering a high-trust environment through verified profiles, we ensure that no one has to cancel a dream trip due to a lack of travel partners.
                </p>
              </section>
            </div>

            <Separator className="bg-zinc-100" />

            <section className="space-y-10">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                  <Sparkles className="w-4 h-4" /> Capabilities
                </div>
                <h2 className="text-3xl font-black tracking-tight text-zinc-900">
                  What You Can Do
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: "Manage Plans", 
                    desc: "Design detailed itineraries and set your budget preferences.",
                    icon: CheckCircle2 
                  },
                  { 
                    title: "Explore Feed", 
                    desc: "Discover public journeys shared by experienced explorers.",
                    icon: Globe 
                  },
                  { 
                    title: "Find Buddies", 
                    desc: "Connect with travelers who match your vibe and schedule.",
                    icon: Users 
                  },
                  { 
                    title: "Save Costs", 
                    desc: "Split microbus rents and accommodation costs with your team.",
                    icon: Compass 
                  },
                ].map((feature, index) => (
                  <div key={index} className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:border-primary/20 transition-all group">
                    <feature.icon className="w-8 h-8 text-zinc-400 mb-4 group-hover:text-primary transition-colors" />
                    <h3 className="font-bold text-zinc-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                <p className="text-zinc-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  Whether you&apos;re planning a tea-garden trail in Sylhet or a sunset at the beach, 
                  <span className="text-white font-bold"> Tour Hobe </span> is built to make your next journey happen.
                </p>
                <p className="text-primary text-2xl font-black tracking-tighter italic">
                  Your tribe is waiting. Let&apos;s go!
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="mt-12 text-center text-zinc-400 font-bold text-xs uppercase tracking-widest">
          Tour Hobe &bull; Bangladesh Verified Travel Network
        </div>
      </div>
    </div>
  );
};

export default AboutPage;