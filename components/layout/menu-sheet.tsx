"use client";

import { useState, type ReactNode } from "react";
import { BotMenu } from "@/components/bot-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getBotMenuItems } from "@/lib/bot-menu";
import { telegramGroupUrl } from "@/lib/public-config";

export function MenuSheet({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      {/* O botão de fechar padrão do preset é pequeno e em inglês: usamos o nosso (Fechar, alvo de 40px). */}
      <SheetContent side="right" showCloseButton={false} className="overflow-y-auto data-[side=right]:w-full">
        <SheetHeader>
          <SheetTitle>🎬 AcoPlay</SheetTitle>
          <SheetDescription>O que vamos assistir hoje?</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          <BotMenu items={getBotMenuItems(telegramGroupUrl)} onNavigate={() => setOpen(false)} />
        </div>
        <SheetClose asChild>
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute top-3 right-3 inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-lg hover:bg-muted"
          >
            <span aria-hidden>✕</span>
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
