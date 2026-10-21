import { APP_BRANDS, type AppId } from "@/lib/brand";

export type AppContent = {
  name: string;
  tag: string;
  guide: { role: string; blurb: string };
  hero: string;
  overviewTitle: string;
  intro: string;
  detailedDescription: string;
  targetAudience: string;
  features: { title: string; description: string; screenshot?: string }[];
  download?: { type: "beta" | "appstore"; url: string };
};

export const apps: Record<AppId, AppContent> = {
  aevo: {
    name: "Aevo",
    tag: APP_BRANDS.aevo.domain,
    guide: {
      role: `Your ${APP_BRANDS.aevo.title}`,
      blurb: "Aevo brings your training into one conversation: what you want your body ready for, what your week allows and the next session that makes sense.",
    },
    hero: APP_BRANDS.aevo.line,
    overviewTitle: "Training that fits the person doing it.",
    intro: "Bring strength, running and sport into one plan. Aevo shapes training around your starting point, the time you have and the goals you choose. The app and its guide are now being tested.",
    detailedDescription: "Aevo connects the plan with the work you actually do. Your coach helps you think through your training, build sessions and review progress, without pushing you through someone else's programme. Its connection to Arbor is designed to show how training fits into the rest of your life.",
    targetAudience: "For runners who also lift, people training for a sport and anyone who wants more useful structure around movement. Aevo can help plan around limitations, but it does not diagnose or treat injuries. Health concerns belong with a qualified professional.",
    features: [
      {
        title: "One training calendar",
        description: "See gym, run, conditioning and sport sessions together, so the week makes sense as a whole.",
        screenshot: "/screens/calendar.png",
      },
      {
        title: "Goals with a plan behind them",
        description: "Build towards an event or a personal goal from your current ability and a realistic weekly routine.",
        screenshot: "/screens/goals.png",
      },
      {
        title: "Useful session detail",
        description: "Work with the weights, paces, distances and volumes that fit your level and the session ahead.",
        screenshot: "/screens/running-builder.png",
      },
      {
        title: "Room to adjust",
        description: "Review what you have done with your coach and reshape the plan when your goals or circumstances change.",
        screenshot: "/screens/dashboard.png",
      },
    ],
    download: { type: "beta", url: "https://testflight.apple.com/join/U6JcFCB7" },
  },

  salus: {
    name: "Salus",
    tag: APP_BRANDS.salus.domain,
    guide: {
      role: `Your ${APP_BRANDS.salus.title}`,
      blurb: "Salus gives you space to talk, reflect and notice what is going on. A patient guide that asks more than it tells, without judgement or pressure to feel a certain way.",
    },
    hero: APP_BRANDS.salus.line,
    overviewTitle: "A little space to understand yourself.",
    intro: "Write things down, check in with yourself and explore a thought with your companion. Salus brings reflection and gentle structure together, at your pace. The experience is now in testing.",
    detailedDescription: "Salus is built around listening and reflection. Journaling, prompts and conversations help you put words to how you feel and return to patterns over time. Its connection to Arbor is designed to give those conversations a better sense of the life you are living.",
    targetAudience: "For people who keep a journal, people navigating a busy or unsettled time and anyone who wants a private place to think. Salus supports reflection and everyday wellbeing. It is not a therapist, a treatment or a crisis service.",
    features: [
      { title: "Check in, in your own words", description: "Capture a thought, a feeling or a moment while it is fresh, without needing a perfect journal entry." },
      { title: "A conversation with room to think", description: "Explore what is on your mind with a guide that helps you find perspective rather than rushing to an answer." },
      { title: "Prompts when you need a start", description: "Use a gentle question to begin a reflection, especially when you are not sure what to write." },
      { title: "Notice your own patterns", description: "Return to your reflections and check-ins to understand what supports you and what feels harder." },
    ],
    download: { type: "beta", url: "https://testflight.apple.com/join/fk1Pbagw" },
  },

  thrive: {
    name: "Thrive",
    tag: APP_BRANDS.thrive.domain,
    guide: {
      role: `Your ${APP_BRANDS.thrive.title}`,
      blurb: "Thrive helps turn what matters into a day you can actually live. Talk through your priorities, find the next action and make room for the rest of life.",
    },
    hero: APP_BRANDS.thrive.line,
    overviewTitle: "Structure that leaves room for life.",
    intro: "Bring your tasks, calendar and routines into a clearer picture of the week. Thrive helps you organise around real commitments and realistic capacity. The app is now in testing.",
    detailedDescription: "Thrive connects planning with follow-through. Your assistant helps you decide what matters today, break things down and rethink a plan when the day changes. Its connection to Arbor is intended to help the other guides understand the time and attention you have available.",
    targetAudience: "For people juggling work and family, students balancing study with everything else and anyone who wants more structure without a rigid productivity system. A quieter day can be a good plan too.",
    features: [
      { title: "A clearer day ahead", description: "Bring tasks and scheduled commitments together so you can see what is already on your plate." },
      { title: "From intention to next action", description: "Talk through a priority with your assistant and turn it into manageable steps." },
      { title: "Routines that fit", description: "Build useful habits and recurring plans around the way your life actually works." },
      { title: "Plans you can revisit", description: "Reorganise when circumstances change, without turning a missed plan into a failure." },
    ],
  },

  nura: {
    name: "Nura",
    tag: APP_BRANDS.nura.domain,
    guide: {
      role: `Your ${APP_BRANDS.nura.title}`,
      blurb: "Nura is being built to make your money easier to understand. A calm guide for thinking through spending, saving and the things you want to make possible.",
    },
    hero: APP_BRANDS.nura.line,
    overviewTitle: "Money with your life in mind.",
    intro: "Nura is approaching testing, with work focused on making everyday money feel clearer and plans more personal. Its aim is to connect where you stand today with what you want to do next.",
    detailedDescription: "Nura brings everyday money and forward planning into one experience. Your money manager is being developed to help you understand your position, talk through options and plan for what matters to you. Connections with the other Arbor guides are intended to give that planning relevant context.",
    targetAudience: "For people building financial habits, households sharing costs and anyone saving towards something that matters. Nura is being built for explanation and planning. It does not provide regulated financial advice or personal investment recommendations.",
    features: [
      { title: "Understand where you stand", description: "A clearer view of everyday spending, commitments and the money available for your plans." },
      { title: "Give savings a purpose", description: "Plan towards the things you care about, from a little breathing room to a bigger future goal." },
      { title: "Talk it through", description: "A guide being developed to explain money in plain language and help you consider your options." },
      { title: "Plan for your real life", description: "The aim is money planning that accounts for your priorities and circumstances, without judging your choices." },
    ],
  },

  wend: {
    name: "Wend",
    tag: APP_BRANDS.wend.domain,
    guide: {
      role: `Your ${APP_BRANDS.wend.title}`,
      blurb: "Wend is being developed as your explorer: a curious guide to places, plans and experiences that feel like you, from a spare afternoon to a bigger adventure.",
    },
    hero: APP_BRANDS.wend.line,
    overviewTitle: "More possibility in your free time.",
    intro: "Wend is in development. We are building a place to discover ideas, shape a plan and make free time feel well spent, close to home or further away.",
    detailedDescription: "The aim for Wend is to turn the endless search for something to do into ideas that fit. Your explorer will help you think about what you enjoy, the time you have and the budget you have available. Its connection to Arbor is intended to make those suggestions more useful.",
    targetAudience: "Being built for people who love a big trip, people who prefer a quiet weekend and everyone in between. A free afternoon and a low-cost night in deserve as much thought as a holiday.",
    features: [
      { title: "Ideas that sound like you", description: "We are developing discovery around your interests, rather than a list of everyone's most popular places." },
      { title: "From idea to a plan", description: "The aim is to bring places, activities and practical details together when an idea is worth exploring." },
      { title: "Close to home counts", description: "Wend's direction includes everyday experiences, hobbies and nights in alongside travel." },
      { title: "Make room for what works", description: "Planned guidance will consider the time and budget you choose, with you deciding which ideas to follow." },
    ],
  },

  kith: {
    name: "Kith",
    tag: APP_BRANDS.kith.domain,
    guide: {
      role: `Your ${APP_BRANDS.kith.title}`,
      blurb: "We are planning Kith as a warm connector: a guide to staying close to the people who matter and making room for new connections.",
    },
    hero: "A future guide to staying close to your people.",
    overviewTitle: "Relationships deserve a little room.",
    intro: "Kith is in pre-development. The planned direction is thoughtful support for friendship, family and community: remembering what matters and making time for one another.",
    detailedDescription: "The idea behind Kith is simple: relationships matter, and busy lives can get in the way. A future connector could help you remember important moments, think of a small way to reach out and find time for the people you choose. These are intentions being explored, rather than available features.",
    targetAudience: "The intended audience is anyone who wants to care for their relationships more intentionally, whether that means a few close friendships or a wider community. You would decide when and how to reach out.",
    features: [
      { title: "Remember what matters", description: "We plan to explore gentle support for the dates, details and moments that matter to your people." },
      { title: "Make time to connect", description: "The aim is to help turn a thought about someone into a catch-up that fits both your lives." },
      { title: "A nudge, on your terms", description: "Planned guidance would offer ideas without pressure, with every message and interaction left to you." },
      { title: "Room for new people", description: "We are exploring how Kith could help you find connections around shared interests and community." },
    ],
  },

  telos: {
    name: "Telos",
    tag: APP_BRANDS.telos.domain,
    guide: {
      role: `Your ${APP_BRANDS.telos.title}`,
      blurb: "We are planning Telos as your mentor: a thoughtful guide for exploring your strengths, your work and the direction you want your life to take.",
    },
    hero: "A future mentor for work, purpose and what comes next.",
    overviewTitle: "Work that feels more like yours.",
    intro: "Telos is in pre-development. We are shaping a guide that would help you reflect on your work, consider different directions and find a useful next step on your own terms.",
    detailedDescription: "Telos begins with the questions behind a career: what you value, what you are good at and what you want work to make possible. The planned mentor would help you explore those questions and turn a direction into practical steps. Its scope and experience are still being defined.",
    targetAudience: "Intended for people starting a career, considering a change, feeling stuck or thinking about a new chapter. Staying where you are and changing course would both be valid outcomes.",
    features: [
      { title: "Understand your direction", description: "We plan to explore reflection on your strengths, values and the work that feels meaningful to you." },
      { title: "Consider what comes next", description: "A future mentor could help you think through a role, a change of direction or a longer-term ambition." },
      { title: "Make the next step useful", description: "The intention is to connect bigger questions with small actions you can choose to take." },
      { title: "See work in context", description: "Planned connections with Arbor would help guidance account for the rest of your life." },
    ],
  },

  sage: {
    name: "Sage",
    tag: APP_BRANDS.sage.domain,
    guide: {
      role: `Your ${APP_BRANDS.sage.title}`,
      blurb: "We are planning Sage as a patient tutor: a guide to exploring a curiosity, understanding something new and building the skills you want.",
    },
    hero: "A future tutor for the things you want to learn.",
    overviewTitle: "Follow your curiosity, with a little guidance.",
    intro: "Sage is in pre-development. Its planned direction brings patient explanation, useful practice and a sense of progress to learning, from a new skill to a question that catches your interest.",
    detailedDescription: "The idea for Sage is learning with direction and less overwhelm. A future tutor would help you decide what to explore, break something unfamiliar into understandable parts and return to what helps it stick. These are planned capabilities; the product is still being shaped.",
    targetAudience: "Intended for students, people building skills for work and lifelong learners following their interests. Learning for enjoyment would matter just as much as learning towards a qualification or career goal.",
    features: [
      { title: "Choose what to explore", description: "We plan to help you find a starting point that fits what you want to understand or become able to do." },
      { title: "Make unfamiliar things simpler", description: "The intended tutor would explain patiently and adapt to your questions and current understanding." },
      { title: "Build understanding over time", description: "We are exploring how practice and reflection could help new ideas become useful knowledge." },
      { title: "Fit learning into life", description: "The aim is a learning plan that respects your time, your interests and the pace you choose." },
    ],
  },
};
