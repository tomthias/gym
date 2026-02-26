"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { EXERCISE_CATEGORIES } from "@/lib/utils/constants";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  category: string;
  video_url: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  core: "Core",
  lower_body: "Gambe",
  upper_body: "Braccia",
  cardio: "Cardio",
  flexibility: "Flessibilita",
  balance: "Equilibrio",
  general: "Generale",
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchExercises = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("exercises")
      .select("*")
      .order("name");
    if (data) setExercises(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setCategory("general");
    setVideoUrl("");
    setEditingId(null);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let error;
    if (editingId) {
      ({ error } = await supabase
        .from("exercises")
        .update({
          name,
          description: description || null,
          category,
          video_url: videoUrl || null,
        })
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("exercises").insert({
        name,
        description: description || null,
        category,
        video_url: videoUrl || null,
        created_by: user.id,
      }));
    }

    setSaving(false);
    if (error) {
      alert("Errore nel salvataggio dell'esercizio");
      return;
    }

    resetForm();
    setDialogOpen(false);
    fetchExercises();
  }, [name, description, category, videoUrl, editingId, resetForm, fetchExercises]);

  const handleEdit = useCallback((ex: Exercise) => {
    setName(ex.name);
    setDescription(ex.description ?? "");
    setCategory(ex.category);
    setVideoUrl(ex.video_url ?? "");
    setEditingId(ex.id);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("exercises").delete().eq("id", id);
      if (error) {
        alert("Errore nell'eliminazione dell'esercizio");
        return;
      }
      fetchExercises();
    },
    [fetchExercises]
  );

  return (
    <div>
      <Header title="Libreria esercizi" />
      <div className="px-4 pt-4 space-y-4 max-w-2xl">
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Nuovo esercizio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Modifica esercizio" : "Nuovo esercizio"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="ex-name">Nome</Label>
                <Input
                  id="ex-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Squat isometrico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ex-desc">Descrizione</Label>
                <Textarea
                  id="ex-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Istruzioni per l'esercizio..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXERCISE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat] ?? cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ex-video">Link video (opzionale)</Label>
                <Input
                  id="ex-video"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={!name || saving}
                className="w-full mt-2"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Salva modifiche" : "Crea esercizio"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-medical-500" />
          </div>
        ) : exercises.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            Nessun esercizio. Creane uno nuovo.
          </p>
        ) : (
          <div className="space-y-2">
            {exercises.map((ex) => (
              <Card key={ex.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{ex.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[ex.category] ?? ex.category}
                      </Badge>
                      {ex.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {ex.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(ex)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(ex.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
