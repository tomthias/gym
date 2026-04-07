"use client";

import { useRef, useState } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface ExerciseImageUploaderProps {
  exerciseId: string;
  physioId: string;
  existingUrls: string[];
  onUrlsChange: (urls: string[]) => void;
}

export function ExerciseImageUploader({
  exerciseId,
  physioId,
  existingUrls,
  onUrlsChange,
}: ExerciseImageUploaderProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    const valid: File[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" non è un'immagine valida`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" supera il limite di 5 MB`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of valid) {
      const path = `${physioId}/${exerciseId}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from("exercise-images")
        .upload(path, file);
      if (error) {
        toast.error(`Errore caricamento "${file.name}": ${error.message}`);
        continue;
      }
      const { data } = supabase.storage
        .from("exercise-images")
        .getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    setUploading(false);
    if (newUrls.length > 0) {
      onUrlsChange([...existingUrls, ...newUrls]);
    }
  }

  async function handleRemove(url: string) {
    const marker = "/exercise-images/";
    const i = url.indexOf(marker);
    if (i !== -1) {
      const path = decodeURIComponent(url.slice(i + marker.length));
      await supabase.storage.from("exercise-images").remove([path]);
    }
    onUrlsChange(existingUrls.filter((u) => u !== url));
  }

  return (
    <div className="space-y-3">
      {existingUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingUrls.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
              <img
                src={url}
                alt="Immagine esercizio"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Rimuovi immagine"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed border-border rounded-lg px-3 py-2 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImagePlus className="w-4 h-4" />
        )}
        {uploading ? "Caricamento…" : "Aggiungi immagini"}
      </button>
    </div>
  );
}
