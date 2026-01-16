import { Star } from "lucide-react";
import { Card } from '@/components/ui/card';

export const Testimonials = () => (
  <section className="py-24 bg-zinc-50">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-black text-center mb-16">Voices of Explorers</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Tahmid Hasan", role: "Solo Backpacker", text: "Found two amazing buddies for my Sajek trip. We shared the jeep cost and it was 60% cheaper!" },
          { name: "Nabila Ahmed", role: "Photography Enthusiast", text: "Safety was my main concern. The verification process gave me the confidence to join a group trip." },
          { name: "Sifat Karim", role: "Adventure Junkie", text: "Tour Hobe is a game changer for travelers in Bangladesh. The UI is clean and matching is instant." },
        ].map((t, i) => (
          <Card key={i} className="border-none shadow-lg rounded-[2.5rem] p-8 bg-white">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
            </div>
            <p className="text-zinc-600 font-medium italic mb-8">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100" />
              <div>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);