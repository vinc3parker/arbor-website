export const apps = {
  aevo: {
    name: "Aevo",
    tag: "Performance",
    hero: "Training that actually understands you.",
    overviewTitle: "Training built around you, not a template.",
    intro:
      "Aevo pays attention to how you actually train — your goals, your level, your schedule, and the events you're working towards — and builds a plan that fits. Whether you run, lift, play a sport, or do all three, it adapts to you instead of pushing you through someone else's program.",
    detailedDescription:
      "Aevo is training software that adapts to the individual. Most apps hand you a fixed prescription — a generic plan that ignores your history, your goals, and everything else you have going on. Aevo works the other way around: it pays attention to how you actually train and shapes your plan around your ability, your weekly routine, and the goal or event you're working towards. Run, lift, play a sport, or combine all of them — Aevo connects every session into one coherent system instead of scattering your training across separate apps. It was built to handle real complexity — the kind that comes from balancing strength, endurance, and sport at once — which is exactly why it works just as well when your training is simpler. The result is a plan that feels made for you, because it is: one that pushes you in the direction you actually want to go.",
    targetAudience:
      "Aevo is for anyone who wants their training to understand them. That includes runners who also lift, lifters chasing their first race, people training for a sport, and hybrid athletes juggling several disciplines at once — but it's just as much for someone with a single, focused goal who's tired of generic plans. If you want training that adapts to your ability, your schedule, and where you actually want to go, rather than a one-size-fits-all prescription, Aevo is for you.",
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
    backgroundScreenshots: [
      "/screens/program.png",
      "/screens/planning.png",
      "/screens/profile.png",
    ],
  },

  salus: {
    name: "Salus",
    tag: "Mental wellbeing",
    hero: "Reflection and growth for everyday life.",
    overviewTitle:
      "A calmer way to reflect, understand yourself, and keep moving forward.",
    intro:
      "Salus is a space for slowing down and paying attention. Journal, reflect, explore guided prompts, and build a clearer picture of who you are over time — without turning growth into another thing to optimise.",
    detailedDescription:
      "Salus is a mental wellness app that combines journaling with structured reflection. It's designed for people who want to understand themselves better but feel overwhelmed by productivity-focused wellness apps. Rather than turning personal growth into another optimization task, Salus provides a calm, intentional space where reflection feels natural and sustainable.",
    targetAudience:
      "Salus is for anyone interested in deeper self-understanding and personal growth. This includes people exploring therapy concepts independently, those keeping private journals, individuals managing stress or anxiety, and anyone seeking mindfulness and reflection without the pressure of performance metrics. If you value introspection and want a judgment-free space to process your thoughts and emotions, Salus is for you.",
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
    tag: "Organisation",
    hero:
      "Build routines and stay ahead of life.",
    overviewTitle:
      "Build a life that feels organised without feeling controlled.",
    intro:
      "Thrive helps you create structure that works with real life. Build routines, plan intentionally, and understand where your time and energy actually go — so you can focus more on what matters and less on staying on top of everything.",
    detailedDescription:
      "Thrive is an organization and productivity app that helps you build sustainable routines and manage your time in a way that feels natural, not restrictive. It's designed around real life constraints — not the idealized productivity culture. Thrive lets you see where your time and energy actually go, understand your patterns, and build a system that works for you.",
    targetAudience:
      "Thrive is for people who want more structure in their lives but haven't found an organizational system that feels right. This includes busy professionals managing multiple responsibilities, parents balancing work and family, students juggling coursework and personal projects, and anyone who feels overwhelmed by their schedule. If you want to feel more in control of your time without becoming a slave to your task list, Thrive is for you.",
    status:
     "Still in development"
  },

  nura: {
    name: "Nura",
    tag: "Finance",
    hero:
      "Money built around real life.",
    overviewTitle:
      "Feel clearer and more confident about money.",
    intro:
      "Nura is designed to help people understand their finances without turning money into stress. See where things are going, plan ahead, save with purpose, and build habits that support the life you actually want.",
    detailedDescription:
      "Nura is a personal finance app that makes money management feel less overwhelming. Instead of focusing on obsessive tracking or aggressive optimization, Nura helps you understand your financial reality and make intentional decisions that align with your life. It's built for people who want clarity about money without the anxiety.",
    targetAudience:
      "Nura is for anyone who wants to understand and improve their financial situation. This includes young professionals building better money habits, families managing shared expenses, people working toward savings goals, and anyone who finds traditional finance apps cold or overwhelming. If you want financial clarity without feeling judged or pressured, Nura is for you.",
    status:
      "Still in development"
  },

  wend: {
    name: "Wend",
    tag: "Explore",
    hero:
      "Discover places and experiences.",
    overviewTitle:
      "Discover more of the world that feels like you.",
    intro:
      "Wend helps you find places, experiences, and moments that feel worth remembering. Less endless searching, more meaningful exploration shaped around what you enjoy and who you are becoming.",
    detailedDescription:
      "Wend is a travel and exploration app that reimagines how you discover places. Rather than endless algorithm-driven recommendations, Wend helps you find experiences that genuinely align with who you are. It's about quality exploration — discovering places and moments that matter, not just popular tourist spots.",
    targetAudience:
      "Wend is for travelers and adventurers who want more meaningful explorations. This includes digital nomads exploring new cities, people planning meaningful vacations, adventure seekers looking for authentic experiences, and travelers who feel overwhelmed by generic travel guides. If you value authentic experiences over Instagram-worthy locations, Wend is for you.",
    status:
      "Still in development"
  },

  kith: {
    name: "Kith",
    tag: "Connection",
    hero:
      "Intentional social connection.",
    overviewTitle:
      "Social connection that feels more human.",
    intro:
      "Kith is built around the idea that relationships deserve more than feeds and algorithms. Stay connected, spend time more intentionally, and build stronger relationships with the people who matter.",
    detailedDescription:
      "Kith is a social connection app that prioritizes relationship quality over engagement metrics. It's designed for people exhausted by social media but who still want to stay connected with others. Kith brings the focus back to what relationships are actually about — genuine human connection.",
    targetAudience:
      "Kith is for anyone who wants to maintain real relationships without social media toxicity. This includes people stepping away from traditional social networks, groups of friends wanting a private communication space, people with shared interests seeking community without algorithm-driven content, and anyone who feels social media damages rather than improves their relationships. If you value depth over reach, Kith is for you.",
    status:
      "Still in development"
  },

  telos: {
    name: "Telos",
    tag: "Purpose",
    hero:
      "Find work that fits who you are.",
    overviewTitle:
      "Build work around life, not life around work.",
    intro:
      "Telos helps people think more intentionally about work, growth, and purpose. Explore opportunities, understand your strengths, and create a career that supports the life you want to build.",
    detailedDescription:
      "Telos is a career and purpose app that challenges the traditional job search. It helps you think intentionally about your work rather than defaulting to what's available. Telos is about finding work that actually fits who you are, not forcing yourself to fit a job description.",
    targetAudience:
      "Telos is for people questioning their career path or seeking more alignment. This includes professionals feeling stuck in their current roles, career changers exploring new directions, early-career people trying to choose a path thoughtfully, and anyone who feels their job doesn't reflect their values. If you believe work should enhance your life rather than consume it, Telos is for you.",
    status:
      "Still in development"
  },

  sage: {
    name: "Sage",
    tag: "Learning",
    hero:
      "Build knowledge intentionally.",
    overviewTitle:
      "Learn in a way that actually sticks.",
    intro:
      "Sage helps people learn with more direction and less overwhelm. Build knowledge over time, connect ideas together, and make progress towards the things you genuinely want to understand.",
    detailedDescription:
      "Sage is a learning and knowledge management app that helps you build knowledge that actually sticks. Rather than bookmarking articles and forgetting them, Sage helps you construct knowledge systematically, connect ideas together, and track genuine progress toward understanding.",
    targetAudience:
      "Sage is for serious learners and knowledge seekers. This includes students wanting better study methods, professionals developing expertise in new fields, lifelong learners pursuing multiple interests, and anyone who feels they consume lots of information but retain little. If you want to learn in a way that builds genuine knowledge rather than just collecting information, Sage is for you.",
    status:
      "Still in development"
  },
};