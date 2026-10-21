import Image from "next/image";

export function PageIntro({ title, eyebrow, children, image }: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  image?: string;
}) {
  return (
    <header className={`relative isolate overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24 ${image ? "theme-dark bg-bg text-fg" : "bg-surface/50"}`}>
      {image && <><Image src={image} alt="" fill sizes="100vw" loading="eager" className="-z-20 object-cover object-[50%_45%]" /><div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/95 via-ink/75 to-ink/40" /></>}
      <div className="site-container relative">
        <p className="ui-kicker">{eyebrow}</p>
        <h1 className="type-display max-w-4xl">{title}</h1>
        <div className="mt-6 max-w-2xl type-body text-fg-2">{children}</div>
      </div>
    </header>
  );
}
