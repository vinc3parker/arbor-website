import assert from "node:assert/strict";
import { test } from "node:test";
import {
  completeSignupConfirmation,
  confirmationReturnPath,
  hostedContextFromMetadata,
  profileFromSignupMetadata,
} from "./confirmation.ts";

const registered = (app: string) => ["thrive", "aevo", "salus"].includes(app);

test("confirmed hosted signups retain allowlisted app, OAuth state, and profile fields", () => {
  const metadata = {
    hosted_app: "thrive",
    hosted_state: "device_state-9",
    arbor_profile: {
      first_name: "Ada",
      last_name: "Lovelace",
      date_of_birth: "1815-12-10",
      gender: "Prefer not to say",
      address_line1: "1 Example Street",
      address_line2: null,
      city: "London",
      region: "London",
      postal_code: "N1 1AA",
      country: "United Kingdom",
    },
  };
  const context = hostedContextFromMetadata(metadata, registered);
  assert.deepEqual(context, { app: "thrive", state: "device_state-9" });
  assert.equal(profileFromSignupMetadata(metadata.arbor_profile)?.first_name, "Ada");
  assert.equal(
    confirmationReturnPath(context, "confirmed"),
    "/app-auth?app=thrive&confirmation=confirmed&state=device_state-9"
  );
});

test("successful confirmation saves the profile, clears the pending marker, signs out, and returns to the same app/state", async () => {
  const profile = {
    first_name: "Ada", last_name: "Lovelace", date_of_birth: "1815-12-10",
    gender: "Prefer not to say", address_line1: "1 Example Street",
    address_line2: null, city: "London", region: "London",
    postal_code: "N1 1AA", country: "United Kingdom",
  };
  const effects: string[] = [];
  const path = await completeSignupConfirmation(
    {
      verifyOtp: async () => true,
      currentUser: async () => ({
        id: "user-1",
        email: "ada@example.com",
        user_metadata: {
          hosted_app: "thrive",
          hosted_state: "device_state-9",
          arbor_profile: profile,
          email_confirmation_pending: true,
        },
      }),
      saveProfile: async (_user, saved) => {
        assert.deepEqual(saved, profile);
        effects.push("profile");
        return true;
      },
      markPendingSignupConfirmed: async () => {
        effects.push("confirmed");
        return true;
      },
      clearPendingProfile: async () => { effects.push("clear"); },
      signOut: async () => { effects.push("signout"); },
    },
    { queryContext: null, pendingProfile: null, fallbackPath: "/profile", isRegisteredApp: registered }
  );
  assert.equal(path, "/app-auth?app=thrive&confirmation=confirmed&state=device_state-9");
  assert.deepEqual(effects, ["profile", "confirmed", "clear", "signout"]);
});

test("expired confirmation returns a generic invalid-link page without creating a session", async () => {
  let loadedUser = false;
  let signedOut = false;
  const path = await completeSignupConfirmation(
    {
      verifyOtp: async () => false,
      currentUser: async () => { loadedUser = true; return null; },
      saveProfile: async () => true,
      markPendingSignupConfirmed: async () => true,
      clearPendingProfile: async () => {},
      signOut: async () => { signedOut = true; },
    },
    {
      queryContext: { app: "thrive", state: "device_state-9" },
      pendingProfile: null,
      fallbackPath: "/profile",
      isRegisteredApp: registered,
    }
  );
  assert.equal(path, "/app-auth?app=thrive&confirmation=invalid&state=device_state-9");
  assert.equal(loadedUser, false);
  assert.equal(signedOut, false);
  assert.equal(path.includes("token_hash"), false);
});

test("profile save failure never creates the hosted app sign-in handoff", async () => {
  let signedOut = false;
  const path = await completeSignupConfirmation(
    {
      verifyOtp: async () => true,
      currentUser: async () => ({
        id: "user-1", email: "ada@example.com",
        user_metadata: {
          hosted_app: "thrive", hosted_state: "device_state-9",
          arbor_profile: {
            first_name: "Ada", last_name: "Lovelace", date_of_birth: "1815-12-10",
            gender: "Prefer not to say", address_line1: "1 Example Street",
            address_line2: null, city: "London", region: "London",
            postal_code: "N1 1AA", country: "United Kingdom",
          },
        },
      }),
      saveProfile: async () => false,
      markPendingSignupConfirmed: async () => true,
      clearPendingProfile: async () => {},
      signOut: async () => { signedOut = true; },
    },
    { queryContext: null, pendingProfile: null, fallbackPath: "/profile", isRegisteredApp: registered }
  );
  assert.equal(path, "/app-auth?app=thrive&confirmation=profile_error&state=device_state-9");
  assert.equal(signedOut, true);
});

test("expired and invalid links produce the same generic app-aware return without tokens", () => {
  const context = { app: "thrive", state: "device_state-9" };
  const invalid = confirmationReturnPath(context, "invalid");
  assert.equal(invalid, "/app-auth?app=thrive&confirmation=invalid&state=device_state-9");
  assert.equal(invalid.includes("token"), false);
  assert.equal(invalid.includes("access_token"), false);
});

test("unregistered apps and malformed profile metadata are rejected", () => {
  assert.equal(
    hostedContextFromMetadata({ hosted_app: "https://evil.test", hosted_state: "state" }, registered),
    null
  );
  assert.equal(hostedContextFromMetadata({ hosted_app: "thrive", hosted_state: "bad state" }, registered)?.state, null);
  assert.equal(profileFromSignupMetadata({ first_name: "Ada" }), null);
});
