type AppContentSectionProps = {
  appName: string;
  detailedDescription?: string;
  targetAudience?: string;
};

export function AppContentSection({
  appName,
  detailedDescription,
  targetAudience,
}: AppContentSectionProps) {
  if (!detailedDescription && !targetAudience) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-8 py-24">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {detailedDescription && (
          <div>
            <h2 className="mb-6 text-3xl font-semibold">What is {appName}?</h2>
            <p className="text-lg leading-8 text-neutral-400">
              {detailedDescription}
            </p>
          </div>
        )}

        {targetAudience && (
          <div>
            <h2 className="mb-6 text-3xl font-semibold">Who is {appName} for?</h2>
            <p className="text-lg leading-8 text-neutral-400">
              {targetAudience}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
