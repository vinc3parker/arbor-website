// The observatory intro ("click to enter") plays once per browser session.
// Once a visitor is inside the site — they entered the observatory, or landed
// on any other page — home opens fully built instead.

const SKIP_INTRO_KEY = "arbor-skip-intro";

export function shouldSkipIntro(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("entered") === "1") return true;
    return window.sessionStorage.getItem(SKIP_INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberEntered() {
  try {
    window.sessionStorage.setItem(SKIP_INTRO_KEY, "1");
  } catch {
    /* storage unavailable: the intro just plays again */
  }
}
