import { APP_BRANDS } from "@/lib/brand";

export const apps = {
  aevo: {
    name: "Aevo",
    tag: APP_BRANDS.aevo.domain,
    guide: {
      role: `Your ${APP_BRANDS.aevo.title}`,
      blurb:
        "Aevo learns how you actually train and builds a plan around your goals, your week and your body, adapting as you do.",
    },
    hero: APP_BRANDS.aevo.line,
    overviewTitle: "Training built around you, not a template.",
    intro:
      "Aevo pays attention to how you actually train: your goals, your level, your week and the events you're working towards. Whether you run, lift, play a sport or do all three, it plans around you instead of pushing you through someone else's programme.",
    detailedDescription:
      "Most training apps hand you a fixed plan that ignores your history, your goals and everything else going on in your life. Aevo works the other way round. It shapes your plan around your ability, your weekly routine and the goal you're working towards, and connects every session into one plan instead of scattering it across separate apps. Because it's built on Arbor, it also knows when the rest of life gets busy, so a packed week can mean a shorter session rather than a missed one.",
    targetAudience:
      "Aevo is for anyone who wants their training to understand them: runners who also lift, lifters chasing their first race, people training for a sport, and people with one simple goal who are tired of generic plans. Aevo plans around pain and illness but never diagnoses them. For anything that hurts, it will point you to a GP or physio.",
    features: [
      {
        title: "Connected training calendar",
        description:
          "Plan gym, run, conditioning, and sport sessions without splitting your training across different tools.",
        screenshot: "/screens/calendar.png",
      },
      {
        title: "Goal-aware programming",
        description:
          "Shape training around your current ability, weekly routine, and the event or performance goal you are working towards.",
        screenshot: "/screens/goals.png",
      },
      {
        title: "Performance targets",
        description:
          "Understand the weights, paces, speeds, times, and volumes that make sense for your level.",
        screenshot: "/screens/running-builder.png",
      },
      {
        title: "Training that adapts to you",
        description:
          "As your ability, schedule, and goals change, your plan adjusts — so it always reflects where you are now and where you're trying to get to.",
        screenshot: "/screens/dashboard.png",
      },
    ],
    status: "First Arbor release — now in beta on TestFlight.",
    download: {
      type: "beta" as const,
      url: "https://testflight.apple.com/join/U6JcFCB7",
    },
  },

  salus: {
    name: "Salus",
    tag: APP_BRANDS.salus.domain,
    guide: {
      role: `Your ${APP_BRANDS.salus.title}`,
      blurb:
        "Salus gives you a calm place to reflect, notice patterns and understand yourself, without turning wellbeing into another thing to optimise.",
    },
    hero: APP_BRANDS.salus.line,
    overviewTitle:
      "A calmer way to reflect, understand yourself and keep going.",
    intro:
      "Salus is a space for slowing down and paying attention. Write, reflect, answer gentle prompts and build a clearer picture of how you're doing over time, at your own pace.",
    detailedDescription:
      "Salus brings journaling and reflection together in one calm place. It asks more than it tells, helps you notice patterns in your mood and energy, and makes room for rest when you need it. Because it's built on Arbor, it can see when the rest of your life is heavy, and your other guides can lighten your week in return.",
    targetAudience:
      "Salus is for anyone who wants to understand themselves a little better: people who keep a journal, people going through a busy or unsettled time, and anyone who wants a private, judgement-free space to think things through. Salus supports and listens, but it isn't therapy or a crisis service. If you need more help, it will point you to your GP, NHS talking therapies or Samaritans on 116 123.",
    features: [
      {
        title: "Low-friction reflection",
        description:
          "Capture thoughts, moods, and experiences quickly without breaking flow.",
      },
      {
        title: "Guided prompts",
        description:
          "Reflect more deeply with structured questions designed to help uncover patterns and perspective.",
      },
      {
        title: "Personal insight",
        description:
          "Build a better understanding of values, emotions, motivations, and behaviours over time.",
      },
      {
        title: "Growth without noise",
        description:
          "Designed to feel calm, intentional, and supportive rather than addictive or overwhelming.",
      },
    ],
    status: "Second Arbor release — now in beta on TestFlight.",
    download: {
      type: "beta" as const,
      url: "https://testflight.apple.com/join/fk1Pbagw",
    },
  },

  thrive: {
    name: "Thrive",
    tag: APP_BRANDS.thrive.domain,
    guide: {
      role: `Your ${APP_BRANDS.thrive.title}`,
      blurb:
        "Thrive turns what matters to you into routines, plans and days that actually hold together.",
    },
    hero: APP_BRANDS.thrive.line,
    overviewTitle:
      "Feel organised without feeling controlled.",
    intro:
      "Thrive helps you build structure that works with real life. Plan your days, build routines and see where your time and energy really go, so you can spend more of it on what matters.",
    detailedDescription:
      "Thrive is built around real life, not an ideal productivity routine. It shows you where your time goes, helps you plan a week that's realistic, and re-plans without guilt when things don't go to plan. Because it's built on Arbor, a packed week in Thrive can quietly lighten your plans in your other apps.",
    targetAudience:
      "Thrive is for anyone who wants more structure without a system that feels rigid: people juggling work and family, students balancing study and everything else, and anyone who feels their week runs them rather than the other way round.",
    status:
     "Still in development"
  },

  nura: {
    name: "Nura",
    tag: APP_BRANDS.nura.domain,
    guide: {
      role: `Your ${APP_BRANDS.nura.title}`,
      blurb:
        "Nura helps you understand your money and plan with confidence, without stress or judgement.",
    },
    hero: APP_BRANDS.nura.line,
    overviewTitle:
      "Feel clearer and calmer about money.",
    intro:
      "Nura helps you see how your money is doing, plan ahead and save for the things you care about, so your money works for the life you want.",
    detailedDescription:
      "Nura makes money feel less overwhelming. Instead of obsessive tracking, it helps you understand where things stand and make decisions that fit your life. Because it's built on Arbor, it knows when a trip or a big week is coming, and your plans can reflect it. Nura explains and guides; it doesn't give personal investment advice. For that, it will point you to MoneyHelper or a regulated adviser.",
    targetAudience:
      "Nura is for anyone who wants a clearer picture of their money: people building better habits, households sharing costs, people saving towards something, and anyone who finds finance apps cold or stressful. Saving and enjoying it now are both valid, and Nura never judges spending.",
    status:
      "Still in development"
  },

  wend: {
    name: "Wend",
    tag: APP_BRANDS.wend.domain,
    guide: {
      role: `Your ${APP_BRANDS.wend.title}`,
      blurb:
        "Wend helps you find places, plans and moments that feel like you.",
    },
    hero: APP_BRANDS.wend.line,
    overviewTitle:
      "Free time that feels like yours.",
    intro:
      "Wend helps you make the most of your free time, from big trips to quiet weekends and nights in. Less endless searching, more time spent on things you actually enjoy.",
    detailedDescription:
      "Wend learns what you enjoy and suggests places and plans that fit, whether that's a weekend away, a new hobby or a night in. Because it's built on Arbor, it can plan around your budget in Nura and the free time in your calendar, so ideas fit the life you actually have.",
    targetAudience:
      "Wend is for anyone who wants their free time to feel well spent: people who love to travel, people who'd rather stay close to home, and everyone in between. A budget weekend counts just as much as a big trip.",
    status:
      "Still in development"
  },

  kith: {
    name: "Kith",
    tag: APP_BRANDS.kith.domain,
    guide: {
      role: `Your ${APP_BRANDS.kith.title}`,
      blurb:
        "Kith helps you stay close to the people who matter, and meet new ones you'll click with.",
    },
    hero: APP_BRANDS.kith.line,
    overviewTitle:
      "Stay close to your people.",
    intro:
      "Kith helps you keep in touch with friends, family and community, remember what matters to them and make time to see them.",
    detailedDescription:
      "Kith is about the people in your life, not feeds or follower counts. It helps you notice when you haven't seen someone in a while, find a time that works and remember the moments that matter. Because it's built on Arbor, it can suggest a catch-up when your week has room for one. It never messages anyone without you.",
    targetAudience:
      "Kith is for anyone who wants to stay closer to the people they care about, whether that's a few close friends or a big social life. Both are equally valid.",
    status:
      "Still in development"
  },

  telos: {
    name: "Telos",
    tag: APP_BRANDS.telos.domain,
    guide: {
      role: `Your ${APP_BRANDS.telos.title}`,
      blurb:
        "Telos helps you think clearly about work, strengths and purpose, and find a path that feels like yours.",
    },
    hero: APP_BRANDS.telos.line,
    overviewTitle:
      "Build work around life, not life around work.",
    intro:
      "Telos helps you think about your work, what you're good at and what you want from it, and shape a career that supports the life you want.",
    detailedDescription:
      "Telos asks the big questions and challenges kindly. It helps you understand your strengths, explore what's next and take one useful step at a time. Because it's built on Arbor, your mentor can see when work is squeezing everything else, and bring in Sage when a new skill would help.",
    targetAudience:
      "Telos is for anyone thinking about their work: people who feel stuck, people considering a change, people early in their career choosing a path, and people shaping a next chapter later in life. Changing course and sticking with it are both valid.",
    status:
      "Still in development"
  },

  sage: {
    name: "Sage",
    tag: APP_BRANDS.sage.domain,
    guide: {
      role: `Your ${APP_BRANDS.sage.title}`,
      blurb:
        "Sage helps you learn what you need to grow, and makes new things simple.",
    },
    hero: APP_BRANDS.sage.line,
    overviewTitle:
      "Learn in a way that sticks.",
    intro:
      "Sage helps you learn with direction and less overwhelm, from courses and new skills to curiosities you want to explore.",
    detailedDescription:
      "Sage is a patient tutor. It helps you choose what to learn, breaks it into simple steps and helps ideas stick instead of piling up in bookmarks. Because it's built on Arbor, it can fit learning into the gaps in your week and connect it to the goals you've set in Telos.",
    targetAudience:
      "Sage is for anyone who wants to keep learning, about themselves or the world: students, people building skills for work, and lifelong learners following their curiosity.",
    status:
      "Still in development"
  },
};