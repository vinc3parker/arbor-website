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
    <section className="site-container py-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {detailedDescription && (
          <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
            <p className="ui-kicker">The idea</p>
            <h2 className="type-h2 mb-6">What is {appName}?</h2>
            <p className="text-fg-2">{detailedDescription}</p>
          </div>
        )}

        {targetAudience && (
          <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
            <p className="ui-kicker">Who it&apos;s for</p>
            <h2 className="type-h2 mb-6">Who is {appName} for?</h2>
            <p className="text-fg-2">{targetAudience}</p>
          </div>
        )}
      </div>
    </section>
  );
}
