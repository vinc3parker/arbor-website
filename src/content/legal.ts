/**
 * Legal content for the Arbor website — the Privacy Policy and Terms of Service
 * rendered at /privacy and /terms.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * SYNC SOURCE (do not fork the wording):
 *   Thrive repo → src/features/legal/content.ts
 * This file is a mirror of that canonical source. When the wording changes
 * there, update it here too (and bump CONSENT_VERSIONS.arbor_core in Arbor Core
 * to the new effective date so users re-accept). Keep the two in step.
 * Current version / effective date: August 22, 2026.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Framed for a UK company (UK GDPR / Data Protection Act 2018; England & Wales
 * governing law). Grounded in how Thrive actually works today: content you create
 * is stored on your device, an Arbor account is held on our backend, and data is
 * sent off-device only when you use AI features or auto-planning.
 *
 * NOTE FOR MAINTAINERS: "Arbor" is used as the operating name; replace it with
 * the registered legal entity (and company number/registered address) once
 * formed, and revisit the subprocessor list, transfers, and analytics sections if
 * the app's data practices change (e.g. adding Sentry). These documents are a
 * solid starting point, not legal advice — have a UK-qualified lawyer review
 * before launch.
 */

export interface LegalSection {
  heading: string;
  /** Ordered paragraphs. */
  body?: string[];
  /** Optional bullet list rendered under the paragraphs. */
  bullets?: string[];
}

export interface LegalDoc {
  id: "privacy" | "terms";
  title: string;
  /** Human-readable effective date. */
  effectiveDate: string;
  /** Lead paragraphs shown under the title. */
  intro: string[];
  sections: LegalSection[];
}

/** Shared identifiers so the app and site read the same values. */
export const LEGAL_META = {
  provider: "Arbor",
  appName: "Thrive",
  contactEmail: "vinc3.parker@gmail.com",
  website: "arborapps.co",
  effectiveDate: "August 22, 2026",
  governingLaw: "England and Wales",
  homeCountry: "the United Kingdom",
} as const;

export const PRIVACY_POLICY: LegalDoc = {
  id: "privacy",
  title: "Privacy Policy",
  effectiveDate: LEGAL_META.effectiveDate,
  intro: [
    "This Privacy Policy explains how Arbor (“Arbor”, “we”, “us”) collects, uses, and protects your information when you use Thrive, our personal productivity and habit app, together with related services (the “Service”).",
    "Arbor is a UK-based company and is the controller of your personal information under UK data protection law (the UK GDPR and the Data Protection Act 2018).",
    "Thrive is designed to be private by default: most of the content you create lives on your device, not on our servers. This policy describes what we do collect, why, and the choices you have.",
  ],
  sections: [
    {
      heading: "1. Information you provide",
      body: [
        "When you create an Arbor account and sign in, we collect your email address and a password (handled by our authentication provider), and an optional display name. One Arbor account signs you in across the Arbor family of apps.",
      ],
    },
    {
      heading: "2. Content you create (stored on your device)",
      body: [
        "The tasks, routines and habits, projects, life areas, time blocks, focus sessions, reminders and notes you create in Thrive are stored locally in the app’s on-device database. This content is not uploaded to our servers except as described in “Information used by AI features” below.",
      ],
    },
    {
      heading: "3. Information used by AI features",
      body: [
        "When you use Thrive’s AI features — daily planning, natural-language capture, the coach and assistant, and auto-scheduling — Thrive sends the content needed to fulfil your request to our backend (Arbor Core), which uses a third-party AI provider (Anthropic) to generate a response.",
        "This can include, for example, the titles and details of the tasks being planned, the messages you send to the coach, and the time ranges of your commitments. This data is processed to produce your result and is not used to train the AI provider’s models. If you do not use AI features, this data is not sent off your device.",
      ],
    },
    {
      heading: "4. Calendar access",
      body: [
        "With your permission, Thrive reads events from your device calendar to show your existing commitments and plan around them. Calendar data is used on your device; when you use auto-planning, the time ranges of events may be sent to our scheduling service so it can avoid conflicts. Thrive does not create, modify, or delete your calendar events. You can revoke calendar access at any time in your device settings.",
      ],
    },
    {
      heading: "5. Notifications",
      body: [
        "With your permission, Thrive schedules reminders and alerts as local notifications on your device. You can turn notifications off at any time in your device settings.",
      ],
    },
    {
      heading: "6. Cross-app presence",
      body: [
        "Thrive is part of the Arbor family of apps. When you sign in, we record that your account uses Thrive so that cross-app features can work across the Arbor apps tied to your account.",
      ],
    },
    {
      heading: "7. Analytics and advertising",
      body: [
        "We do not currently use third-party analytics, advertising, or cross-app tracking technologies, and we do not sell your personal information. If this changes, we will update this policy and, where required, ask for your consent.",
      ],
    },
    {
      heading: "8. How we use your information",
      body: ["We use the information above to:"],
      bullets: [
        "provide and operate the Service;",
        "authenticate you and keep your account secure;",
        "deliver the AI features and notifications you choose to use;",
        "maintain, troubleshoot, and improve the Service; and",
        "comply with legal obligations and enforce our terms.",
      ],
    },
    {
      heading: "9. Legal bases for processing",
      body: [
        "Under the UK GDPR, we rely on the following legal bases to process your personal information:",
      ],
      bullets: [
        "Performance of a contract — to create and secure your account and provide the core features of the Service;",
        "Legitimate interests — to maintain, troubleshoot, secure and improve the Service and enable cross-app features, in ways you would reasonably expect and that do not override your rights;",
        "Consent — for optional device permissions such as notifications and calendar access, and when you choose to use AI features; you can withdraw consent at any time in your device settings or by not using those features; and",
        "Legal obligation — where we must process information to comply with the law.",
      ],
    },
    {
      heading: "10. How your information is shared",
      body: [
        "We share information only with service providers (processors) that help us run the Service, and only as needed for them to perform that role:",
      ],
      bullets: [
        "Supabase — account authentication and database;",
        "Anthropic — AI processing for AI features you use;",
        "Railway — backend hosting; and",
        "Apple — app distribution and system notification delivery.",
      ],
    },
    {
      heading: "11. Data retention and deletion",
      body: [
        "Account data is retained until you delete your account. Content you create in Thrive is stored on your device and remains until you delete it or uninstall the app.",
        "You can delete your account at any time in the app (Settings → Delete account). This permanently deletes your Arbor account and erases Thrive’s data on that device, and cannot be undone.",
      ],
    },
    {
      heading: "12. Security",
      body: [
        "Data is transmitted over encrypted connections (HTTPS), and your session credentials are stored securely on your device (for example, in the iOS Keychain). No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "13. Children",
      body: [
        "Thrive is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has provided us information, please contact us and we will delete it.",
      ],
    },
    {
      heading: "14. Your rights",
      body: [
        "If you are in the UK or the EEA, you have rights under the UK GDPR / EU GDPR to access, correct, delete, or receive a portable copy of your personal information, to object to or restrict certain processing, and to withdraw consent where we rely on it. You can exercise many of these directly in the app (for example, by deleting your account); for anything else, contact us at vinc3.parker@gmail.com.",
        "You also have the right to complain to the UK’s Information Commissioner’s Office (ICO) at ico.org.uk, or to your local supervisory authority. We would appreciate the chance to address your concerns first. If you are elsewhere, you may have similar rights under your local laws.",
      ],
    },
    {
      heading: "15. International data transfers",
      body: [
        "Arbor is based in the United Kingdom. Some of our service providers process data outside the UK — for example, our AI provider (Anthropic), hosting (Railway), and authentication and database (Supabase) may process data in the United States. Where personal data is transferred outside the UK, we rely on appropriate safeguards, such as the UK’s International Data Transfer Agreement (IDTA) or an adequacy decision, to keep it protected.",
      ],
    },
    {
      heading: "16. Changes to this policy",
      body: [
        "We may update this Privacy Policy from time to time. We will revise the “Effective” date above and, for material changes, provide additional notice where appropriate.",
      ],
    },
    {
      heading: "17. Contact us",
      body: [
        "If you have questions about this policy or your information, contact us at vinc3.parker@gmail.com.",
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDoc = {
  id: "terms",
  title: "Terms of Service",
  effectiveDate: LEGAL_META.effectiveDate,
  intro: [
    "These Terms of Service (“Terms”) are a legal agreement between you and Arbor (“Arbor”, “we”, “us”), a company based in the United Kingdom, governing your use of Thrive and related services (the “Service”). By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.",
  ],
  sections: [
    {
      heading: "1. Eligibility",
      body: [
        "You must be at least 13 years old to use the Service. If you are under the age of 18, you may use the Service only with the involvement of a parent or guardian.",
      ],
    },
    {
      heading: "2. Your account",
      body: [
        "You are responsible for providing accurate information, keeping your login credentials secure, and all activity that happens under your account. One Arbor account signs you in across the Arbor family of apps. Notify us promptly if you believe your account has been compromised.",
      ],
    },
    {
      heading: "3. Licence to use Thrive",
      body: [
        "Subject to these Terms, we grant you a personal, limited, non-exclusive, non-transferable, and revocable licence to use the Thrive app for your own personal, non-commercial purposes.",
      ],
    },
    {
      heading: "4. Acceptable use",
      body: ["You agree not to:"],
      bullets: [
        "use the Service in violation of any law or the rights of others;",
        "reverse engineer, decompile, or attempt to extract the source code of the app, except where permitted by law;",
        "interfere with, disrupt, or place undue load on the Service, or access it by automated means or scraping;",
        "introduce malware or attempt to gain unauthorised access to the Service or other users’ data; or",
        "misuse the Service in any way that harms Arbor, the Service, or other users.",
      ],
    },
    {
      heading: "5. Your content",
      body: [
        "You own the content you create in Thrive. You grant us a limited licence to store and process that content solely to operate and provide the Service to you — including sending the relevant content to our AI provider when you choose to use AI features. We do not claim ownership of your content and do not use it for advertising.",
      ],
    },
    {
      heading: "6. AI features",
      body: [
        "Thrive includes AI-assisted features. AI output can be inaccurate, incomplete, or unsuited to your particular situation. It is provided for general assistance only and is not professional advice of any kind (including medical, legal, or financial advice). You are responsible for reviewing AI output and using your own judgement before relying on it.",
      ],
    },
    {
      heading: "7. Wellbeing",
      body: [
        "Thrive is a productivity and habit tool. It is not a healthcare provider, medical device, or crisis service, and it does not provide medical or mental-health advice. If you are in crisis or need urgent help, contact a qualified professional or your local emergency services.",
      ],
    },
    {
      heading: "8. Third-party services",
      body: [
        "The Service works with third-party services, such as your device calendar, your device’s notification system, and our infrastructure providers. Your use of those services may be governed by their own terms and policies, and we are not responsible for them.",
      ],
    },
    {
      heading: "9. Changes to the Service",
      body: [
        "We may add, change, or remove features, or suspend or discontinue the Service or any part of it, at any time. We will make reasonable efforts to give notice of significant changes where practical.",
      ],
    },
    {
      heading: "10. Termination",
      body: [
        "You may stop using the Service and delete your account at any time (Settings → Delete account). We may suspend or terminate your access if you break these Terms or where necessary to protect the Service or other users.",
      ],
    },
    {
      heading: "11. Disclaimers",
      body: [
        "The Service is provided “as is” and “as available.” To the fullest extent permitted by law, and except as expressly stated in these Terms, we make no warranties about the Service — for example, we do not warrant that it will be uninterrupted, error-free, or secure, or that content will always be preserved. Because your content is stored on your device, you are responsible for keeping your own backups of information that matters to you.",
      ],
    },
    {
      heading: "12. Liability",
      body: [
        "Nothing in these Terms limits or excludes our liability where it would be unlawful to do so — this includes liability for death or personal injury caused by our negligence, and for fraud or fraudulent misrepresentation.",
        "Subject to the paragraph above, and to the fullest extent permitted by law, Arbor will not be liable for any indirect or consequential loss, or for any loss of data, profits, or goodwill, arising out of or relating to your use of the Service; and our total liability for any claim relating to the Service will not exceed the greater of the amount you paid us for the Service in the twelve months before the claim, or £50.",
        "If you are a consumer, you have legal rights that these Terms do not affect.",
      ],
    },
    {
      heading: "13. Indemnification",
      body: [
        "You agree to indemnify and hold Arbor harmless from any claims, damages, or expenses arising out of your misuse of the Service or your breach of these Terms.",
      ],
    },
    {
      heading: "14. Governing law and disputes",
      body: [
        "These Terms are governed by the laws of England and Wales. You and Arbor submit to the exclusive jurisdiction of the courts of England and Wales. If you are a consumer resident elsewhere in the United Kingdom, you may also bring proceedings in your home courts, and the mandatory consumer-protection laws of your home nation continue to apply to you.",
      ],
    },
    {
      heading: "15. Changes to these Terms",
      body: [
        "We may update these Terms from time to time. We will revise the “Effective” date above, and for material changes we will provide additional notice where appropriate. Your continued use of the Service after changes take effect means you accept the updated Terms.",
      ],
    },
    {
      heading: "16. Contact us",
      body: ["Questions about these Terms? Contact us at vinc3.parker@gmail.com."],
    },
  ],
};

export const LEGAL_DOCS = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_SERVICE,
} as const;

export type LegalDocId = keyof typeof LEGAL_DOCS;

/** Narrow an arbitrary route param to a known legal doc id. */
export function isLegalDocId(value: string | undefined): value is LegalDocId {
  return value === "privacy" || value === "terms";
}
