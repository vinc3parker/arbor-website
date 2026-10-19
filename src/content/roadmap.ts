import type { AppId } from "@/lib/brand";

export type DevelopmentStage =
  | "testing"
  | "approaching-testing"
  | "development"
  | "pre-development";

// Public milestones reviewed October 2026. Download availability is separate:
// reaching testing does not imply an open beta or a published release date.
export const APP_ROADMAP: Record<AppId, {
  stage: DevelopmentStage;
  label: string;
  note: string;
}> = {
  aevo: { stage: "testing", label: "In testing", note: "Aevo is in testing, with the training experience being refined ahead of a wider release." },
  salus: { stage: "testing", label: "In testing", note: "Salus is in testing, with reflection and the guide experience being refined ahead of a wider release." },
  thrive: { stage: "testing", label: "In testing", note: "Thrive is in testing. Early access will be announced when it is available." },
  nura: { stage: "approaching-testing", label: "Approaching testing", note: "Nura is in development and approaching the testing phase. Access is not open yet." },
  wend: { stage: "development", label: "In development", note: "Wend is in active development. Access is not open yet." },
  sage: { stage: "pre-development", label: "Pre-development", note: "Sage is in pre-development. Its direction is being shaped; product development has not started." },
  telos: { stage: "pre-development", label: "Pre-development", note: "Telos is in pre-development. Its direction is being shaped; product development has not started." },
  kith: { stage: "pre-development", label: "Pre-development", note: "Kith is in pre-development. Its direction is being shaped; product development has not started." },
};
