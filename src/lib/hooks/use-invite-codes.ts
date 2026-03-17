"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { INVITE_CODE_EXPIRY_DAYS } from "@/lib/utils/constants";
import { generateInviteCode, type InviteCode } from "@/lib/utils/invite";
import { toast } from "sonner";

interface UseInviteCodesOptions {
  limit?: number;
}

export function useInviteCodes({ limit }: UseInviteCodesOptions = {}) {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("invite_codes")
      .select("*")
      .eq("physio_id", user.id)
      .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data } = await query;
    if (data) setCodes(data);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchCodes(); // eslint-disable-line react-hooks/set-state-in-effect -- async fetch pattern
  }, [fetchCodes]);

  const handleCreate = useCallback(async (role: "patient" | "physio" = "patient") => {
    setCreating(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setCreating(false);
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_CODE_EXPIRY_DAYS);

    const { data, error } = await supabase
      .from("invite_codes")
      .insert({
        code: generateInviteCode(),
        physio_id: user.id,
        role,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      toast.error("Errore nella generazione del codice");
      setCreating(false);
      return;
    }

    if (data) {
      setCodes((prev) => {
        const updated = [data, ...prev];
        return limit ? updated.slice(0, limit) : updated;
      });
    }
    setCreating(false);
  }, [limit]);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  return { codes, loading, creating, copiedCode, handleCreate, handleCopy };
}
