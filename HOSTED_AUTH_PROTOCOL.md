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

## 2. Website authenticates and redirects back

The website runs the email-first UI (sign in vs create account), authenticates
against Arbor Core, calls `/api/auth/authorize` to mint a one-time `code`, then
redirects the browser to the app's Universal Link:

```
https://arborapps.co/app/<appId>/callback?code=<code>&state=<state>
```

With the app installed, the OS hands this URL straight to the app. If it isn't
installed, the callback loads as a web page telling the person to install/open
the app (the code expires in ~2 minutes, so it's harmless).

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
- Set `ARBOR_CORE_URL` (website env) to the deployed Arbor Core URL, and
  `NEXT_PUBLIC_SITE_URL` to the public site origin.
```
