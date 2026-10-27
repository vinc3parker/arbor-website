"use client";

import { useActionState } from "react";
import { saveLocation, type FormState } from "@/app/business/actions";
import type { FeatureGroup, PlaceRow, PlaceTypeGroup } from "@/lib/arbor-business";
import { FeaturePicker } from "./FeaturePicker";
import { OfferingPicker } from "./OfferingPicker";
import { OpeningHoursField } from "./OpeningHoursField";
import { PlaceTypePicker } from "./PlaceTypePicker";

const initialState: FormState = {};

export function LocationForm({
  place,
  organisationId,
  placeTypes,
  features,
}: {
  place: PlaceRow;
  organisationId: string;
  placeTypes: PlaceTypeGroup[];
  features: FeatureGroup[];
}) {
  const [state, formAction, pending] = useActionState(saveLocation, initialState);

  return (
    <form action={formAction} className="ui-surface grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <input type="hidden" name="placeId" value={place.id} />
      <input type="hidden" name="organisationId" value={organisationId} />
      <input type="hidden" name="previousLocation" value={place.location ?? ""} />
      <label className="grid gap-2">
        <span className="ui-label">Location name</span>
        <input name="name" className="ui-field" defaultValue={place.name} required maxLength={160} />
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Address</span>
        <input name="location" className="ui-field" defaultValue={place.location ?? ""} />
        <span className="type-caption text-fg-2">
          {place.latitude != null ? "Changing the address moves your map pin." : "Add an address to put this location on the map."}
        </span>
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Website</span>
        <input name="website" className="ui-field" defaultValue={place.website ?? ""} inputMode="url" />
        {!place.website && <span className="type-caption text-warning">No website yet: people will see that it&apos;s missing.</span>}
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Phone</span>
        <input name="phone" type="tel" className="ui-field" defaultValue={place.phone ?? ""} />
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Instagram</span>
        <input name="instagram" className="ui-field" defaultValue={place.instagram ? `@${place.instagram}` : ""} placeholder="@yourbusiness" />
      </label>

      <fieldset className="sm:col-span-2">
        <legend className="ui-label">What kind of place is it?</legend>
        <p className="type-caption text-fg-2">Choose everything that fits. People filter the map by these.</p>
        <PlaceTypePicker groups={placeTypes} selected={place.tags ?? []} />
      </fieldset>

      <fieldset className="sm:col-span-2">
        <legend className="ui-label">Sports and classes here</legend>
        <OfferingPicker selected={place.activities} />
      </fieldset>

      <fieldset className="sm:col-span-2">
        <legend className="ui-label">Opening hours</legend>
        <OpeningHoursField value={place.opening_hours} />
      </fieldset>

      <fieldset className="sm:col-span-2">
        <legend className="ui-label">What&apos;s here</legend>
        <p className="type-caption text-fg-2">
          The details people search for: a beer garden, sit-down food or just snacks, a sauna, darts, step-free access.
        </p>
        <FeaturePicker groups={features} selected={place.features ?? []} />
      </fieldset>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="ui-primary" disabled={pending}>{pending ? "Saving" : "Save location"}</button>
        {state.message && <span className="type-caption text-success" role="status">{state.message}</span>}
        {state.error && <span className="text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
