"use client";

import { useState } from "react";
import Image from "next/image";
import { APP_BRANDS, type AppId } from "@/lib/brand";
import styles from "@/components/marketing/StoryPages.module.css";

const stories: {
  label: string;
  heading: string;
  context: string;
  guides: { id: AppId; suggestion: string }[];
}[] = [
  {
    label: "Train for something bigger",
    heading: "A race on the calendar. A life around it.",
    context: "You want to get to the start line feeling ready. You also have deadlines, friends to see and days when your energy just isn’t there. A useful training plan needs that context.",
    guides: [
      { id: "aevo", suggestion: "Build towards your goal with training and recovery that fit you." },
      { id: "thrive", suggestion: "Find room for the sessions without writing off the rest of your week." },
      { id: "salus", suggestion: "Help you make sense of the pressure you’re putting on yourself." },
    ],
  },
  {
    label: "Make the trip happen",
    heading: "Less “one day”. More getting it in the diary.",
    context: "The trip you keep talking about needs more than a saved post. It needs a budget, time and a plan that feels worth following through on.",
    guides: [
      { id: "wend", suggestion: "Explore places and experiences that match what you actually enjoy." },
      { id: "nura", suggestion: "See what you can set aside without losing sight of everyday spending." },
      { id: "thrive", suggestion: "Give the planning a place in your week, not just your intentions." },
    ],
  },
  {
    label: "Build a life in a new city",
    heading: "A fresh start. Not a life on hold.",
    context: "A move can be exciting and lonely in the same week. Finding your people, your places and a routine that feels like you are all part of settling in.",
    guides: [
      { id: "kith", suggestion: "Think about the connections you want to make—and the ones you want to keep." },
      { id: "wend", suggestion: "Find reasons to get out and discover what’s around you." },
      { id: "salus", suggestion: "Give yourself space to work through the change, not just push through it." },
    ],
  },
];

export function GuideStories() {
  const [selected, setSelected] = useState(0);
  const story = stories[selected];

  return (
    <section id="life-in-context" className={`theme-dark ${styles.storySection}`} aria-labelledby="context-heading">
      <div className="site-container">
      <header className={styles.storyTop}>
        <div><p className={styles.eyebrow}>Your life, in context</p><h2 id="context-heading" className={styles.sectionTitle}>One ambition.<br />More than one part of you.</h2></div>
        <p>This is why the connections matter. Pick a situation and explore the kind of joined-up support we&apos;re building.</p>
      </header>
      <div className={styles.storyChoices} role="group" aria-label="Explore an example">
        {stories.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={selected === index} aria-controls="guide-story" onClick={() => setSelected(index)}>
            {item.label}
          </button>
        ))}
      </div>
      <div id="guide-story" className={styles.storyPanel} aria-live="polite" aria-atomic="true">
        <div>
          <h3>{story.heading}</h3>
          <p className={styles.storyContext}>{story.context}</p>
          <p className={styles.storyNote}>Illustrative, not a live app response. Connected features and app access are still being developed.</p>
        </div>
        <ol className={styles.storyGuides} aria-label="How the guides could help together">
          {story.guides.map(({ id, suggestion }) => {
            const app = APP_BRANDS[id];
            return (
              <li key={id}>
                <Image src={app.icon} alt="" width={48} height={48} unoptimized={id === "nura" || id === "wend"} />
                <div><strong>{app.name}</strong><small>Your {app.title}</small><p>{suggestion}</p></div>
              </li>
            );
          })}
        </ol>
      </div>
      </div>
    </section>
  );
}
