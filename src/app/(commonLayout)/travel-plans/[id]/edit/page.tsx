/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  updatePlanSchema, 
  UpdatePlanFormType 
} from "@/zod/plan/plan.validator";
import { API_BASE } from "@/lib/baseApi";
import UserAuthWrapper from "@/lib/UserAuthWrapper";
import LoaderWrapper from "@/lib/LoaderWrapper";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Pencil, 
  MapPin, 
  CalendarDays, 
  Loader2, 
  Globe, 
  Users, 
  Banknote,
  FileText
} from "lucide-react";

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.id as string;

  const form = useForm<UpdatePlanFormType>({
    resolver: zodResolver(updatePlanSchema),
    defaultValues: {
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      description: "",
      budgetMin: "",
      budgetMax: "",
      travelType: "SOLO",
      visibility: "PUBLIC",
    },
  });

  const { setValue, handleSubmit, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (!planId) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/travel-plans/${planId}`, {
          credentials: "include",
        });
        const json = await res.json();

        if (!json.success) {
          Swal.fire("Error", json.message, "error");
          return;
        }

        const p = json.plan;
        setValue("title", p.title || "");
        setValue("destination", p.destination);
        setValue("startDate", p.startDate.split("T")[0]);
        setValue("endDate", p.endDate.split("T")[0]);
        setValue("description", p.description || "");
        setValue("budgetMin", p.budgetMin?.toString() || "");
        setValue("budgetMax", p.budgetMax?.toString() || "");
        setValue("travelType", p.travelType);
        setValue("visibility", p.visibility);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [planId, setValue]);

  const onSubmit = async (data: UpdatePlanFormType) => {
    try {
      const payload = {
        ...data,
        budgetMin: data.budgetMin ? Number(data.budgetMin) : null,
        budgetMax: data.budgetMax ? Number(data.budgetMax) : null,
      };

      const res = await fetch(
        `${API_BASE}/travel-plans/user/update/${planId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (!json.success) {
        Swal.fire("Update Failed", json.message, "error");
        return;
      }

      await Swal.fire({
        title: "Success!",
        text: "Your travel plan has been updated.",
        icon: "success",
        confirmButtonColor: "#f97316",
      });
      router.refresh();
      router.push(`/user/my-posted-plan`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserAuthWrapper>
      <LoaderWrapper>
        <div className="min-h-screen bg-zinc-50/50 py-12 px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Pencil className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                Edit Your <span className="text-primary italic">Adventure</span>
              </h1>
              <p className="text-muted-foreground font-medium">
                Make changes to your itinerary or budget to attract the right buddies.
              </p>
            </div>

            <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-zinc-900 text-white p-8">
                <CardTitle className="text-xl font-bold">Plan Settings</CardTitle>
                <CardDescription className="text-zinc-400 font-medium">
                  ID: {planId}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField<UpdatePlanFormType, "title">
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              Trip Title
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Weekend Getaway" className="h-12 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField<UpdatePlanFormType, "destination">
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" /> Destination
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Sajek" className="h-12 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField<UpdatePlanFormType, "startDate">
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-primary" /> Start Date
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-12 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField<UpdatePlanFormType, "endDate">
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-primary" /> End Date
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-12 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField<UpdatePlanFormType, "description">
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> Description
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about the plan..." 
                              className="min-h-[100px] rounded-2xl resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField<UpdatePlanFormType, "budgetMin">
                        control={form.control}
                        name="budgetMin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              <Banknote className="w-4 h-4 text-primary" /> Min Budget
                            </FormLabel>
                            <FormControl>
                              <Input type="number" className="h-12 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField<UpdatePlanFormType, "budgetMax">
                        control={form.control}
                        name="budgetMax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              <Banknote className="w-4 h-4 text-primary" /> Max Budget
                            </FormLabel>
                            <FormControl>
                              <Input type="number" className="h-12 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField<UpdatePlanFormType, "travelType">
                        control={form.control}
                        name="travelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" /> Travel Type
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["SOLO", "FAMILY", "FRIENDS", "COUPLE", "GROUP"].map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField<UpdatePlanFormType, "visibility">
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-zinc-700 flex items-center gap-2">
                              <Globe className="w-4 h-4 text-primary" /> Visibility
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["PUBLIC", "PRIVATE"].map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-6 border-t border-zinc-100 flex flex-col-reverse sm:flex-row gap-4 items-center justify-between">
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                         Tour Hobe! Safe Travel Network
                       </p>
                       <Button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full sm:w-auto h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary/20"
                       >
                         {isSubmitting ? (
                           <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                         ) : (
                           "Update Plan"
                         )}
                       </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </LoaderWrapper>
    </UserAuthWrapper>
  );
}