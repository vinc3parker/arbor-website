"use client";

import { useState } from "react";
import { APP_BRANDS, type AppId } from "@/lib/brand";
import { GuideSparkles } from "@/components/GuideSparkles";

const stories: {
  label: string;
  heading: string;
  context: string;
  guides: { id: AppId; suggestion: string }[];
}[] = [
  {
    label: "A busy week",
    heading: "Life gets busy. Your plans can make room.",
    context: "You tell Thrive your week is full. That understanding can help your other guides offer a more realistic plan.",
    guides: [
      { id: "thrive", suggestion: "Find space for the things that matter most." },
      { id: "aevo", suggestion: "Offer a shorter session that fits the time you have." },
      { id: "salus", suggestion: "Make a little room to pause and check in." },
    ],
  },
  {
    label: "A new direction",
    heading: "A new goal touches more than one part of life.",
    context: "A change of career can mean new skills and a different routine. The idea is for your guides to help you consider those pieces together.",
    guides: [
      { id: "telos", suggestion: "Explore the direction you want your work to take." },
      { id: "sage", suggestion: "Break the skills you want to learn into smaller steps." },
      { id: "thrive", suggestion: "Help you make time for those steps in your week." },
    ],
  },
  {
    label: "Time for yourself",
    heading: "Free time that feels like your own.",
    context: "When you want something to look forward to, your interests, time and budget all matter. Your guides could help you find something that fits.",
    guides: [
      { id: "wend", suggestion: "Find an experience that speaks to your interests." },
      { id: "nura", suggestion: "Help you see how it fits with your spending plans." },
      { id: "kith", suggestion: "Think of someone you would love to share it with." },
    ],
  },
];

export function GuideStories() {
  const [selected, setSelected] = useState(0);
  const story = stories[selected];

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-line">
      <div className="flex flex-wrap gap-2 border-b border-line bg-surface/50 p-3 sm:p-4" aria-label="Explore an example">
        {stories.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={selected === index} aria-controls="guide-story" onClick={() => setSelected(index)} className={`min-h-11 rounded-xl px-4 text-sm font-medium transition sm:px-5 ${selected === index ? "bg-fg text-bg" : "text-fg-2 hover:bg-raised hover:text-fg"}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div id="guide-story" className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16" aria-live="polite" aria-atomic="true">
        <div>
          <p className="ui-kicker">The connected experience we&apos;re building</p>
          <h3 className="type-h2 max-w-lg">{story.heading}</h3>
          <p className="mt-5 max-w-lg leading-relaxed text-fg-2">{story.context}</p>
          <p className="mt-6 type-caption text-fg-2">An illustrative example of the connected experience Arbor is building.</p>
        </div>
        <ol className="divide-y divide-line">
          {story.guides.map(({ id, suggestion }) => {
            const app = APP_BRANDS[id];
            return (
              <li key={id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                <span className="theme-dark grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bg"><GuideSparkles colour={app.onInk} label={`${app.name}, your ${app.title}`} size={22} /></span>
                <div><p className="text-sm font-semibold">{app.name} <span className="font-normal text-fg-2">/ Your {app.title}</span></p><p className="mt-1.5 text-sm leading-relaxed text-fg-2">{suggestion}</p></div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
