import { APP_ORDER, type AppId } from "@/lib/brand";

export type AppLegalNotice = {
  appId: AppId;
  status: "In testing" | "Approaching testing" | "In development" | "Pre-development";
  summary: string;
  dataStatus: string;
  dataCategories: string[];
  purposes: string[];
  connections: string[];
  controls: string[];
  limits: string[];
};

export const APP_LEGAL_EFFECTIVE_DATE = "October 29, 2026";

export const APP_LEGAL_NOTICES: Record<AppId, AppLegalNotice> = {
  aevo: {
    appId: "aevo",
    status: "In testing",
    summary: "Training, recovery and physical activity.",
    dataStatus: "Aevo is in testing. The categories below describe the data its current and connected training features may use.",
    dataCategories: [
      "Training goals, plans, sessions, exercises, sets, paces, distances and notes you add.",
      "Activity, sleep, recovery and related health information from a service you explicitly connect, such as Garmin Connect.",
      "Coach conversations and relevant Arbor context you choose to make available.",
    ],
    purposes: [
      "Build and adjust training plans, record completed work and help you review progress.",
      "Add relevant workload, recovery and readiness context to coaching you request.",
      "Generate AI-assisted coaching responses when you use the coach.",
    ],
    connections: [
      "A health or training connection is optional and is explained before you enable it. If you connect Garmin Connect, Arbor Core receives only the account-linked activity and health data you allow in Garmin, including workout detail and sleep or recovery summaries.",
      "Before Garmin connection, Arbor asks for separate, explicit consent covering the connected health data and AI-assisted coaching.",
      "Aevo can use Garmin activity data for training history and can send a structured workout you select to Garmin Connect. Relevant Garmin-derived context is sent to Anthropic only when needed to generate an AI response you request; Arbor and its providers do not use it to train, evaluate or improve AI models.",
      "Only selected summaries are available to another Arbor guide when you separately opt in to connected guidance.",
    ],
    controls: [
      "You can decline or disconnect an optional health or training source. Disconnecting Garmin stops new Garmin data and removes Garmin-sourced sleep held in Arbor Core; you can also manage Arbor's access in Garmin Connect.",
      "You can manage shared Arbor information through What Arbor knows and delete your Arbor account.",
    ],
    limits: [
      "Aevo supports training decisions; it does not diagnose or treat injury or illness.",
      "Health concerns and medical decisions belong with a qualified healthcare professional.",
    ],
  },
  salus: {
    appId: "salus",
    status: "In testing",
    summary: "Reflection, journalling and everyday wellbeing.",
    dataStatus: "Salus is in testing. Its private writing and wellbeing features can involve information that is personal or sensitive.",
    dataCategories: [
      "Journal entries, reflections, check-ins, emotion labels and themes you record.",
      "Answers to optional questionnaires and conversations you choose to have with Salus.",
      "Relevant Arbor context you choose to make available to the guide.",
    ],
    purposes: [
      "Save and organise your reflections, help you revisit patterns and offer prompts.",
      "Generate an AI reflection or response when you choose an AI-assisted feature.",
      "Personalise guidance using the information and optional questionnaires you provide.",
    ],
    connections: [
      "Private writing is kept on your device where the app says it is device-only.",
      "A request uses server or AI processing only where the feature explains that processing to you.",
      "Selected summaries reach another Arbor guide only after a separate connected-guidance choice.",
    ],
    controls: [
      "You choose what to write, whether to use optional questionnaires and whether to use AI-assisted features.",
      "You can manage content in Salus, manage shared Arbor information and delete your Arbor account.",
    ],
    limits: [
      "Salus supports reflection and everyday wellbeing; it is not therapy, treatment or a crisis service.",
      "For urgent or clinical support, contact an appropriate professional or emergency service.",
    ],
  },
  thrive: {
    appId: "thrive",
    status: "In testing",
    summary: "Tasks, time, routines and day-to-day organisation.",
    dataStatus: "Thrive is in testing. Its planning features use the information you add to organise your days and weeks.",
    dataCategories: [
      "Tasks, projects, areas, routines, habits, priorities, estimates and notes you create.",
      "Calendar events or availability when you choose to connect a calendar.",
      "Assistant conversations and relevant Arbor context you choose to make available.",
    ],
    purposes: [
      "Organise tasks and commitments, build plans and help you revise them when circumstances change.",
      "Suggest manageable next actions and routines using AI when you ask the assistant.",
      "Use availability and priorities to avoid plans that conflict with your existing commitments.",
    ],
    connections: [
      "Calendar access is optional and requires the relevant device or account permission.",
      "Only selected summaries are available to another Arbor guide when you separately opt in to connected guidance.",
    ],
    controls: [
      "You can edit or delete planning content and revoke an optional calendar permission.",
      "You can manage shared Arbor information through What Arbor knows and delete your Arbor account.",
    ],
    limits: [
      "Thrive offers organisation and self-help guidance, not professional health, legal or employment advice.",
      "You remain in control of which suggested plans and actions you follow.",
    ],
  },
  nura: {
    appId: "nura",
    status: "Approaching testing",
    summary: "Everyday money, saving and forward planning.",
    dataStatus: "Nura is approaching testing. Reading about Nura on this website does not give it access to financial data. Any live connection will be explained before it is offered.",
    dataCategories: [
      "The planned service may use accounts, balances, transactions, categories, bills, income, budgets and savings goals you add or choose to connect.",
      "Money questions, plans and relevant Arbor context you choose to make available.",
    ],
    purposes: [
      "The intended uses are explaining your position, organising everyday money and planning towards goals you choose.",
      "AI-assisted features are intended to answer questions and help you consider options, not to make transactions or investment decisions for you.",
    ],
    connections: [
      "Any bank or financial connection will be optional and will identify the provider, information requested and purpose before connection.",
      "Financial information will not be shared with another guide without a specific connected-guidance choice.",
    ],
    controls: [
      "You will be able to decline or disconnect optional sources and manage information held in Nura.",
      "Available controls and retention details will be confirmed in-product before testing begins.",
    ],
    limits: [
      "Nura is being designed for explanation, organisation and planning.",
      "It will not provide regulated financial advice or personal investment recommendations.",
    ],
  },
  wend: {
    appId: "wend",
    status: "In development",
    summary: "Places, experiences, hobbies and travel planning.",
    dataStatus: "Wend is in development and is not currently collecting app-specific data through this website.",
    dataCategories: [
      "The planned service may use interests, saved ideas, trip or activity plans, time, budget and locations you choose to provide.",
      "Location access, if introduced, will be optional and requested when a feature needs it.",
    ],
    purposes: [
      "The intended uses are finding relevant ideas and helping turn a chosen idea into a practical plan.",
      "Time and budget context is intended to keep suggestions realistic for the boundaries you set.",
    ],
    connections: ["No planned device or third-party connection will be enabled simply by creating an Arbor account."],
    controls: ["Specific permissions, controls and retention details will be published before the relevant feature begins testing."],
    limits: ["You decide which suggestions to explore, book or attend; Arbor will not make a booking or commitment without your action."],
  },
  kith: {
    appId: "kith",
    status: "Pre-development",
    summary: "Friendships, family and community.",
    dataStatus: "Kith is in pre-development and is not currently collecting app-specific data through this website.",
    dataCategories: [
      "A future service may use relationship notes, important dates, reminders and contact details you choose to add.",
      "Contacts access, if introduced, will be optional and requested at the point a feature needs it.",
    ],
    purposes: ["The planned purpose is to help you remember what matters and make time for relationships you choose."],
    connections: ["Kith will not message another person or expose your private notes to them without a clear action from you."],
    controls: ["Specific permissions, controls and retention details will be published before testing begins."],
    limits: ["Kith is intended as organisational support for relationships, not counselling, safeguarding or a communications service."],
  },
  telos: {
    appId: "telos",
    status: "Pre-development",
    summary: "Work, strengths, direction and purpose.",
    dataStatus: "Telos is in pre-development and is not currently collecting app-specific data through this website.",
    dataCategories: ["A future service may use work history, skills, interests, values, goals and plans you choose to provide."],
    purposes: ["The planned purpose is reflection on work and direction, followed by practical next steps you choose."],
    connections: ["Any future connection to a professional profile or document source will be optional and explained first."],
    controls: ["Specific permissions, controls and retention details will be published before testing begins."],
    limits: ["Telos will not guarantee employment outcomes or replace regulated legal, financial or professional advice."],
  },
  sage: {
    appId: "sage",
    status: "Pre-development",
    summary: "Learning, skills and personal curiosity.",
    dataStatus: "Sage is in pre-development and is not currently collecting app-specific data through this website.",
    dataCategories: ["A future service may use learning goals, questions, study activity, practice responses and progress you choose to record."],
    purposes: ["The planned purpose is to explain topics, create useful practice and help you track learning over time."],
    connections: ["Any future connection to a course, document or learning service will be optional and explained first."],
    controls: ["Specific permissions, controls and retention details will be published before testing begins."],
    limits: ["Sage will support learning but will not issue qualifications or guarantee academic or professional outcomes."],
  },
};

export const APP_LEGAL_IDS = APP_ORDER;

export function isAppLegalId(value: string): value is AppId {
  return APP_ORDER.some((id) => id === value);
}
