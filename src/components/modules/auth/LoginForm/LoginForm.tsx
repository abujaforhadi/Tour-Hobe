/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { loginSchema, LoginType } from "@/zod/auth/auth.validator";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: LoginType) {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err: any) {
      Swal.fire({
        title: "Login Failed",
        text: err?.response?.data?.message || err.message,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-muted/30">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-background">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center bg-foreground text-background relative">
           {/* Decorative background element */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           
           <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <LogIn className="h-7 w-7 text-white" />
            </div>
           </div>
           
           <div className="space-y-1">
            <CardTitle className="text-3xl font-black italic tracking-tighter">Tour Hobe!</CardTitle>
            <CardDescription className="text-zinc-400 font-medium">
              Welcome back explorer. Sign in to your account.
            </CardDescription>
           </div>
        </CardHeader>

        <CardContent className="p-8 pt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField<LoginType, "email">
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="name@example.com" 
                          className="pl-10 h-12 rounded-xl bg-muted/50 border-border focus-visible:ring-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField<LoginType, "password">
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-12 rounded-xl bg-muted/50 border-border focus-visible:ring-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <label 
                    htmlFor="remember" 
                    className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
                  >
                    Remember Me
                  </label>
                </div>
                <Link href="#" className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl text-md font-black shadow-xl shadow-primary/10 transition-transform active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black">
              <span className="bg-background px-4 text-muted-foreground tracking-[0.2em]">New to Tour Hobe?</span>
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-border" asChild>
              <Link href="/register">Create an Explorer Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}