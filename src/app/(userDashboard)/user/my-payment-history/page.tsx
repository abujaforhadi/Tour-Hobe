/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/shared/Loader";
import { API_BASE } from "@/lib/baseApi";
import { Payment } from "@/types/payment.interface";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Calendar, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  History
} from "lucide-react";
import Link from "next/link";

export default function UserPaymentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPayments();
  }, [user]);

  async function fetchPayments() {
    try {
      const res = await fetch(`${API_BASE}/payments/my-transactions`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.ok) {
        setData(json.data);
      } else {
        console.error("Failed to load payments:", json.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-muted rounded-full text-muted-foreground">
          <CreditCard className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold">Authentication Required</h2>
        <p className="text-muted-foreground">Please login to view your payment history.</p>
        <Button asChild className="rounded-xl font-bold">
          <Link href="/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header Section */}
      <header className="bg-background border-b py-10 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" asChild>
                  <Link href="/user/dashboard">
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-bold">
                  Billing
                </Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Payment <span className="text-primary italic">History</span>
              </h1>
              <p className="text-muted-foreground font-medium">
                Keep track of your subscription payments and transaction receipts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl font-bold bg-background shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Export Statements
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-10">
        <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-background">
          <CardContent className="p-0">
            {data.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">No Transactions Found</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    When you upgrade your account or join premium trips, your receipts will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] h-14">Transaction ID</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px]">Plan / Description</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Date</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Status</TableHead>
                        <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((p) => (
                        <TableRow key={p.id} className="border-muted hover:bg-muted/30 transition-colors">
                          <TableCell className="px-8 py-5 font-mono text-[11px] text-muted-foreground">
                            {p.transactionId}
                          </TableCell>
                          <TableCell className="font-bold text-foreground">
                            {p.description || "Subscription Plan"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(p.createdAt).toLocaleDateString("en-BD", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge status={p.status} />
                          </TableCell>
                          <TableCell className="px-8 text-right">
                            <span className="font-black text-foreground">
                              ৳{p.amount}{" "}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              {p.currency}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* MOBILE CARDS */}
                <div className="md:hidden p-6 space-y-4">
                  {data.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-[1.5rem] border border-border p-5 bg-card space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase">
                          ID: {p.transactionId.slice(-12)}
                        </p>
                        <StatusBadge status={p.status} />
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                          {p.description || "Subscription"}
                        </p>
                        <p className="text-2xl font-black text-foreground">
                          ৳{p.amount}{" "}
                          <span className="text-xs font-bold text-muted-foreground">
                            {p.currency.toUpperCase()}
                          </span>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-muted flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
  if (status === "PAID") {
    return (
      <Badge className="rounded-lg bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold hover:bg-emerald-500/10">
        <CheckCircle2 className="w-3 h-3 mr-1.5" />
        {status}
      </Badge>
    );
  }
  return (
    <Badge className="rounded-lg bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold hover:bg-amber-500/10">
      <AlertCircle className="w-3 h-3 mr-1.5" />
      {status}
    </Badge>
  );
}