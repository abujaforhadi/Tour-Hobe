/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react"; // Added useState
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  ShieldCheck,
  Eye,    // Added Eye icon
  EyeOff  // Added EyeOff icon
} from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { registerSchema, RegType } from "@/zod/auth/auth.validator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: RegType) {
    try {
      await registerUser(data);
      
      Swal.fire({
        title: "Welcome to Tour Hobe!",
        text: "Your explorer account has been created successfully.",
        icon: "success",
        confirmButtonColor: "#f97316",
      });
      router.push("/");
    } catch (err: any) {
      Swal.fire({
        title: "Registration Failed",
        text: err?.response?.data?.message || err.message,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-muted/30">
      <Card className="w-full max-w-lg border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-background">
        {/* Premium Dark Header */}
        <CardHeader className="space-y-4 pt-10 pb-8 text-center bg-zinc-900 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
          </div>
          
          <div className="space-y-1 relative z-10">
            <CardTitle className="text-3xl font-black italic tracking-tighter">
              Join <span className="text-primary">Tour Hobe</span>
            </CardTitle>
            <CardDescription className="text-zinc-400 font-medium">
              Create your explorer account to start planning journeys.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8 md:p-10 pt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Full Name */}
              <FormField<RegType, "fullName">
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Md. Abu Jafor" 
                          className="pl-10 h-12 rounded-xl bg-muted/50 border-border focus-visible:ring-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField<RegType, "email">
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="jafor@example.com" 
                          className="pl-10 h-12 rounded-xl bg-muted/50 border-border focus-visible:ring-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              {/* Password with Toggle */}
              <FormField<RegType, "password">
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                      Security Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} // Dynamic type
                          placeholder="••••••••" 
                          className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-border focus-visible:ring-primary" 
                          {...field} 
                        />
                        {/* Toggle Button */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="terms" 
                  className="mt-1 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                  required
                />
                <label 
                  htmlFor="terms" 
                  className="text-xs font-medium text-muted-foreground leading-relaxed cursor-pointer select-none"
                >
                  By creating an account, you agree to our{" "}
                  <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and{" "}
                  <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl text-md font-black shadow-xl shadow-primary/10 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black">
              <span className="bg-background px-4 text-muted-foreground tracking-[0.2em]">Already an Explorer?</span>
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-border group" asChild>
              <Link href="/login">
                Sign in to your Account
              </Link>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="bg-zinc-50 py-4 flex justify-center border-t border-border/50">
          <p className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Secure & Verified Community
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}