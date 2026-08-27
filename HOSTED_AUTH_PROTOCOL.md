# Hosted app sign-in — protocol

How an Arbor app signs a person in through the arborapps.co website and gets a
session back. Tokens never travel in a URL; only a short-lived, single-use code
does.

## Roles

- **App** (iOS/Android) — starts the flow, receives the code, exchanges it.
- **Website** (`arborapps.co`) — hosts the sign-in UI at `/app-auth`, mints the
  code via Arbor Core, redirects back via a Universal Link.
- **Arbor Core** (`/api/auth/*`) — authenticates, mints/redeems the code.

## The flow

```
App                       Website (/app-auth)            Arbor Core
 |  open browser →              |                              |
 |  /app-auth?app=…&state=…     |                              |
 |                        sign in / create  → /signin|/signup  |
 |                              |            ← session tokens  |
 |                              |    → /authorize (tokens)     |
 |                              |            ← { code }         |
 |  ← Universal Link            |                              |
 |    /app/<app>/callback?code=…&state=…                       |
 |  verify state                |                              |
 |  → /exchange { code }  ───────────────────────────────────→ |
 |  ← session tokens            |                              |
 |  store session. done.        |                              |
```

## 1. App opens the website

Open the system browser (SFSafariViewController / Custom Tab — not an in-app
webview, so system password autofill works) at:

```
https://arborapps.co/app-auth?app=<appId>&state=<random>
```

- `appId` — one of: `aevo`, `salus`, `thrive`, `nura`, `wend`, `kith`, `telos`,
  `sage`. This is the allowlist; an unknown id shows an error and never
  redirects.
- `state` — a random, unguessable string you generate and store locally
  (`[A-Za-z0-9._~-]`, ≤512 chars). It's echoed back untouched so you can confirm
  the response is the one you started and reject anything else.

Do **not** send a redirect URI. The return address is derived server-side from
`appId`, so it can never be attacker-controlled.

## 2. Website authenticates, gathers consent, and redirects back

The website runs the email-first UI (sign in vs create account) and
authenticates against Arbor Core. Before it mints a code, it runs the **consent
gate** (see §2a). Once any required consents are satisfied it calls
`/api/auth/authorize` to mint a one-time `code`, then redirects the browser to
the app's Universal Link:

```
https://arborapps.co/app/<appId>/callback?code=<code>&state=<state>
```

With the app installed, the OS hands this URL straight to the app. If it isn't
installed, the callback loads as a web page telling the person to install/open
the app (the code expires in ~2 minutes, so it's harmless).

## 2a. Consent gate

Immediately after authenticating (and before minting the code), the website
reads the person's consent status for the app it was opened by:

```
GET /api/consent/status?app=<appId>   (Bearer <accessToken>)
```

Core returns the account-level consents plus that app's own consents, each with
a `needsConsent` flag — so the gate is **app-aware**: Salus surfaces the Salus
consents, Nura surfaces Nura's, all from the same code.

- If no **required** consent has `needsConsent`, the flow proceeds straight to
  `/authorize` and the redirect above — unchanged for users who've already
  agreed.
- Otherwise the browser is sent to `/app-auth/consent`, which lists the
  outstanding required consents (and any not-yet-decided optional ones). On
  submit the website records the decisions:

  ```
  POST /api/consent/batch   (Bearer <accessToken>)
  { "decisions": [ { "key": "...", "accepted": true, "version": "..." }, ... ] }
  ```

  then mints the code and redirects back to the app. If the person declines a
  required consent, the website redirects to the callback with
  `?error=consent_required&state=<state>` instead of a code.

**Holding the session between the two steps.** The consent screen is a second
request, but the hosted flow keeps tokens off the client. So between
authentication and the consent submit, the session is held server-side in a
short-lived (**10-minute**), **httpOnly, AES-256-GCM-encrypted** cookie
(`arbor_pending_auth`, path `/app-auth`), cleared the instant the flow completes
or is declined. It is a transient handoff, not a website login session — the
browser never sees the tokens.

Consent is still verified independently by the app on every launch and enforced
server-side by Core's `requireConsent` middleware, so this website gate is the
*capture* surface, not the only line of defence. (Note: as of writing,
`requireConsent` is defined but not yet applied to the Salus data routes in
`arbor-core/src/modules/salus/salus.routes.ts` — wire it there so the
server-side enforcement the app relies on actually holds.)

## 3. App exchanges the code

On receiving the Universal Link:

1. **Verify `state`** equals the value you stored in step 1. If not, abort.
2. Exchange the code:

```
POST https://<arbor-core>/api/auth/exchange
Content-Type: application/json

{ "code": "<code>" }
```

Response:

```json
{
  "data": {
    "user": { "id": "…", "email": "…" },
    "session": {
      "accessToken": "…",
      "refreshToken": "…",
      "expiresAt": 1721430000
    }
  }
}
```

Store the session. The code is single-use and expires in ~2 minutes; a second
exchange returns `400 INVALID_CODE`.

## Security notes

- **Allowlist** — `/app-auth` only redirects to registered `appId`s, so it can't
  be used as an open redirector.
- **`state`** — binds the response to the request; guards against CSRF and
  cross-app confusion.
- **Universal Links** (not custom schemes) — a Universal Link can't be claimed
  by another app the way a custom `myapp://` scheme can, so the code can't be
  intercepted by a malicious app on the device.
- **One-time code, short TTL** — tokens never appear in a URL; only the opaque
  code does, and it dies on first use or after ~2 minutes.

## Before launch (infra)

The Universal Links only route into the apps once the association files carry
real values. Both are served from this site:

- `/.well-known/apple-app-site-association` — set the real Apple **Team ID** and
  confirm each app's **bundle id**
  (`src/app/.well-known/apple-app-site-association/route.ts`).
- `/.well-known/assetlinks.json` — set each Android **package name** and
  **SHA-256 signing fingerprint**
  (`src/app/.well-known/assetlinks.json/route.ts`).
- Each app must declare the associated domain: iOS `applinks:arborapps.co`,
  Android an intent-filter for `https://arborapps.co/app/<appId>/callback`.
- Set `ARBOR_CORE_URL` (website env) to the deployed Arbor Core URL
  (`https://arbor-core-production.up.railway.app`), and `NEXT_PUBLIC_SITE_URL`
  to the public site origin. Set on the host's **Production** env and redeploy —
  if unset it falls back to `localhost:4000` and fails with "Couldn't reach
  Arbor". Full env table: `arbor-core/docs/environments.md`.
- Set `APP_AUTH_COOKIE_SECRET` (website env) to a long random string — it
  encrypts the transient `arbor_pending_auth` cookie that holds the session
  across the consent step. **Required in production**: the flow throws without
  it. In development it falls back to an insecure dev key and warns.
- Optional: `NEXT_PUBLIC_TERMS_URL` / `NEXT_PUBLIC_PRIVACY_URL` override the
  policy links shown on the consent screen (default `/terms` and `/privacy`).
  Create those pages or point these at the published policies.
```
