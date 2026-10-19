import { notFound, redirect } from "next/navigation";

import { APP_ORDER } from "@/lib/brand";

type Params = { tool: string };

export function generateStaticParams(): Params[] {
  return APP_ORDER.map((tool) => ({ tool }));
}

export default async function GroveToolPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tool } = await params;

  if (!APP_ORDER.some((id) => id === tool)) notFound();

  redirect("/grove");
}
