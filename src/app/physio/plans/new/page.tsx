"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  GripVertical,
  Loader2,
  Plus,
  Repeat,
  Save,
  Trash2,
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

interface PlanItem {
  tempId: string;
  exerciseId: string;
  exerciseName: string;
  type: "reps" | "timed";
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
  restAfter: number;
  notes: string;
}

function generateTempId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function NewPlanPage() {
  const router = useRouter();
  const [planName, setPlanName] = useState("Piano Riabilitazione");
  const [planDescription, setPlanDescription] = useState("");
  const [items, setItems] = useState<PlanItem[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Load exercises
      const { data: exData } = await supabase
        .from("exercises")
        .select("id, name, description, category")
        .order("name");
      if (exData) setExercises(exData);

      // Load existing active plan if any
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: patient } = await supabase
          .from("profiles")
          .select("id")
          .eq("physio_id", user.id)
          .eq("role", "patient")
          .limit(1)
          .maybeSingle();

        if (patient) {
          const { data: plan } = await supabase
            .from("workout_plans")
            .select(
              `
              id, name, description,
              plan_items (
                id, exercise_id, "order", sets, reps, duration, rest_time, rest_after, notes,
                exercises (id, name)
              )
            `
            )
            .eq("patient_id", patient.id)
            .eq("active", true)
            .maybeSingle();

          if (plan) {
            setPlanName(plan.name);
            setPlanDescription(plan.description ?? "");
            const loadedItems: PlanItem[] = (plan.plan_items ?? [])
              .sort((a: any, b: any) => a.order - b.order)
              .map((pi: any) => ({
                tempId: generateTempId(),
                exerciseId: pi.exercise_id,
                exerciseName: pi.exercises?.name ?? "",
                type: pi.duration ? "timed" : "reps",
                sets: pi.sets,
                reps: pi.reps ?? 10,
                duration: pi.duration ?? 30,
                restTime: pi.rest_time,
                restAfter: pi.rest_after ?? 90,
                notes: pi.notes ?? "",
              }));
            setItems(loadedItems);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const addExercise = useCallback(
    (ex: Exercise) => {
      setItems((prev) => [
        ...prev,
        {
          tempId: generateTempId(),
          exerciseId: ex.id,
          exerciseName: ex.name,
          type: "reps",
          sets: 3,
          reps: 10,
          duration: 30,
          restTime: 60,
          restAfter: 90,
          notes: "",
        },
      ]);
      setPickerOpen(false);
    },
    []
  );

  const updateItem = useCallback(
    (tempId: string, updates: Partial<PlanItem>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.tempId === tempId ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  const removeItem = useCallback((tempId: string) => {
    setItems((prev) => prev.filter((item) => item.tempId !== tempId));
  }, []);

  const moveItem = useCallback((index: number, direction: "up" | "down") => {
    setItems((prev) => {
      const newItems = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= newItems.length) return prev;
      [newItems[index], newItems[swapIndex]] = [
        newItems[swapIndex],
        newItems[index],
      ];
      return newItems;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!items.length) return;
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Get patient
    const { data: patient } = await supabase
      .from("profiles")
      .select("id")
      .eq("physio_id", user.id)
      .eq("role", "patient")
      .limit(1)
      .maybeSingle();

    if (!patient) {
      setSaving(false);
      return;
    }

    // Deactivate existing plans
    const { error: deactivateError } = await supabase
      .from("workout_plans")
      .update({ active: false })
      .eq("patient_id", patient.id)
      .eq("active", true);

    if (deactivateError) {
      alert("Errore nella disattivazione della scheda precedente");
      setSaving(false);
      return;
    }

    // Create new plan
    const { data: plan, error: planError } = await supabase
      .from("workout_plans")
      .insert({
        patient_id: patient.id,
        physio_id: user.id,
        name: planName,
        description: planDescription || null,
        active: true,
      })
      .select()
      .single();

    if (planError || !plan) {
      alert("Errore nella creazione della scheda");
      setSaving(false);
      return;
    }

    // Insert plan items
    const planItems = items.map((item, index) => ({
      plan_id: plan.id,
      exercise_id: item.exerciseId,
      order: index + 1,
      sets: item.sets,
      reps: item.type === "reps" ? item.reps : null,
      duration: item.type === "timed" ? item.duration : null,
      rest_time: item.restTime,
      rest_after: item.restAfter,
      notes: item.notes || null,
    }));

    const { error: itemsError } = await supabase.from("plan_items").insert(planItems);
    if (itemsError) {
      alert("Errore nell'inserimento degli esercizi");
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/physio/dashboard");
  }, [items, planName, planDescription, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Editor scheda" />
      <div className="px-4 pt-4 space-y-4 max-w-2xl">
        {/* Plan info */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Nome scheda</Label>
            <Input
              id="plan-name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-desc">Descrizione (opzionale)</Label>
            <Textarea
              id="plan-desc"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              rows={2}
              placeholder="Note sulla scheda..."
            />
          </div>
        </div>

        {/* Exercise list */}
        <div className="space-y-3">
          <h3 className="font-semibold">
            Esercizi ({items.length})
          </h3>

          {items.map((item, index) => (
            <Card key={item.tempId}>
              <CardContent className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-600">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm">
                      {item.exerciseName}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => removeItem(item.tempId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Tipo</Label>
                    <Select
                      value={item.type}
                      onValueChange={(v) =>
                        updateItem(item.tempId, {
                          type: v as "reps" | "timed",
                        })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reps">
                          <span className="flex items-center gap-1">
                            <Repeat className="h-3 w-3" /> Ripetizioni
                          </span>
                        </SelectItem>
                        <SelectItem value="timed">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> A tempo
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Serie</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.sets}
                      onChange={(e) =>
                        updateItem(item.tempId, {
                          sets: Number(e.target.value) || 1,
                        })
                      }
                      className="h-8 text-xs"
                    />
                  </div>

                  {item.type === "reps" ? (
                    <div className="space-y-1">
                      <Label className="text-xs">Ripetizioni</Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.reps}
                        onChange={(e) =>
                          updateItem(item.tempId, {
                            reps: Number(e.target.value) || 1,
                          })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label className="text-xs">Durata</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          value={Math.floor(item.duration / 60)}
                          onChange={(e) => {
                            const mins = Math.max(0, Number(e.target.value) || 0);
                            const secs = item.duration % 60;
                            updateItem(item.tempId, { duration: Math.max(5, mins * 60 + secs) });
                          }}
                          className="h-8 text-xs w-16"
                          placeholder="min"
                        />
                        <span className="text-xs text-muted-foreground">m</span>
                        <Input
                          type="number"
                          min={0}
                          max={59}
                          value={item.duration % 60}
                          onChange={(e) => {
                            const secs = Math.min(59, Math.max(0, Number(e.target.value) || 0));
                            const mins = Math.floor(item.duration / 60);
                            updateItem(item.tempId, { duration: Math.max(5, mins * 60 + secs) });
                          }}
                          className="h-8 text-xs w-16"
                          placeholder="sec"
                        />
                        <span className="text-xs text-muted-foreground">s</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs">Riposo tra serie (sec)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.restTime}
                      onChange={(e) =>
                        updateItem(item.tempId, {
                          restTime: Number(e.target.value) || 0,
                        })
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Note</Label>
                  <Input
                    value={item.notes}
                    onChange={(e) =>
                      updateItem(item.tempId, { notes: e.target.value })
                    }
                    placeholder="Note per questo esercizio..."
                    className="h-8 text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add exercise */}
          <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Aggiungi esercizio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scegli esercizio</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto space-y-2 pt-2">
                {exercises.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    Nessun esercizio. Creane uno dalla libreria.
                  </p>
                ) : (
                  exercises.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => addExercise(ex)}
                      className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors text-left"
                    >
                      <div>
                        <p className="font-medium text-sm">{ex.name}</p>
                        {ex.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {ex.description}
                          </p>
                        )}
                      </div>
                      <Plus className="h-4 w-4 text-teal-600 shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={!items.length || saving}
          className="w-full gap-2"
          size="lg"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salva e attiva scheda
        </Button>
      </div>
    </div>
  );
}
