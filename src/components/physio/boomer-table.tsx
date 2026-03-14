"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toJpeg } from "html-to-image";
import { Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanItem } from "@/components/physio/plan-editor";
import {
  formatSerieReps,
  formatRest,
  generateRowLabels,
  parseSerieReps,
  parseRest,
} from "@/lib/utils/plan-format";

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

interface BoomerTableProps {
  items: PlanItem[];
  exercises: Exercise[];
  planName: string;
  onAddExercise: (exercise: Exercise) => void;
  onUpdateItem: (tempId: string, updates: Partial<PlanItem>) => void;
  onRemoveItem: (tempId: string) => void;
  onChangeExercise: (tempId: string, exercise: Exercise) => void;
}

const thClass =
  "bg-excel-green dark:bg-excel-green-dark text-excel-cream px-4 py-3 text-sm font-bold uppercase tracking-wider border border-excel-border dark:border-excel-border-dark";

export function BoomerTable({
  items,
  exercises,
  planName,
  onAddExercise,
  onUpdateItem,
  onRemoveItem,
  onChangeExercise,
}: BoomerTableProps) {
  const labels = generateRowLabels(items);
  const tableRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!tableRef.current || items.length === 0) return;
    setDownloading(true);
    try {
      const dataUrl = await toJpeg(tableRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        style: {
          // Remove rounded corners for clean screenshot
          borderRadius: "0",
        },
      });
      const link = document.createElement("a");
      link.download = `${planName || "scheda"}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silently fail — user can retry
    } finally {
      setDownloading(false);
    }
  }, [items.length, planName]);

  return (
    <div className="space-y-3">
      <div
        ref={tableRef}
        className="overflow-x-auto rounded-lg border border-excel-border dark:border-excel-border-dark"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`${thClass} w-[50px]`}>&nbsp;</th>
              <th className={`${thClass} min-w-[200px]`}>Esercizio</th>
              <th className={`${thClass} min-w-[120px]`}>Serie x Reps</th>
              <th className={`${thClass} min-w-[80px]`}>Rest</th>
              <th className={`${thClass} min-w-[150px]`}>Carico</th>
              <th className={`${thClass} min-w-[200px]`}>Note Fisio</th>
              <th
                className={`${thClass} w-[36px] print:hidden`}
                data-html2canvas-ignore
              >
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <BoomerRow
                key={item.tempId}
                item={item}
                label={labels[i]}
                exercises={exercises}
                onUpdate={onUpdateItem}
                onRemove={onRemoveItem}
                onChangeExercise={onChangeExercise}
              />
            ))}
            <AddRow exercises={exercises} onAdd={onAddExercise} />
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="h-4 w-4" />
          {downloading ? "Scaricando..." : "Scarica JPG"}
        </Button>
      )}
    </div>
  );
}

// --- BoomerRow ---

function BoomerRow({
  item,
  label,
  exercises,
  onUpdate,
  onRemove,
  onChangeExercise,
}: {
  item: PlanItem;
  label: string;
  exercises: Exercise[];
  onUpdate: (tempId: string, updates: Partial<PlanItem>) => void;
  onRemove: (tempId: string) => void;
  onChangeExercise: (tempId: string, exercise: Exercise) => void;
}) {
  const [serieText, setSerieText] = useState(() => formatSerieReps(item));
  const [restText, setRestText] = useState(() => formatRest(item));
  const [caricoText, setCaricoText] = useState(
    extractCarico(item.notes)
  );
  const [noteFisioText, setNoteFisioText] = useState(
    extractNoteFisio(item.notes)
  );

  // Sync local state when items change externally (e.g. switching from standard mode)
  useEffect(() => {
    setSerieText(formatSerieReps(item));
    setRestText(formatRest(item));
    setCaricoText(extractCarico(item.notes));
    setNoteFisioText(extractNoteFisio(item.notes));
  }, [item.tempId, item.sets, item.reps, item.duration, item.type, item.restTime, item.supersetGroup, item.notes]);

  const commitSerie = () => {
    const parsed = parseSerieReps(serieText);
    if (Object.keys(parsed).length > 0) {
      const updates: Partial<PlanItem> = { ...parsed };
      if (parsed.notes && !caricoText) {
        delete updates.notes;
      }
      onUpdate(item.tempId, updates);
    }
  };

  const commitRest = () => {
    const { restTime } = parseRest(restText);
    onUpdate(item.tempId, { restTime });
  };

  const commitNotes = () => {
    onUpdate(item.tempId, { notes: mergeNotes(caricoText, noteFisioText) });
  };

  const cellClass =
    "bg-excel-yellow dark:bg-excel-yellow-dark dark:text-excel-cream border border-excel-border dark:border-excel-border-dark";

  const inputClass =
    "w-full bg-transparent border-0 outline-none text-sm px-3 py-3 font-medium uppercase";

  return (
    <tr>
      <td className="bg-excel-green dark:bg-excel-green-dark text-excel-cream text-center font-bold text-sm px-4 py-3 border border-excel-border dark:border-excel-border-dark">
        {label}
      </td>
      <td className={cellClass}>
        <ExerciseAutocomplete
          value={item.exerciseName}
          exercises={exercises}
          onSelect={(ex) => onChangeExercise(item.tempId, ex)}
        />
      </td>
      <td className={cellClass}>
        <input
          value={serieText}
          onChange={(e) => setSerieText(e.target.value)}
          onBlur={commitSerie}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className={`${inputClass} text-center`}
          placeholder="3X10"
        />
      </td>
      <td className={cellClass}>
        <input
          value={restText}
          onChange={(e) => setRestText(e.target.value)}
          onBlur={commitRest}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className={`${inputClass} text-center`}
          placeholder="1'"
        />
      </td>
      <td className={cellClass}>
        <input
          value={caricoText}
          onChange={(e) => setCaricoText(e.target.value)}
          onBlur={commitNotes}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className={inputClass}
          placeholder="/"
        />
      </td>
      <td className={cellClass}>
        <input
          value={noteFisioText}
          onChange={(e) => setNoteFisioText(e.target.value)}
          onBlur={commitNotes}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className={`${inputClass} normal-case`}
          placeholder=""
        />
      </td>
      <td className={`${cellClass} text-center print:hidden`}>
        <button
          onClick={() => onRemove(item.tempId)}
          className="p-1 text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  );
}

// --- Notes helpers ---
// The DB has a single `notes` field. We split it into "carico" and "note fisio"
// using a separator. Format: "CARICO_TEXT|||NOTE_FISIO_TEXT"

const NOTES_SEPARATOR = "|||";

function extractCarico(notes: string): string {
  if (!notes) return "";
  const idx = notes.indexOf(NOTES_SEPARATOR);
  if (idx === -1) return notes;
  return notes.substring(0, idx);
}

function extractNoteFisio(notes: string): string {
  if (!notes) return "";
  const idx = notes.indexOf(NOTES_SEPARATOR);
  if (idx === -1) return "";
  return notes.substring(idx + NOTES_SEPARATOR.length);
}

function mergeNotes(carico: string, noteFisio: string): string {
  const c = carico.trim();
  const n = noteFisio.trim();
  if (!c && !n) return "";
  if (!n) return c;
  return `${c}${NOTES_SEPARATOR}${n}`;
}

// --- AddRow (empty row at bottom with autocomplete) ---

function AddRow({
  exercises,
  onAdd,
}: {
  exercises: Exercise[];
  onAdd: (exercise: Exercise) => void;
}) {
  const cellClass =
    "bg-excel-yellow/50 dark:bg-excel-yellow-dark/50 border border-excel-border dark:border-excel-border-dark";

  return (
    <tr>
      <td className="bg-excel-green/60 dark:bg-excel-green-dark/60 text-excel-cream/60 text-center font-bold text-sm px-4 py-3 border border-excel-border dark:border-excel-border-dark">
        <Plus className="h-3.5 w-3.5 mx-auto" />
      </td>
      <td className={cellClass}>
        <ExerciseAutocomplete
          value=""
          exercises={exercises}
          onSelect={onAdd}
          placeholder="Aggiungi esercizio..."
          clearOnSelect
        />
      </td>
      <td className={cellClass} />
      <td className={cellClass} />
      <td className={cellClass} />
      <td className={cellClass} />
      <td className={cellClass} />
    </tr>
  );
}

// --- ExerciseAutocomplete ---

function ExerciseAutocomplete({
  value,
  exercises,
  onSelect,
  placeholder = "Cerca esercizio...",
  clearOnSelect = false,
}: {
  value: string;
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  placeholder?: string;
  clearOnSelect?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync query when value changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = query
    ? exercises.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase())
      )
    : exercises;

  // Close on outside click (check both input container and portal dropdown)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (ex: Exercise) => {
    onSelect(ex);
    setQuery(clearOnSelect ? "" : ex.name);
    setOpen(false);
    setHighlightIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightIndex]) {
          handleSelect(filtered[highlightIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setQuery(value);
        break;
    }
  };

  // Position the dropdown using a portal so it's not clipped by table overflow
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open, query]);

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlightIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent border-0 outline-none text-sm px-3 py-3 font-medium uppercase"
        placeholder={placeholder}
      />
      {open &&
        filtered.length > 0 &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="max-h-48 overflow-y-auto bg-white dark:bg-neutral-800 border border-excel-border dark:border-excel-border-dark rounded-b shadow-lg"
          >
            {filtered.map((ex, i) => (
              <button
                key={ex.id}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  i === highlightIndex
                    ? "bg-excel-yellow dark:bg-excel-yellow-dark font-medium"
                    : "hover:bg-excel-yellow/50 dark:hover:bg-excel-yellow-dark/50"
                }`}
                onMouseEnter={() => setHighlightIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(ex);
                }}
              >
                <span className="uppercase">{ex.name}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
