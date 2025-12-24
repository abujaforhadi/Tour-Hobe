/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Link from "next/link";
import { ITravelPlan } from "@/types/travelPlan.interface";
import ClientPlanActions from "@/components/modules/plan/ClientPlanActions";
import LoaderWrapper from "@/lib/LoaderWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarDays, 
  MapPin, 
  Banknote, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Globe,
  Compass,
  CheckCircle2,
  Tag,
  Info
} from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function PlanDetail({ params }: Props) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/travel-plans/${id}`,
    { next: { revalidate: 30 } }
  );

  if (!res.ok) return notFound();

  const j = await res.json();
  const plan: ITravelPlan = j.plan || j.data || j.plans || null;

  if (!plan) return notFound();

  const startDate = plan.startDate ? new Date(plan.startDate) : null;
  const endDate = plan.endDate ? new Date(plan.endDate) : null;
  const host = (plan as any).host;

  // Semantic Status Logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let planStatus = "Upcoming";
  let statusBadgeClass = "bg-secondary text-secondary-foreground border-border";

  if (endDate && new Date(endDate) < today) {
    planStatus = "Completed";
    statusBadgeClass = "bg-muted text-muted-foreground border-border";
  } else if (startDate && new Date(startDate) <= today) {
    planStatus = "Ongoing";
    statusBadgeClass = "bg-primary/10 text-primary border-primary/20";
  }

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-muted/20 pb-16">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/travel-plans" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Plans
            </Link>
            <Badge variant="outline" className={`rounded-full px-4 py-0.5 font-bold uppercase text-[10px] ${statusBadgeClass}`}>
              {planStatus}
            </Badge>
          </div>
        </nav>

        <main className="container mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-6">
              <header className="space-y-4">
                <div className="flex gap-2">
                  <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-bold px-3 py-0.5 uppercase tracking-wider">
                    {plan.travelType || "EXPLORATION"}
                  </Badge>
                  <Badge variant="secondary" className="text-muted-foreground border-none text-[10px] font-bold px-3 py-0.5">
                    <Globe className="w-3 h-3 mr-1" /> {(plan as any).visibility || "Public"}
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-6xl font-black text-foreground tracking-tighter leading-tight">
                  {plan.title || plan.destination}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground font-semibold bg-background w-fit px-4 py-1.5 rounded-xl border border-border shadow-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-lg tracking-tight">{plan.destination}</span>
                </div>
              </header>

              {/* Bento Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <HighlightCard 
                  icon={CalendarDays} 
                  label="Trip Timeline" 
                  value={`${startDate ? startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "—"} - ${endDate ? endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "—"}`} 
                  color="text-primary" 
                />
                <HighlightCard 
                  icon={Banknote} 
                  label="Budget Range" 
                  value={`৳${plan.budgetMin} - ৳${plan.budgetMax}`} 
                  color="text-primary" 
                />
                <HighlightCard 
                  icon={Tag} 
                  label="Plan Identity" 
                  value={`#${plan.id.slice(-6).toUpperCase()}`} 
                  color="text-primary" 
                />
              </div>

              {/* Description Card */}
              <Card className="rounded-[2rem] border-border bg-card shadow-sm overflow-hidden">
                <div className="p-6 md:p-12 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Compass className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">The Itinerary</h3>
                  </div>
                  
                  <Separator className="opacity-50" />
                  
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line italic">
                    &ldquo;{plan.description || "The host is currently finalizing the finer details of this adventure. Contact them to learn more about the schedule and activities."}&rdquo;
                  </p>

                  <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-t border-border/50">
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Posted: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "—"}</div>
                    <div className="flex items-center gap-2 font-bold text-primary"><CheckCircle2 className="w-4 h-4" /> Tour Hobe Verified</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Sidebar: Host & Actions */}
            <div className="lg:col-span-4 space-y-6">
              <aside className="sticky top-24 space-y-6">
                <Card className="rounded-[2rem] border-border bg-card shadow-sm overflow-hidden">
                  {/* Host Card Header */}
                  <div className="bg-foreground p-6 h-24 flex justify-center relative">
                    <div className="absolute inset-0 bg-primary/5" />
                    <Avatar className="h-24 w-24 border-[6px] border-card shadow-xl absolute -bottom-12">
                      <AvatarImage src={host?.profileImage || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black italic">
                        {host?.fullName?.charAt(0) || "H"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <CardContent className="pt-16 pb-10 px-8 space-y-8 flex flex-col items-center">
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <h4 className="text-xl font-black text-foreground tracking-tight">{host?.fullName || "Verified Explorer"}</h4>
                        {host?.isPremium && <ShieldCheck className="w-5 h-5 text-primary fill-primary/10" />}
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground border-border uppercase tracking-widest">
                        {host?.isPremium ? "Premium Member" : "Standard Explorer"}
                      </Badge>
                    </div>

                    <div className="w-full bg-muted/30 rounded-2xl p-5 border border-border/50 text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                        <Info className="w-3 h-3" /> Host Bio
                      </p>
                      <p className="text-sm text-foreground/80 font-medium leading-relaxed italic">
                        {host?.bio || "A travel enthusiast ready to explore the hidden gems of Bangladesh with a great team."}
                      </p>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="w-full space-y-4">
                      {host && (
                        <ClientPlanActions
                          planId={plan.id}
                          hostId={host.id}
                          planEndDate={endDate?.toISOString() || ""}
                          planStartDate={startDate ? startDate.toISOString() : null}
                        />
                      )}
                    </div>
                    
                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
                      Member Since {host?.createdAt ? new Date(host.createdAt).getFullYear() : "2025"}
                    </p>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </LoaderWrapper>
  );
}

/* --- Reusable Mini Component --- */
function HighlightCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="flex flex-col gap-3 p-6 bg-card rounded-[1.5rem] border-border shadow-sm hover:shadow-md transition-all">
      <div className={`p-2 w-fit rounded-lg bg-background border border-border ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-foreground">{value}</p>
      </div>
    </Card>
  );
}