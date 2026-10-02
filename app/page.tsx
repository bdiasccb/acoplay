import { BotMenu } from "@/components/bot-menu";
import { getBotMenuItems } from "@/lib/bot-menu";
import { telegramGroupUrl } from "@/lib/public-config";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-bold">O que vamos assistir hoje?</h1>
      <BotMenu items={getBotMenuItems(telegramGroupUrl)} />
    </section>
  );
}
