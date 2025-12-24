"use client";

import Loader from "@/components/shared/Loader";
import { useEffect, useState } from "react";


export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500); 
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return <>{children}</>;
}
