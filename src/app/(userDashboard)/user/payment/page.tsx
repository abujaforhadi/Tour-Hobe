/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import LoaderWrapper from "@/lib/LoaderWrapper";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  CheckCircle2, 
  Smartphone, 
  TicketPercent, 
  CreditCard,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type SubscriptionFormValues = {
  plan: string;
  phone: string;
  coupon?: string;
};

export default function PaymentInitPage() {
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<SubscriptionFormValues>({
    defaultValues: {
      plan: "monthly",
      phone: "",
      coupon: "",
    },
  });

  async function onSubmit(data: SubscriptionFormValues) {
    try {
      const res = await axios.post(`${API_BASE}/payments/init-subscription`, data, { withCredentials: true });
      const { paymentUrl } = res.data.data;
      router.push(paymentUrl);
    } catch (err: any) {
      Swal.fire({
        title: "Payment Error",
        text: err?.response?.data?.message || err.message,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  }

  // Already Premium View
  if (user?.premiumExpiresAt && new Date(user.premiumExpiresAt) > new Date()) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 bg-zinc-50/50">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white text-center">
          <div className="bg-zinc-900 py-12 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse" />
              <Crown className="w-20 h-20 text-primary relative z-10" />
            </div>
          </div>
          <CardContent className="p-10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-zinc-900">Premium Active</h2>
              <p className="text-zinc-500 font-medium">You are currently enjoying full access to Tour Hobe benefits.</p>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Valid Until</p>
              <p className="text-xl font-black text-zinc-900">
                {new Date(user.premiumExpiresAt).toLocaleDateString("en-BD", { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <Button variant="outline" className="w-full h-12 rounded-xl font-bold" onClick={() => router.push('/user/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-zinc-50/50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Benefits Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                Upgrade Your Journey
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-tight">
                Unlock <span className="text-primary italic">Premium</span> <br /> Features
              </h1>
              <p className="text-lg text-zinc-500 font-medium max-w-lg">
                Join our elite community to get better buddy matches, verified priority, and exclusive travel tools.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "Priority NID Verification Badge",
                "Advanced Buddy Matching Filters",
                "Unlimited Join Requests",
                "Private Trip Visibility Options",
                "Direct Messaging Priority"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-zinc-700">{text}</span>
                </div>
              ))}
            </div>

            <Card className="bg-zinc-900 border-none rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
               <Zap className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 text-primary/10 group-hover:scale-110 transition-transform" />
               <div className="relative z-10">
                 <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">LIMITED OFFER</p>
                 <h3 className="text-2xl font-bold mb-2">Save 10% Today!</h3>
                 <p className="text-zinc-400 font-medium">Use code <span className="text-white font-bold">TRAVEL10</span> during checkout.</p>
               </div>
            </Card>
          </div>

          {/* Right: Payment Card */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="bg-white p-8 pb-4 text-center">
                <CardTitle className="text-2xl font-black">Secure Checkout</CardTitle>
                <CardDescription className="font-medium">Powered by SSLCommerz</CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField<SubscriptionFormValues, "plan">
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">Choose Plan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 font-bold">
                                <SelectValue placeholder="Select a plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                              <SelectItem value="monthly" className="py-3">
                                Monthly — BDT {process.env.NEXT_PUBLIC_PRICE_MONTHLY || "299"}
                              </SelectItem>
                              <SelectItem value="yearly" className="py-3">
                                Yearly — BDT {process.env.NEXT_PUBLIC_PRICE_YEARLY || "2999"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField<SubscriptionFormValues, "phone">
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
                            <Smartphone className="w-3 h-3 text-primary" /> Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="017xxxxxxxx" 
                              className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus-visible:ring-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField<SubscriptionFormValues, "coupon">
                      control={form.control}
                      name="coupon"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
                            <TicketPercent className="w-3 h-3 text-primary" /> Coupon Code
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="TRAVEL10" 
                              className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus-visible:ring-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                        <CreditCard className="w-5 h-5 mr-3" />
                        Proceed to Payment
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>

              <CardFooter className="bg-zinc-50 p-6 flex flex-col items-center">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Secure Transaction &bull; No Hidden Charges
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
}