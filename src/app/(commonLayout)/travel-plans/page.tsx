import PlanCard from "@/components/modules/plan/PlanCard";
import { API_BASE } from "@/lib/baseApi";
import LoaderWrapper from "@/lib/LoaderWrapper";
import { ITravelPlan, PlanPageProps } from "@/types/travelPlan.interface";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Map as MapIcon, 
  LayoutGrid
} from "lucide-react";
import { TravelCardGridSkeleton } from "@/components/modules/travelPlans/TravelCardSkeleton";
import { Suspense } from "react";

export default async function PlansPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const limit = 8; 

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(params.destination && { destination: params.destination }),
    ...(params.travelType && { travelType: params.travelType }),
  });

  const res = await fetch(
    `${API_BASE}/travel-plans?${query.toString()}`,
    { cache: "no-store" }
  );

  const json = await res.json();

  const plans: ITravelPlan[] = json.data || [];
  const meta = json.meta;

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-zinc-50/50 pb-20">
        <div className="bg-white border-b mb-10">
          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 rounded-full px-3 py-1 font-bold tracking-tight">
                    COMMUNITY FEED
                  </Badge>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-zinc-900 lg:text-5xl">
                  Shared <span className="text-primary italic">Journeys</span>
                </h1>
                <p className="text-muted-foreground font-medium text-lg max-w-xl">
                  Browse public itineraries created by the community. Join an existing plan or find inspiration for your next trip.
                </p>
              </div>

              <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-md shadow-xl shadow-primary/20 group" asChild>
                <Link href="/travel-plans/add">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                  Post Your Plan
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-white rounded-xl border shadow-sm">
              <LayoutGrid className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-800 uppercase tracking-widest text-sm">
              Latest Itineraries
            </h2>
            <div className="h-px flex-1 bg-zinc-200" />
            {meta && (
               <p className="text-xs font-bold text-zinc-400">Total {meta.total} Plans</p>
            )}
          </div>

          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-zinc-200 text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
                <MapIcon className="w-10 h-10 text-zinc-200" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900">No trips found</h3>
              <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto">
                The map is empty right now. Be the first one to pin an adventure!
              </p>
              <Button variant="outline" className="mt-8 rounded-full h-12 px-8 font-bold" asChild>
                 <Link href="/travel-plans/add">Create Initial Plan</Link>
              </Button>
            </div>
          ) : (
            <Suspense fallback={<TravelCardGridSkeleton />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </Suspense>
          )}

          {meta?.totalPages > 1 && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 p-1.5 bg-white border rounded-2xl shadow-sm">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={page === 1}
                  className="rounded-xl h-12 w-12 hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
                  asChild
                >
                  <Link href={`?page=${page - 1}`}>
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </Button>

                <div className="px-6 py-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center gap-2">
                   <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Page</span>
                   <span className="text-sm font-bold text-primary">{page}</span>
                   <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">of</span>
                   <span className="text-sm font-bold text-zinc-900">{meta.totalPages}</span>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={page === meta.totalPages}
                  className="rounded-xl h-12 w-12 hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
                  asChild
                >
                  <Link href={`?page=${page + 1}`}>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                {meta.total} adventure leads found across Bangladesh
              </p>
            </div>
          )}
        </main>
      </div>
    </LoaderWrapper>
  );
}