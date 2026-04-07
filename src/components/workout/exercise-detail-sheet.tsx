"use client";

import type { PlanItemWithExercise } from "@/types/workout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Timer,
  Dumbbell,
  Activity,
  Target,
  Maximize2,
  MoveDown,
  RotateCcw,
  Repeat,
  Clock,
  User,
  StickyNote,
  Info,
  ExternalLink,
  Scale,
} from "lucide-react";
import { ExerciseImageCarousel } from "@/components/workout/exercise-image-carousel";

export function getCategoryIcon(category: string, className = "h-5 w-5") {
  switch (category) {
    case "cardio":
      return <Timer className={className} />;
    case "core":
      return <Activity className={className} />;
    case "lower_body":
      return <MoveDown className={className} />;
    case "upper_body":
      return <Dumbbell className={className} />;
    case "balance":
      return <Target className={className} />;
    case "flexibility":
      return <Maximize2 className={className} />;
    default:
      return <Dumbbell className={className} />;
  }
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    cardio: "Cardio",
    core: "Core",
    lower_body: "Arti inferiori",
    upper_body: "Arti superiori",
    balance: "Equilibrio",
    flexibility: "Flessibilità",
    general: "Generale",
  };
  return labels[category] ?? category;
}

interface ExerciseDetailSheetProps {
  item: PlanItemWithExercise | null;
  open: boolean;
  onClose: () => void;
}

export function ExerciseDetailSheet({
  item,
  open,
  onClose,
}: ExerciseDetailSheetProps) {
  if (!item) return null;

  const isTimed = item.duration != null;
  const category = item.exercise.category;

  // Parse notes: "carico_value|||note_fisio_value"
  const rawNotes = item.notes ?? "";
  const [carico, noteFisio] = rawNotes.includes("|||")
    ? rawNotes.split("|||")
    : ["", rawNotes];
  const caricoTrimmed = carico.trim();
  const noteFisioTrimmed = noteFisio.trim();

  const restSeconds = item.rest_time ?? 0;
  const restLabel =
    restSeconds >= 60
      ? `${Math.floor(restSeconds / 60)}min${restSeconds % 60 ? ` ${restSeconds % 60}s` : ""}`
      : `${restSeconds}s`;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton
        className="rounded-t-3xl max-h-[85dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
      >
        {/* Drag handle visual */}
        <div className="flex justify-center pt-2 pb-0">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-6 pt-4 pb-2">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1"
            >
              {getCategoryIcon(category, "h-3.5 w-3.5")}
              {getCategoryLabel(category)}
            </Badge>
            {item.per_lato && (
              <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Per lato
              </Badge>
            )}
          </div>

          <SheetTitle className="text-2xl font-extrabold leading-tight text-left">
            {item.exercise.name}
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Repeat className="h-4 w-4 text-primary" />}
              label="Serie"
              value={`${item.sets}`}
            />
            <StatCard
              icon={
                isTimed ? (
                  <Clock className="h-4 w-4 text-primary" />
                ) : (
                  <RotateCcw className="h-4 w-4 text-primary" />
                )
              }
              label={isTimed ? "Durata" : "Ripetizioni"}
              value={
                isTimed
                  ? item.duration! >= 60
                    ? `${Math.floor(item.duration! / 60)}min${item.duration! % 60 ? ` ${item.duration! % 60}s` : ""}`
                    : `${item.duration}s`
                  : `${item.reps}`
              }
            />
            <StatCard
              icon={<Timer className="h-4 w-4 text-primary" />}
              label="Recupero"
              value={restLabel}
            />
          </div>

          {/* Support images */}
          {(item.exercise.image_urls?.length ?? 0) > 0 && (
            <ExerciseImageCarousel
              images={item.exercise.image_urls}
              exerciseName={item.exercise.name}
            />
          )}

          {/* Carico (load) */}
          {caricoTrimmed && (
            <InfoSection
              icon={<Scale className="h-4 w-4" />}
              title="Carico"
              content={caricoTrimmed}
            />
          )}

          {/* Physio notes */}
          {noteFisioTrimmed && (
            <InfoSection
              icon={<StickyNote className="h-4 w-4" />}
              title="Note del fisioterapista"
              content={noteFisioTrimmed}
            />
          )}

          {/* Exercise description */}
          {item.exercise.description && (
            <InfoSection
              icon={<Info className="h-4 w-4" />}
              title="Descrizione"
              content={item.exercise.description}
            />
          )}

          {/* Video link */}
          {item.exercise.video_url && (
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold gap-2"
              asChild
            >
              <a
                href={item.exercise.video_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Guarda il video
              </a>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-muted p-3 text-center">
      {icon}
      <span className="text-xl font-extrabold leading-none">{value}</span>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

function InfoSection({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        {icon}
        {title}
      </div>
      <p className="text-sm leading-relaxed text-foreground bg-muted/50 rounded-xl px-4 py-3">
        {content}
      </p>
    </div>
  );
}
