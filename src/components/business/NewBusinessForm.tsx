"use client";

import { useActionState, useState, useTransition } from "react";
import { addBusiness, checkLocation, type FormState, type LocationCheck } from "@/app/business/actions";
import type { ExistingListing } from "@/lib/arbor-business";
import { BusinessMap, type MapPoint } from "./BusinessMapLoader";
import { ClaimForm } from "./ClaimForm";
import { BUSINESS_KINDS, offeringLabel } from "./options";
import { OfferingPicker } from "./OfferingPicker";

const initialState: FormState = {};

function distanceLabel(meters: number | null): string | null {
  if (meters == null) return null;
  return meters < 1000 ? `${Math.round(meters / 10) * 10} m away` : `${(meters / 1000).toFixed(1)} km away`;
}

/**
 * Adding a business, in two steps. First we put the address on the map and show
 * what's already there ("Is your business already on Arbor?"), so people claim
 * an existing listing instead of duplicating it. Only then do we ask for details.
 */
export function NewBusinessForm() {
  const [step, setStep] = useState<"locate" | "details">("locate");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [check, setCheck] = useState<LocationCheck | null>(null);
  const [pin, setPin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checking, startCheck] = useTransition();

  function runCheck(nextPin?: { latitude: number; longitude: number } | null) {
    startCheck(async () => {
      const result = await checkLocation({ name, address, postcode, pin: nextPin ?? null });
      setCheck(result);
      setPin(result.pin);
      setSelectedId(result.matches[0]?.id ?? null);
    });
  }

  const listings = check ? [...check.matches, ...check.nearby] : [];
  const points: MapPoint[] = check
    ? [
        ...check.matches.map((listing) => ({ listing, tone: "match" as const })),
        ...check.nearby.map((listing) => ({ listing, tone: "nearby" as const })),
      ]
        .filter(({ listing }) => listing.latitude != null && listing.longitude != null)
        .map(({ listing, tone }) => ({
          id: listing.id, name: listing.name, latitude: listing.latitude!, longitude: listing.longitude!, tone,
        }))
    : [];

  if (step === "details" && check) {
    return <DetailsStep name={name} address={address} postcode={postcode} pin={pin} onPinMove={(latitude, longitude) => setPin({ latitude, longitude })} onBack={() => setStep("locate")} />;
  }

  return (
    <div className="mt-10 space-y-8">
      <form
        className="ui-surface grid gap-5 p-6 sm:grid-cols-[1fr_1fr_10rem_auto] sm:items-end sm:p-8"
        onSubmit={(event) => { event.preventDefault(); runCheck(); }}
      >
        <p className="sm:col-span-4">
          <span className="font-semibold">Step 1 of 2: Is your business already on Arbor?</span>
          <span className="ui-copy block">Tell us where you are and we&apos;ll show you what&apos;s already on the map there.</span>
        </p>
        <label className="grid gap-2">
          <span className="ui-label">Business name</span>
          <input className="ui-field" value={name} onChange={(event) => setName(event.target.value)} required maxLength={160} />
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Address</span>
          <input className="ui-field" value={address} onChange={(event) => setAddress(event.target.value)} required autoComplete="street-address" />
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Postcode</span>
          <input className="ui-field" value={postcode} onChange={(event) => setPostcode(event.target.value)} autoComplete="postal-code" />
        </label>
        <button type="submit" className="ui-primary" disabled={checking}>{checking ? "Checking" : "Check the map"}</button>
      </form>

      {check?.error && <p className="text-danger">{check.error}</p>}

      {check && !check.error && (
        <section aria-live="polite" className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <BusinessMap
              pin={pin}
              points={points}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                document.getElementById(`listing-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
              onPinMove={(latitude, longitude) => runCheck({ latitude, longitude })}
              className="h-80 sm:h-[28rem]"
            />
            <p className="mt-2 type-caption text-fg-2">
              {pin
                ? "The black pin is the address you entered. Not quite right? Drag it, or click where your entrance is."
                : "We couldn't find that address. Click the map where your business is."}
              {" "}Amber dots may be your business; grey dots are other listings nearby.
            </p>
          </div>

          <div className="space-y-4">
            {check.matches.length > 0 ? (
              <h2 className="text-lg font-semibold">This looks like it might be you</h2>
            ) : (
              <h2 className="text-lg font-semibold">
                {check.nearby.length ? "Nothing with your name here, but check what's nearby" : "Nothing on the map here yet"}
              </h2>
            )}
            <ul className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
              {listings.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  isMatch={check.matches.some((match) => match.id === listing.id)}
                  selected={listing.id === selectedId}
                  onSelect={() => setSelectedId(listing.id)}
                />
              ))}
            </ul>
            <div className="ui-surface p-5">
              <p className="font-medium">
                {listings.length ? "None of these are my business" : "My business isn't on the map yet"}
              </p>
              <p className="ui-copy mt-1">Add it as a new listing. We&apos;ll check it before it goes live.</p>
              <button type="button" className="ui-primary mt-4" onClick={() => setStep("details")} disabled={!pin}>
                Continue to add it
              </button>
              {!pin && <p className="mt-2 type-caption text-warning">Place your business on the map first.</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ListingRow({
  listing,
  isMatch,
  selected,
  onSelect,
}: {
  listing: ExistingListing;
  isMatch: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li id={`listing-${listing.id}`} className={`ui-surface p-4 transition ${selected ? "border-fg" : ""}`}>
      <button type="button" onClick={onSelect} className="w-full text-left">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{listing.name}</span>
          {isMatch && <span className="ui-status border-warning text-warning">Possible match</span>}
          {listing.managed && <span className="ui-status">Run by its owner</span>}
        </span>
        <span className="type-caption block text-fg-2">
          {[listing.location, distanceLabel(listing.distanceMeters), ...listing.reasons.filter((reason) => !reason.endsWith("away"))]
            .filter(Boolean).join(" · ")}
        </span>
        {listing.activities.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-1.5">
            {listing.activities.slice(0, 5).map((slug) => <span key={slug} className="ui-status text-xs">{offeringLabel(slug)}</span>)}
          </span>
        )}
      </button>
      <ClaimForm placeId={listing.id} placeName={listing.name} managed={listing.managed} />
    </li>
  );
}

function DetailsStep({
  name,
  address,
  postcode,
  pin,
  onPinMove,
  onBack,
}: {
  name: string;
  address: string;
  postcode: string;
  pin: { latitude: number; longitude: number } | null;
  onPinMove: (latitude: number, longitude: number) => void;
  onBack: () => void;
}) {
  const [state, formAction, pending] = useActionState(addBusiness, initialState);

  return (
    <form action={formAction} className="ui-surface mt-10 grid max-w-3xl gap-6 p-6 sm:p-8">
      <p>
        <span className="font-semibold">Step 2 of 2: Tell us about {name}</span>
        <button type="button" onClick={onBack} className="ml-3 type-caption text-fg-2 underline">Back to the map</button>
      </p>
      <input type="hidden" name="latitude" value={pin?.latitude ?? ""} />
      <input type="hidden" name="longitude" value={pin?.longitude ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-2">
          <span className="ui-label">Business name</span>
          <input name="name" className="ui-field" defaultValue={name} required maxLength={160} />
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Address</span>
          <input name="address" className="ui-field" defaultValue={address} required />
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Postcode</span>
          <input name="postcode" className="ui-field" defaultValue={postcode} />
        </label>
        <div className="sm:col-span-2">
          <BusinessMap pin={pin} points={[]} onPinMove={onPinMove} className="h-56" />
          <p className="mt-2 type-caption text-fg-2">Drag the pin to your entrance if it isn&apos;t quite right.</p>
        </div>
        <label className="grid gap-2">
          <span className="ui-label">What kind of business is it?</span>
          <select name="kind" className="ui-field" defaultValue="gym">
            {BUSINESS_KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Your role</span>
          <input name="role" className="ui-field" placeholder="e.g. Owner" />
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Website (optional)</span>
          <input name="website" className="ui-field" inputMode="url" placeholder="yourgym.co.uk" />
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Phone (optional)</span>
          <input name="phone" type="tel" className="ui-field" />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="ui-label">About your business (optional)</span>
          <textarea name="description" rows={3} className="ui-field" maxLength={2000} />
        </label>
      </div>

      <fieldset>
        <legend className="ui-label">What do you offer?</legend>
        <p className="type-caption mt-1 text-fg-2">Pick everything, so people searching for any of them find you.</p>
        <OfferingPicker selected={[]} />
      </fieldset>

      <label className="grid gap-2">
        <span className="ui-label">Anything that helps us confirm it&apos;s yours (optional)</span>
        <textarea name="evidence" rows={2} className="ui-field" placeholder="e.g. a link to your social media or Companies House listing" />
      </label>

      {state.error && <p className="text-danger">{state.error}</p>}
      <div>
        <button type="submit" className="ui-primary" disabled={pending}>{pending ? "Sending" : "Send for review"}</button>
      </div>
    </form>
  );
}
