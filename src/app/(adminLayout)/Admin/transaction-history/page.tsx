/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import LoaderWrapper from "@/lib/LoaderWrapper";
import { Meta } from "@/types/pagination.interface";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Mail,
  Receipt,
  BarChart3
} from "lucide-react";

export default function AdminTransactionsPage() {
  const { user } = useAuth();

  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 13;

  useEffect(() => {
    if (user?.role === "ADMIN") fetchTransactions();
  }, [user, page]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/payments/admin/transactions?page=${page}&limit=${limit}`,
        { credentials: "include" }
      );
      const json = await res.json();

      if (json.ok) {
        setData(json.data);
        setMeta(json.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="font-bold">Admin access only. Please login with an authorized account.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPages = meta?.totalPages ?? 0;
  const currentPage = meta?.page ?? page;

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-muted/30 pb-20">
        {/* Header Section */}
        <header className="bg-background border-b py-10 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-zinc-900 rounded-lg">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-bold">
                    Financial Oversight
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  Global <span className="text-primary italic underline decoration-primary/20 underline-offset-8">Transactions</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                  Reviewing platform-wide revenue and payment lifecycle.
                </p>
              </div>
              <Button 
                onClick={fetchTransactions} 
                variant="outline" 
                className="rounded-xl font-bold bg-background shadow-sm hover:bg-muted"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Ledger
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 mt-10 space-y-8">
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <StatCard label="Total Transactions" value={meta?.total || data.length} icon={CreditCard} />
             <StatCard label="Success Rate" value="98.4%" icon={CheckCircle2} />
             <StatCard label="Monthly Volume" value="৳ 142k" icon={BarChart3} />
          </div>

          <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-background">
            <CardHeader className="bg-zinc-900 text-white p-8">
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                 Transaction Registry
               </CardTitle>
               <CardDescription className="text-zinc-400 font-medium">
                 Authoritative list of all system-generated invoices.
               </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* DESKTOP TABLE */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] h-14">Transaction ID</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px]">Explorer Email</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px]">Plan Ref</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Date</TableHead>
                      <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow><TableCell colSpan={6} className="h-32 text-center font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Ledger...</TableCell></TableRow>
                    ) : data.length === 0 ? (
                       <TableRow><TableCell colSpan={6} className="h-32 text-center font-bold text-muted-foreground">No records found.</TableCell></TableRow>
                    ) : (
                      data.map((tx) => (
                        <TableRow key={tx.id} className="border-border hover:bg-muted/30 transition-colors">
                          <TableCell className="px-8 py-5 font-mono text-[11px] text-muted-foreground uppercase">
                            {tx.transactionId}
                          </TableCell>
                          <TableCell className="font-bold text-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-primary/60" />
                              {tx.user?.email || "Unknown"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={tx.status} />
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-muted-foreground">
                            {tx.description || "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-muted-foreground uppercase">
                              <Calendar className="w-3 h-3" />
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="px-8 text-right">
                            <span className="font-black text-foreground">৳ {tx.amount}</span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden p-6 space-y-4">
                {data.map((tx) => (
                  <div key={tx.id} className="rounded-[1.5rem] border border-border p-5 bg-card space-y-4">
                    <div className="flex justify-between items-start">
                      <p className="font-mono text-[10px] text-muted-foreground uppercase">ID: {tx.transactionId.slice(-12)}</p>
                      <StatusBadge status={tx.status} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest truncate">{tx.user?.email || "Unknown User"}</p>
                      <p className="text-2xl font-black text-foreground">৳ {tx.amount}</p>
                    </div>
                    <div className="pt-4 border-t border-muted flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(tx.createdAt).toLocaleDateString()}</span>
                      <span className="max-w-[120px] truncate italic">{tx.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                variant="outline"
                className="rounded-xl h-11 px-6 font-bold border-border shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>

              <div className="flex items-center bg-background border border-border px-6 h-11 rounded-xl font-black text-sm text-foreground shadow-sm">
                Page {currentPage} <span className="text-muted-foreground mx-2">of</span> {totalPages}
              </div>

              <Button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                variant="outline"
                className="rounded-xl h-11 px-6 font-bold border-border shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </LoaderWrapper>
  );
}

/* --- Helper Components --- */

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <Card className="rounded-[1.5rem] border-border bg-background shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "PAID";
  return (
    <Badge 
      className={`rounded-lg font-bold border-none ${
        isPaid ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
      }`}
    >
      {isPaid ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <AlertCircle className="w-3 h-3 mr-1.5" />}
      {status}
    </Badge>
  );
}