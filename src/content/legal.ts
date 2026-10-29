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
 * Current version / effective date: October 25, 2026 (Arbor account Terms and
 * Privacy Policy; arbor_core).
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Framed for Arbor as a connected family of guide apps. Account-wide data flows
 * are described here; app-specific practices and choices must be explained in
 * each app before the relevant feature is used.
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
  effectiveDate: "October 22, 2026",
  /**
   * Arbor-wide account and privacy notice revision.
   */
  privacyEffectiveDate: "October 25, 2026",
  governingLaw: "England and Wales",
  homeCountry: "the United Kingdom",
} as const;

export const PRIVACY_POLICY: LegalDoc = {
  id: "privacy",
  title: "Privacy Policy",
  effectiveDate: LEGAL_META.privacyEffectiveDate,
  intro: [
    "This Privacy Policy explains how Arbor (“Arbor”, “we”, “us”) handles your information across your Arbor account, our family of personal guide apps, and related services (together, the “Service”). Arbor brings specialist guides for different parts of life together around one account.",
    "Arbor is based in the United Kingdom. This policy describes the information used across the Arbor service. Each app is at a different stage and may handle its own content differently; before you use a feature that needs app-specific information or device access, the app will explain what it needs and ask for any required permission or consent.",
    "In brief: your account details let you sign in and manage access; each app handles the information you share with it; and selected summaries may be shared between guides only after you separately agree to connect your apps. The Privacy Policy itself does not turn on device permissions or give every app access to every kind of information.",
  ],
  sections: [
    {
      heading: "1. Your Arbor account",
      body: [
        "When you create an account, we collect your email address and password to authenticate you. We also store the profile details you provide, which can include your first and last name, date of birth, gender, and address. You can review and update these details in your account.",
        "We record which Arbor apps are connected to your account, your consent choices and their versions, and your membership or access status. These records help us provide the service you chose, keep it secure, and show which features you can use. One Arbor account works across the Arbor apps.",
      ],
    },
    {
      heading: "2. How Arbor apps work together",
      body: [
        "Each guide uses what you choose to share with it to give support in that area. If you separately agree to “Connect my life to Arbor”, selected summaries or useful facts an app has learned may be added to your shared Arbor understanding so another guide can take relevant context into account. This is not a blanket transfer of every message, journal, transaction, or record between apps.",
        "Some information can be kept within the app where you shared it, or marked as locked so other guides do not use it. You can review, remove, or lock information shown in “What Arbor knows” in your account. The app’s own notice explains what it keeps and what it contributes to the shared understanding.",
      ],
    },
    {
      heading: "3. Information in each app and device permissions",
      body: [
        "The information an app handles depends on its purpose. It may include what you type or create, preferences, plans, or information you choose to connect from another service. Some app content may be stored on your device; other information may be sent to Arbor’s servers to provide account, sync, or guide features. Check the notice in the app for the details that apply to that app and feature.",
        "An app may ask for access to a device feature or connected service, such as your calendar, health information, or financial account. You are shown a separate explanation and permission or consent request where required. You can decline optional access and manage device permissions in your device settings; a feature that depends on a permission may then be unavailable.",
      ],
    },
    {
      heading: "4. AI features",
      body: [
        "When you use an AI feature, the app sends your request and the relevant information needed to answer it to Arbor Core. Arbor Core sends that information to Anthropic to generate the response. This may include your message and relevant context from the app or your shared Arbor understanding. The app’s AI notice explains the feature and any separate consent required. If you do not use an AI feature, your content is not sent to an AI provider for that feature.",
        "AI responses can be inaccurate, incomplete, or unsuitable for your circumstances. They are not a substitute for professional medical, mental-health, legal, or financial advice. Review suggestions and use your own judgement.",
      ],
    },
    {
      heading: "5. Health, wellbeing, and other sensitive information",
      body: [
        "Some Arbor guides may work with health, training, financial, or wellbeing information. The app-specific notice identifies the information involved, and the app asks for any separate consent required before processing it. Optional connected information can be turned off in the relevant app or service; you can also remove shared information Arbor holds in “What Arbor knows”.",
        "We do not treat agreeing to the account Terms and Privacy Policy as consent to every sensitive-data feature. Each app explains its own data choices. You can withdraw a consent in the app where it was given; this may make the feature that depends on it unavailable.",
      ],
    },
    {
      heading: "6. Membership and payments",
      body: [
        "If you join a paid membership, we and our payment provider Stripe process information needed to set up and manage your membership, including its plan, status, renewal or end date, and payment history. Stripe handles your full payment card details; Arbor does not receive or store the full card number. If you use an access code or trial, we record the access granted and when it ends so we can manage your membership correctly.",
      ],
    },
    {
      heading: "7. How we use information and our legal bases",
      body: [
        "We use your information to operate and secure your account, provide the apps and features you choose, maintain your membership, respond to support requests, and meet legal obligations. Depending on the purpose, our legal basis may be providing the service under our agreement with you, our legitimate interests in keeping and improving a secure service, a legal obligation, or your consent.",
        "Where an app processes special-category information such as health or wellbeing data, it will explain the relevant information and ask for the required separate consent. You can withdraw consent as described in the app; this does not affect processing that already took place before withdrawal.",
      ],
    },
    {
      heading: "8. Who helps us provide Arbor",
      body: [
        "We use service providers to run Arbor, and share only the information they need for their role. These currently include Supabase for account authentication and databases; Railway for Arbor Core hosting; Anthropic for AI responses you request; Stripe for website membership payments; and Apple and Google for app distribution and platform services. An app may also connect to an outside service when you choose to enable that feature; the app will explain this at the point of connection.",
      ],
    },
    {
      heading: "9. Advertising and analytics",
      body: [
        "We do not sell your personal information or use it to target advertising. We do not currently use third-party advertising or cross-company tracking. If we introduce analytics or another materially different use, we will update this policy and provide any additional notice or choice required.",
      ],
    },
    {
      heading: "10. How long we keep information",
      body: [
        "We keep account and shared-understanding information while your account is active. You can remove shared information or request account deletion from your account. Information held on your device or within an app may need to be deleted there as well; the app explains how.",
        "We may retain limited records after account deletion where needed to meet legal, tax, accounting, security, or dispute-resolution obligations. Payment records may be retained for the period required by law.",
      ],
    },
    {
      heading: "11. Your choices and rights",
      body: [
        "You can see and manage information Arbor has learned in “What Arbor knows”, update your account details, manage consent choices, and request a copy or deletion of your account. You can also withdraw optional permissions or consents in the relevant app or device settings. Some information is needed to provide a feature, so removing it or withdrawing consent may make that feature unavailable.",
        "Depending on where you live, you may have the right to access, correct, delete, or receive a copy of your information, object to or restrict some processing, and complain to a data protection authority. To exercise a right or ask a privacy question, contact vinc3.parker@gmail.com.",
      ],
    },
    {
      heading: "12. Security",
      body: [
        "We use safeguards intended to protect information, including encrypted connections and access controls. No method of storing or transmitting information is completely secure.",
      ],
    },
    {
      heading: "13. Who can use Arbor",
      body: [
        "Arbor accounts are for people aged 18 or over. If you believe a person under 18 has created an account, please contact us.",
      ],
    },
    {
      heading: "14. International data transfers",
      body: [
        "Some service providers may process information outside the United Kingdom. Where required, we use a recognised transfer mechanism or other safeguard under applicable data protection law.",
      ],
    },
    {
      heading: "15. Changes to this policy",
      body: [
        "We may update this Privacy Policy from time to time. We will revise the “Effective” date above and, for material changes, provide additional notice where appropriate.",
      ],
    },
    {
      heading: "16. Contact us",
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
    "These Terms of Service (“Terms”) explain the agreement between you and Arbor (“Arbor”, “we”, “us”) when you use an Arbor account, our personal guide apps, and related services (together, the “Service”). Arbor is based in the United Kingdom. One Arbor account can connect you to guides for different parts of life; each app may have additional terms and notices for its own features.",
    "By creating an account, you agree to these Terms and acknowledge the Arbor Privacy Policy. You also confirm separately that you are 18 or older. To use the connected Arbor service, you must give a separate yes to sharing selected information between your guides; this is not folded into agreement to these Terms. You can review and remove information in “What Arbor knows”, and withdrawing that connection may make connected features unavailable. App-specific data choices, device permissions, and any required feature consents are explained separately. Agreeing to these account Terms does not itself grant every app access to every type of information or device feature.",
  ],
  sections: [
    {
      heading: "1. Eligibility",
      body: [
        "Arbor accounts are for people aged 18 or over. By creating an account, you confirm that you meet this age requirement.",
      ],
    },
    {
      heading: "2. Your account",
      body: [
        "You agree to provide accurate account details, keep your login credentials secure, and take responsibility for activity under your account. One Arbor account signs you in across the Arbor family of apps. Keep your profile up to date and tell us promptly if you believe your account has been compromised.",
      ],
    },
    {
      heading: "3. Licence to use the Service",
      body: [
        "Subject to these Terms and any membership or access requirements shown for a feature, we grant you a personal, limited, non-exclusive, non-transferable, and revocable licence to use the Arbor apps available to your account for your own personal, non-commercial purposes.",
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
        "You retain your rights to the information and content you provide to Arbor. You allow us to process it only as needed to provide, secure, and support the Service, as explained in the Privacy Policy and the relevant app notice. This may include sending a request and relevant context to our AI provider when you use an AI feature. We do not claim ownership of your content or sell it for advertising.",
      ],
    },
    {
      heading: "6. AI features",
      body: [
        "Some Arbor guides use AI to personalise suggestions and help you think through your goals. AI output can be inaccurate, incomplete, or unsuited to your particular circumstances. It is not professional medical, mental-health, legal, or financial advice. Review suggestions and use your own judgement before relying on them. The app will tell you when a feature uses AI and whether a separate consent is required.",
      ],
    },
    {
      heading: "7. Guidance and important decisions",
      body: [
        "Arbor provides self-help guides and general information, not professional services. No Arbor app is a healthcare provider, medical device, crisis service, or substitute for advice from a qualified medical, mental-health, legal, or financial professional. If you need urgent help, contact local emergency services or a qualified professional.",
      ],
    },
    {
      heading: "8. Third-party services",
      body: [
        "Some features rely on third-party services, such as app stores, payment providers, AI providers, or a service you choose to connect. Their own terms and privacy notices may apply to your use of those services. The relevant app will explain third-party connections where they are offered.",
      ],
    },
    {
      heading: "9. Membership and access",
      body: [
        "Some features may require a paid membership, trial, or access code. Before you purchase a membership, we will show its price, billing period, and applicable renewal and cancellation terms. Membership status and any access-code or trial end date determine which membership features are available. Payment and subscription management are handled through the payment or app-store provider shown when you subscribe; its terms may also apply.",
      ],
    },
    {
      heading: "10. Changes to the Service",
      body: [
        "We may add, change, or remove features, or suspend or discontinue the Service or any part of it, at any time. We will make reasonable efforts to give notice of significant changes where practical.",
      ],
    },
    {
      heading: "11. Termination",
      body: [
        "You may stop using the Service and delete your account at any time (Settings → Delete account). We may suspend or terminate your access if you break these Terms or where necessary to protect the Service or other users.",
      ],
    },
    {
      heading: "12. Disclaimers",
      body: [
        "The Service is provided “as is” and “as available.” To the fullest extent permitted by law, and except as expressly stated in these Terms, we make no warranties about the Service — for example, we do not warrant that it will be uninterrupted, error-free, or secure, or that content will always be preserved. How information is stored and backed up can differ between apps; check the relevant app notice and keep copies of information that matters to you.",
      ],
    },
    {
      heading: "13. Liability",
      body: [
        "Nothing in these Terms limits or excludes our liability where it would be unlawful to do so — this includes liability for death or personal injury caused by our negligence, and for fraud or fraudulent misrepresentation.",
        "Subject to the paragraph above, and to the fullest extent permitted by law, Arbor will not be liable for any indirect or consequential loss, or for any loss of data, profits, or goodwill, arising out of or relating to your use of the Service; and our total liability for any claim relating to the Service will not exceed the greater of the amount you paid us for the Service in the twelve months before the claim, or £50.",
        "If you are a consumer, you have legal rights that these Terms do not affect.",
      ],
    },
    {
      heading: "14. Indemnification",
      body: [
        "You agree to indemnify and hold Arbor harmless from any claims, damages, or expenses arising out of your misuse of the Service or your breach of these Terms.",
      ],
    },
    {
      heading: "15. Governing law and disputes",
      body: [
        "These Terms are governed by the laws of England and Wales. You and Arbor submit to the exclusive jurisdiction of the courts of England and Wales. If you are a consumer resident elsewhere in the United Kingdom, you may also bring proceedings in your home courts, and the mandatory consumer-protection laws of your home nation continue to apply to you.",
      ],
    },
    {
      heading: "16. Changes to these Terms",
      body: [
        "We may update these Terms from time to time. We will revise the “Effective” date above, and for material changes we will provide additional notice where appropriate. Your continued use of the Service after changes take effect means you accept the updated Terms.",
      ],
    },
    {
      heading: "17. Contact us",
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
