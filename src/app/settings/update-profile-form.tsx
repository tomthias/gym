"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "./actions";

const schema = z.object({
  fullName: z.string().min(1, "Il nome è obbligatorio").max(100),
  username: z
    .string()
    .min(3, "Minimo 3 caratteri")
    .max(30, "Massimo 30 caratteri")
    .regex(
      /^[a-z0-9_]+$/,
      "Solo lettere minuscole, numeri e underscore"
    ),
});

type FormValues = z.infer<typeof schema>;

export function UpdateProfileForm({
  fullName,
  username,
}: {
  fullName: string;
  username: string | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName,
      username: username ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await updateProfile(values);
    if (result.success) {
      toast.success("Profilo aggiornato");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Modifica profilo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Nome completo</Label>
            <Input id="full-name" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username")}
              onBlur={(e) =>
                setValue("username", e.target.value.trim().toLowerCase(), {
                  shouldValidate: true,
                })
              }
              placeholder="es. mario_rossi"
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Solo lettere minuscole, numeri e underscore (3–30 caratteri)
            </p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salva modifiche
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
