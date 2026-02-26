"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Link2,
  Loader2,
  Plus,
  Repeat,
  Save,
  Trash2,
  Unlink,
  Zap,
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

export interface PlanItem {
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
  supersetGroup: number | null;
  transitionRest: number;
}

function generateTempId() {
  return Math.random().toString(36).substring(2, 9);
}

interface PlanEditorProps {
  mode: "create" | "edit";
  planId?: string;
  patientId: string;
  initialPlan?: {
    name: string;
    description: string;
    items: PlanItem[];
  };
}

/** Groups consecutive items by supersetGroup for rendering */
type RenderBlock =
  | { type: "standalone"; item: PlanItem; index: number }
  | { type: "superset"; group: number; items: { item: PlanItem; index: number }[] };

function buildRenderBlocks(items: PlanItem[]): RenderBlock[] {
  const blocks: RenderBlock[] = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.supersetGroup != null) {
      const group = item.supersetGroup;
      const groupItems: { item: PlanItem; index: number }[] = [];
      while (i < items.length && items[i].supersetGroup === group) {
        groupItems.push({ item: items[i], index: i });
        i++;
      }
      blocks.push({ type: "superset", group, items: groupItems });
    } else {
      blocks.push({ type: "standalone", item, index: i });
      i++;
    }
  }
  return blocks;
}

export function PlanEditor({
  mode,
  planId,
  patientId,
  initialPlan,
}: PlanEditorProps) {
  const router = useRouter();
  const [planName, setPlanName] = useState(initialPlan?.name ?? "Piano Riabilitazione");
  const [planDescription, setPlanDescription] = useState(initialPlan?.description ?? "");
  const [items, setItems] = useState<PlanItem[]>(initialPlan?.items ?? []);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!initialPlan);
  const [nextSupersetGroup, setNextSupersetGroup] = useState(1);

  // Initialize nextSupersetGroup from existing items
  useEffect(() => {
    if (initialPlan?.items) {
      const maxGroup = initialPlan.items.reduce(
        (max, item) => Math.max(max, item.supersetGroup ?? 0),
        0
      );
      setNextSupersetGroup(maxGroup + 1);
    }
  }, [initialPlan]);

  useEffect(() => {
    async function loadExercises() {
      const supabase = createClient();
      const { data } = await supabase
        .from("exercises")
        .select("id, name, description, category")
        .order("name");
      if (data) setExercises(data);
      setLoading(false);
    }
    loadExercises();
  }, []);

  const addExercise = useCallback((ex: Exercise) => {
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
        supersetGroup: null,
        transitionRest: 10,
      },
    ]);
    setPickerOpen(false);
  }, []);

  const updateItem = useCallback(
    (tempId: string, updates: Partial<PlanItem>) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.tempId !== tempId) return item;
          const updated = { ...item, ...updates };
          // If sets changed and item is in a superset, sync all items in the group
          if (updates.sets != null && item.supersetGroup != null) {
            return updated; // handled below
          }
          return updated;
        })
      );
      // Sync sets across superset group
      if (updates.sets != null) {
        setItems((prev) => {
          const target = prev.find((i) => i.tempId === tempId);
          if (!target || target.supersetGroup == null) return prev;
          return prev.map((i) =>
            i.supersetGroup === target.supersetGroup
              ? { ...i, sets: updates.sets! }
              : i
          );
        });
      }
    },
    []
  );

  const removeItem = useCallback((tempId: string) => {
    setItems((prev) => {
      const removing = prev.find((i) => i.tempId === tempId);
      const filtered = prev.filter((i) => i.tempId !== tempId);
      // If removing from a superset, check if only 1 item remains → dissolve
      if (removing?.supersetGroup != null) {
        const remaining = filtered.filter(
          (i) => i.supersetGroup === removing.supersetGroup
        );
        if (remaining.length <= 1) {
          return filtered.map((i) =>
            i.supersetGroup === removing.supersetGroup
              ? { ...i, supersetGroup: null }
              : i
          );
        }
      }
      return filtered;
    });
  }, []);

  const moveItem = useCallback((index: number, direction: "up" | "down") => {
    setItems((prev) => {
      const newItems = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= newItems.length) return prev;
      // Don't allow moving out of a superset group
      const item = newItems[index];
      const swapItem = newItems[swapIndex];
      if (
        item.supersetGroup != null &&
        swapItem.supersetGroup !== item.supersetGroup
      )
        return prev;
      [newItems[index], newItems[swapIndex]] = [
        newItems[swapIndex],
        newItems[index],
      ];
      return newItems;
    });
  }, []);

  const toggleSupersetLink = useCallback(
    (index: number) => {
      setItems((prev) => {
        const a = prev[index];
        const b = prev[index + 1];
        if (!a || !b) return prev;

        const newItems = [...prev];

        // If both are in the same superset, unlink them
        if (
          a.supersetGroup != null &&
          a.supersetGroup === b.supersetGroup
        ) {
          // Check if this is breaking the group in the middle or at the edge
          const groupItems = newItems.filter(
            (i) => i.supersetGroup === a.supersetGroup
          );
          if (groupItems.length <= 2) {
            // Dissolve the entire group
            return newItems.map((i) =>
              i.supersetGroup === a.supersetGroup
                ? { ...i, supersetGroup: null }
                : i
            );
          }
          // Split: items at/before index keep old group, items after get new group
          const newGroup = nextSupersetGroup;
          setNextSupersetGroup((g) => g + 1);
          let pastSplit = false;
          return newItems.map((i, idx) => {
            if (idx === index + 1 && i.supersetGroup === a.supersetGroup)
              pastSplit = true;
            if (pastSplit && i.supersetGroup === a.supersetGroup)
              return { ...i, supersetGroup: newGroup };
            return i;
          });
        }

        // Link: merge groups or create new one
        const group =
          a.supersetGroup ?? b.supersetGroup ?? nextSupersetGroup;
        if (a.supersetGroup == null && b.supersetGroup == null) {
          setNextSupersetGroup((g) => g + 1);
        }

        // Sync sets to first item's value
        const syncSets = a.sets;

        // If b is in a different group, merge that whole group
        const bOldGroup = b.supersetGroup;

        return newItems.map((i) => {
          if (i.tempId === a.tempId)
            return { ...i, supersetGroup: group, sets: syncSets };
          if (i.tempId === b.tempId)
            return { ...i, supersetGroup: group, sets: syncSets };
          if (bOldGroup != null && i.supersetGroup === bOldGroup)
            return { ...i, supersetGroup: group, sets: syncSets };
          if (a.supersetGroup != null && i.supersetGroup === a.supersetGroup)
            return { ...i, sets: syncSets };
          return i;
        });
      });
    },
    [nextSupersetGroup]
  );

  const breakSuperset = useCallback((group: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.supersetGroup === group ? { ...i, supersetGroup: null } : i
      )
    );
  }, []);

  const updateSupersetTransitionRest = useCallback(
    (group: number, value: number) => {
      setItems((prev) =>
        prev.map((i) =>
          i.supersetGroup === group
            ? { ...i, transitionRest: Math.max(0, value) }
            : i
        )
      );
    },
    []
  );

  const handleSave = useCallback(
    async (activate: boolean) => {
      if (!items.length) return;
      setSaving(true);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSaving(false);
        return;
      }

      const planItems = items.map((item, index) => ({
        exercise_id: item.exerciseId,
        order: index + 1,
        sets: item.sets,
        reps: item.type === "reps" ? item.reps : null,
        duration: item.type === "timed" ? item.duration : null,
        rest_time: item.restTime,
        rest_after: item.restAfter,
        notes: item.notes || null,
        superset_group: item.supersetGroup,
        transition_rest: item.transitionRest,
      }));

      if (mode === "edit" && planId) {
        // Update existing plan
        const { error: updateError } = await supabase
          .from("workout_plans")
          .update({
            name: planName,
            description: planDescription || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", planId)
          .eq("physio_id", user.id);

        if (updateError) {
          alert("Errore nell'aggiornamento della scheda");
          setSaving(false);
          return;
        }

        // Delete old items and insert new
        const { error: deleteError } = await supabase
          .from("plan_items")
          .delete()
          .eq("plan_id", planId);

        if (deleteError) {
          alert("Errore nell'aggiornamento degli esercizi");
          setSaving(false);
          return;
        }

        const { error: insertError } = await supabase
          .from("plan_items")
          .insert(planItems.map((pi) => ({ ...pi, plan_id: planId })));

        if (insertError) {
          alert("Errore nell'inserimento degli esercizi");
          setSaving(false);
          return;
        }
      } else {
        // Create new plan
        const { data: plan, error: planError } = await supabase
          .from("workout_plans")
          .insert({
            patient_id: patientId,
            physio_id: user.id,
            name: planName,
            description: planDescription || null,
            active: activate,
          })
          .select()
          .single();

        if (planError || !plan) {
          alert("Errore nella creazione della scheda");
          setSaving(false);
          return;
        }

        const { error: itemsError } = await supabase
          .from("plan_items")
          .insert(planItems.map((pi) => ({ ...pi, plan_id: plan.id })));

        if (itemsError) {
          alert("Errore nell'inserimento degli esercizi");
          setSaving(false);
          return;
        }
      }

      setSaving(false);
      router.push("/physio/dashboard");
    },
    [items, planName, planDescription, mode, planId, patientId, router]
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const renderBlocks = buildRenderBlocks(items);

  return (
    <div className="px-4 pt-4 lg:px-0 lg:pt-0 space-y-4">
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
        <h3 className="font-semibold">Esercizi ({items.length})</h3>

        {renderBlocks.map((block) => {
          if (block.type === "standalone") {
            const { item, index } = block;
            return (
              <div key={item.tempId}>
                <ExerciseCard
                  item={item}
                  index={index}
                  totalItems={items.length}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  onMove={moveItem}
                />
                {/* Connector button to next item */}
                {index < items.length - 1 && (
                  <SupersetConnector
                    index={index}
                    linked={false}
                    onToggle={toggleSupersetLink}
                  />
                )}
              </div>
            );
          }

          // Superset group
          return (
            <div key={`ss-${block.group}`}>
              <div className="rounded-lg border-2 border-golden-300 bg-golden-50/30 dark:bg-golden-950/20 p-2 space-y-2">
                <div className="flex items-center justify-between px-2">
                  <Badge className="bg-golden-100 text-golden-700 gap-1">
                    <Zap className="h-3 w-3" />
                    Superserie ({block.items.length} esercizi)
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => breakSuperset(block.group)}
                  >
                    <Unlink className="h-3 w-3" />
                    Sciogli
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <Label className="text-xs">Pausa transizione (sec)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={block.items[0].item.transitionRest}
                    onChange={(e) =>
                      updateSupersetTransitionRest(
                        block.group,
                        Number(e.target.value) || 0
                      )
                    }
                    className="h-7 w-20 text-xs"
                  />
                </div>
                {block.items.map(({ item, index }, i) => (
                  <div key={item.tempId}>
                    <ExerciseCard
                      item={item}
                      index={index}
                      totalItems={items.length}
                      onUpdate={updateItem}
                      onRemove={removeItem}
                      onMove={moveItem}
                      supersetLabel={String.fromCharCode(65 + i)}
                    />
                    {/* Connector between superset items */}
                    {i < block.items.length - 1 && (
                      <SupersetConnector
                        index={index}
                        linked={true}
                        onToggle={toggleSupersetLink}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Connector after superset group to next block */}
              {block.items[block.items.length - 1].index <
                items.length - 1 && (
                <SupersetConnector
                  index={block.items[block.items.length - 1].index}
                  linked={false}
                  onToggle={toggleSupersetLink}
                />
              )}
            </div>
          );
        })}

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

      {/* Save buttons */}
      {mode === "create" ? (
        <div className="flex gap-2">
          <Button
            onClick={() => handleSave(false)}
            disabled={!items.length || saving}
            variant="outline"
            className="flex-1 gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            Salva bozza
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={!items.length || saving}
            className="flex-1 gap-2"
            size="lg"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salva e attiva
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => handleSave(false)}
          disabled={!items.length || saving}
          className="w-full gap-2"
          size="lg"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salva modifiche
        </Button>
      )}
    </div>
  );
}

// --- Sub-components ---

function SupersetConnector({
  index,
  linked,
  onToggle,
}: {
  index: number;
  linked: boolean;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="flex justify-center -my-1 relative z-10">
      <button
        onClick={() => onToggle(index)}
        className={`flex items-center justify-center h-6 w-6 rounded-full border transition-colors ${
          linked
            ? "bg-golden-100 border-golden-300 hover:bg-golden-200"
            : "bg-background hover:bg-golden-50 border-border"
        }`}
        title={linked ? "Scollega dalla superserie" : "Collega in superserie"}
      >
        <Link2
          className={`h-3 w-3 ${
            linked ? "text-golden-600" : "text-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
}

function ExerciseCard({
  item,
  index,
  totalItems,
  onUpdate,
  onRemove,
  onMove,
  supersetLabel,
}: {
  item: PlanItem;
  index: number;
  totalItems: number;
  onUpdate: (tempId: string, updates: Partial<PlanItem>) => void;
  onRemove: (tempId: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  supersetLabel?: string;
}) {
  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            {supersetLabel ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-golden-100 text-xs font-bold text-golden-700">
                {supersetLabel}
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-600">
                {index + 1}
              </span>
            )}
            <span className="font-medium text-sm">{item.exerciseName}</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onMove(index, "up")}
              disabled={index === 0}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onMove(index, "down")}
              disabled={index === totalItems - 1}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onRemove(item.tempId)}
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
                onUpdate(item.tempId, { type: v as "reps" | "timed" })
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
                onUpdate(item.tempId, {
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
                  onUpdate(item.tempId, {
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
                    onUpdate(item.tempId, {
                      duration: Math.max(5, mins * 60 + secs),
                    });
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
                    const secs = Math.min(
                      59,
                      Math.max(0, Number(e.target.value) || 0)
                    );
                    const mins = Math.floor(item.duration / 60);
                    onUpdate(item.tempId, {
                      duration: Math.max(5, mins * 60 + secs),
                    });
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
                onUpdate(item.tempId, {
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
              onUpdate(item.tempId, { notes: e.target.value })
            }
            placeholder="Note per questo esercizio..."
            className="h-8 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
