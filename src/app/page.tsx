import { HomeNarrative } from "@/components/home/HomeNarrative";
import { getPageSocialMetadata } from "@/lib/seo";

const title = "Personal self-help apps for a connected life — Arbor";
const description =
  "Meet eight personal guide apps being built for your health, mindset, money, work and more. Arbor brings self-help guidance together around the life you want to build.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "https://arborapps.co/" },
  ...getPageSocialMetadata(title, description, "/"),
};

export default function Home() {
  return (
    <HomeNarrative />
  );
}
