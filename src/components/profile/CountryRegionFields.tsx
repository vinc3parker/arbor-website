"use client";

import { useEffect, useState } from "react";
import {
  getCountries,
  getStatesOfCountry,
  type ICountry,
  type IState,
} from "@countrystatecity/countries-browser";

type Props = {
  country?: string;
  region?: string;
  className: string;
  labelClass: string;
};

/**
 * Native selects deliberately: they use the platform's own scroll picker on
 * iOS, and require no third-party UI widget.
 */
export function CountryRegionFields({
  country = "",
  region = "",
  className,
  labelClass,
}: Props) {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [selectedRegion, setSelectedRegion] = useState(region);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(false);

  useEffect(() => {
    let active = true;

    getCountries()
      .then((items) => {
        if (!active) return;
        setCountries([...items].sort((a, b) => a.name.localeCompare(b.name)));
      })
      .finally(() => {
        if (active) setCountriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const selected = countries.find((item) => item.name === selectedCountry);
    if (!selected) {
      setStates([]);
      setStatesLoading(false);
      return;
    }

    let active = true;
    setStatesLoading(true);
    getStatesOfCountry(selected.iso2)
      .then((items) => {
        if (!active) return;
        setStates([...items].sort((a, b) => a.name.localeCompare(b.name)));
      })
      .finally(() => {
        if (active) setStatesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [countries, selectedCountry]);

  function chooseCountry(nextCountry: string) {
    setSelectedCountry(nextCountry);
    setSelectedRegion("");
    setStates([]);
    setStatesLoading(Boolean(nextCountry));
  }

  const selectedRegionExists = states.some(
    (item) => item.name === selectedRegion
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Country</span>
        <select
          name="country"
          required
          value={selectedCountry}
          onChange={(event) => chooseCountry(event.target.value)}
          autoComplete="country-name"
          className={className}
          disabled={countriesLoading}
        >
          <option value="" disabled>
            {countriesLoading ? "Loading countries…" : "Select country"}
          </option>
          {selectedCountry &&
            !countries.some((item) => item.name === selectedCountry) && (
              <option value={selectedCountry}>{selectedCountry}</option>
            )}
          {countries.map((item) => (
            <option key={item.iso2} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>State / province / county</span>
        <select
          name="region"
          required
          value={states.length > 0 ? selectedRegion : ""}
          onChange={(event) => setSelectedRegion(event.target.value)}
          autoComplete="address-level1"
          className={className}
          disabled={!selectedCountry || statesLoading || states.length === 0}
        >
          <option value="" disabled>
            {!selectedCountry
              ? "Select country first"
              : statesLoading
                ? "Loading areas…"
                : states.length === 0
                  ? "No areas available"
                  : "Select state, province or county"}
          </option>
          {selectedRegion && !selectedRegionExists && states.length > 0 && (
            <option value={selectedRegion}>{selectedRegion}</option>
          )}
          {states.map((item) => (
            <option key={`${item.country_code}-${item.iso2}`} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        {selectedCountry && !statesLoading && states.length === 0 && (
          <input type="hidden" name="region" value="Not applicable" />
        )}
      </label>
    </div>
  );
}
