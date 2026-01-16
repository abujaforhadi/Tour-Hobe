import { Users, Map, CheckCircle2, Star } from "lucide-react";

export const Stats = () => {
  const stats = [
    { label: "Active Explorers", val: "12k+", icon: Users },
    { label: "Destinations", val: "180+", icon: Map },
    { label: "Trips Completed", val: "5k+", icon: CheckCircle2 },
    { label: "Community Rating", val: "4.9/5", icon: Star },
  ];

  return (
    <section className="py-20 bg-white border-b">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-3">
              <stat.icon className="w-6 h-6 mx-auto text-primary" />
              <h3 className="text-4xl font-black text-zinc-900">{stat.val}</h3>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};