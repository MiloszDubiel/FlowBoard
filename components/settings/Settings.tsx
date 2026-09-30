"use client";

import { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Bell,
  Palette,
  LockKeyhole,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Profile } from "./Profile";
import { Account } from "./Account";
import { Notification } from "./Notifications";
import { Appirance } from "./Appearance";
import { Privacy } from "./Privacy";
import { Security } from "./Seciurity";

const settingsMenu = [
  { id: "profile", label: "Profil", icon: UserRound },
  { id: "account", label: "Konto", icon: ShieldCheck },
  { id: "notifications", label: "Powiadomienia", icon: Bell },
  { id: "appearance", label: "Wygląd", icon: Palette },
  { id: "privacy", label: "Prywatność", icon: Eye },
  { id: "security", label: "Bezpieczeństwo", icon: LockKeyhole },
] as const;

type SettingsTab = (typeof settingsMenu)[number]["id"];

export default function Settings({ user }: any) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ustawienia</h1>
          <p className="text-sm text-muted-foreground">
            Zarządzaj swoim kontem i dostosuj aplikację.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardContent className="p-3">
              <p className="mb-3 px-3 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Ustawienia użytkownika
              </p>

              <nav className="space-y-1">
                {settingsMenu.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;

                  return (
                    <Button
                      key={item.id}
                      variant={active ? "secondary" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        active ? "bg-accent font-medium" : ""
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          <div className="min-w-0">
            {activeTab === "profile" && <Profile user={user} />}
            {activeTab === "account" && <Account user={user} />}
            {activeTab === "notifications" && <Notification />}
            {activeTab === "appearance" && <Appirance />}
            {activeTab === "privacy" && <Privacy />}
            {activeTab === "security" && <Security />}
          </div>
        </div>
      </div>
    </div>
  );
}
