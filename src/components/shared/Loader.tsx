"use client";

import React from "react";
import { Loader2 } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-20 h-20 text-primary animate-spin" strokeWidth={1.5} />
        
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-black tracking-tighter text-foreground">
            TH
          </span>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground animate-pulse">
          Loading Adventure
        </p>
        <div className="h-1 w-24 bg-muted overflow-hidden rounded-full">
          <div className="h-full bg-primary animate-progress-loading w-full" />
        </div>
      </div>
    </div>
  );
};

export default Loader;