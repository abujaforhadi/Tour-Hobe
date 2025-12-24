/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Props } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  UserCog 
} from "lucide-react";

export default function ActionButtons({ 
  userId, 
  userName, 
  role, 
  actionLoading, 
  onDelete, 
  onChangeRole 
}: Props) {
  const busy = actionLoading === userId;

  return (
    <div className="flex items-center gap-2">
      {/* Role Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => onChangeRole(userId, role, userName)}
        className="h-9 rounded-xl font-bold border-border hover:bg-muted transition-all flex items-center gap-2"
        title={role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : role === "ADMIN" ? (
          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        )}
        <span className="hidden sm:inline">
          {role === "ADMIN" ? "Demote" : "Promote"}
        </span>
      </Button>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={busy}
        onClick={() => onDelete(userId, userName)}
        className="h-9 rounded-xl font-bold text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
        title="Remove User"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">Delete</span>
      </Button>
    </div>
  );
}