"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function RowError({ titulo }: { titulo: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <section aria-label={titulo} className="rounded-lg border border-border p-4">
      <h2 className="text-lg font-bold">{titulo}</h2>
      <p className="mt-1 text-sm text-muted-foreground">Não consegui carregar agora.</p>
      <Button
        variant="secondary"
        size="sm"
        className="mt-3"
        disabled={pending}
        onClick={() => startTransition(() => router.refresh())}
      >
        {pending ? "Tentando…" : "Tentar de novo"}
      </Button>
    </section>
  );
}
