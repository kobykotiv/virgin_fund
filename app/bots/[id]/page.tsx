import { notFound } from "next/navigation";
import { getBotById } from "@/lib/api";

export default async function BotPage({ params }: { params: { id: string } }) {
  try {
    const bot = await getBotById(params.id);

    if (!bot) {
      notFound();
    }

    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">{bot.name}</h1>
        <div className="prose dark:prose-invert">
          {/* Render bot details here */}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
