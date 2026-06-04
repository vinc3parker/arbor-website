export function Footer() {
  return (
    <footer className="border-t border-neutral-900">

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-8 py-12 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="text-sm font-medium tracking-[0.3em]">
            ARBOR
          </div>

          <p className="mt-3 max-w-md text-sm text-neutral-500">
            Building technology for people who want more from life.
          </p>

        </div>

        <div className="text-sm text-neutral-600">
          © 2026 Arbor
        </div>

      </div>

    </footer>
  );
}