import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Privacy = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prywatność</CardTitle>
        <CardDescription>
          Zarządzaj widocznością swojego profilu.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Label>Profil publiczny</Label>
            <p className="text-sm text-muted-foreground">
              Pozwól innym użytkownikom zobaczyć Twój profil.
            </p>
          </div>
          {/* <Switch checked={isPublic} onCheckedChange={setIsPublic} /> */}
        </div>
      </CardContent>
    </Card>
  );
};
