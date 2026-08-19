"use client";

import Link from "next/link";
import { Bell, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          FlowBoard
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Powiadomienia">
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Menu użytkownika"
                >
                  <User />
                </Button>
              }
            ></DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Moje konto</DropdownMenuLabel>

                <DropdownMenuItem>
                  <Link href="/dashboard/profile">Profil</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/dashboard/settings">Ustawienia</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem>Wyloguj</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
