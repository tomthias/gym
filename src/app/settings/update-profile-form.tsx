"use client";

import { useMemo } from "react";
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
import { useI18n } from "@/lib/i18n/client";
import type { Messages } from "@/lib/i18n/messages";

function createSchema(t: Messages["settings"]["profileForm"]) {
  return z.object({
    fullName: z.string().min(1, t.nameRequired).max(100),
    username: z
      .string()
      .min(3, t.usernameMin)
      .max(30, t.usernameMax)
      .regex(/^[a-z0-9_]+$/, t.usernameFormat),
  });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;

export function UpdateProfileForm({
  fullName,
  username,
}: {
  fullName: string;
  username: string | null;
}) {
  const { t: { settings: { profileForm: t } } } = useI18n();
  const schema = useMemo(() => createSchema(t), [t]);
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
      toast.success(t.saved);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">{t.fullName}</Label>
            <Input id="full-name" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">{t.username}</Label>
            <Input
              id="username"
              {...register("username")}
              onBlur={(e) =>
                setValue("username", e.target.value.trim().toLowerCase(), {
                  shouldValidate: true,
                })
              }
              placeholder={t.usernamePlaceholder}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {t.usernameHint}
            </p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.save}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
