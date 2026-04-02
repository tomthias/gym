import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function DangerZone({ fullName }: { fullName: string }) {
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-lg text-destructive">
          Zona pericolosa
        </CardTitle>
        <CardDescription>
          Le azioni qui sotto sono irreversibili. Procedi con cautela.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DeleteAccountDialog fullName={fullName} />
      </CardContent>
    </Card>
  );
}
