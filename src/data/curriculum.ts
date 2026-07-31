export interface Topic {
  id: string; // e.g. "topic-1"
  moduleId: number;
  title: string;
  youtubeId: string;
  duration: string;
  notesTemplate: string;
  exercise: string;
}

export interface Module {
  id: number;
  phaseId: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Capstone";
  skills: string[];
  objectives: string[];
  prerequisites: string[];
  topics: string[]; // Topic IDs
  assignments: string[];
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
    resources: {
      title: string;
      type: "Book" | "Article" | "Video" | "Template" | "Framework" | "Course";
      link: string;
    author?: string;
  }[];
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Capstone";
  skills: string[];
  modulesCount: number;
  iconName: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Capstone";
  duration: string;
  skills: string[];
  deliverables: string[];
  technologies: string[];
  domain: string;
  businessContext: string;
  problemStatement: string;
  requirements: string[];
  evaluationCriteria: string[];
  sampleOutput: string;
}

export interface CaseStudy {
  id: string;
  company: string;
  type: "Classic" | "AI" | "FAANG Prompt";
  title: string;
  problem: string;
  analysis: string;
  frameworkUsed: string;
  metrics: string[];
  interviewQuestions: string[];
  tags: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: "Books" | "Courses" | "Articles" | "Podcasts" | "Frameworks" | "Templates" | "Newsletters" | "YouTube";
  author: string;
  description: string;
  link: string;
  tags: string[];
}

export const PHASES: Phase[] = [
  {
    id: 1,
    title: "Product Thinking Foundations",
    description: "Master the fundamentals of product management, customer empathy, discovery, and design thinking.",
    duration: "3 weeks",
    difficulty: "Beginner",
    skills: ["Product Mindset", "User Research", "Jobs to be Done", "Design Thinking", "Empathy Mapping"],
    modulesCount: 3,
    iconName: "Compass"
  },
  {
    id: 2,
    title: "Product Strategy",
    description: "Learn how to define a product vision, craft strategies, set North Star metrics, and research markets.",
    duration: "2 weeks",
    difficulty: "Beginner",
    skills: ["Product Vision", "North Star Metric", "TAM/SAM/SOM", "Competitor Analysis", "Pricing Strategy"],
    modulesCount: 2,
    iconName: "TrendingUp"
  },
  {
    id: 3,
    title: "Building Products",
    description: "Transition from ideas to execution. Run product discovery, write comprehensive PRDs, and detail user stories.",
    duration: "3 weeks",
    difficulty: "Beginner",
    skills: ["Product Prioritization (RICE/Kano)", "UX/UI Design Basics", "PRD Writing", "User Stories"],
    modulesCount: 3,
    iconName: "Layers"
  },
  {
    id: 4,
    title: "Technical PM",
    description: "Bridge the gap between business and engineering. Learn system design, APIs, databases, and git workflows.",
    duration: "2 weeks",
    difficulty: "Intermediate",
    skills: ["APIs (REST/GraphQL)", "System Design", "SQL Basics", "Software Architecture"],
    modulesCount: 2,
    iconName: "Cpu"
  },
  {
    id: 5,
    title: "Agile Product Management",
    description: "Coordinate cross-functional engineering and design teams using Scrum, Kanban, and release planning.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["Scrum & Kanban", "Sprint Planning", "Release Roadmap", "MVP Definition"],
    modulesCount: 1,
    iconName: "GitBranch"
  },
  {
    id: 6,
    title: "Product Analytics",
    description: "Become data-driven. Design metric frameworks, setup funnels, cohorts, and design robust A/B experiments.",
    duration: "2 weeks",
    difficulty: "Intermediate",
    skills: ["Product Metrics (AARRR/HEART)", "Cohort Analysis", "A/B Testing", "Experiment Design"],
    modulesCount: 2,
    iconName: "BarChart3"
  },
  {
    id: 7,
    title: "AI Product Management",
    description: "Build the future. Understand LLMs, Prompt & Context Engineering, RAG, AI Agents, and AI UX patterns.",
    duration: "3 weeks",
    difficulty: "Advanced",
    skills: ["Generative AI", "Prompt Engineering", "RAG & Vector DBs", "AI Agents", "AI UX & Safety"],
    modulesCount: 3,
    iconName: "Sparkles"
  },
  {
    id: 8,
    title: "Growth",
    description: "Drive adoption and monetization. Learn product-led growth (PLG) loops, GTM execution, and pricing models.",
    duration: "2 weeks",
    difficulty: "Intermediate",
    skills: ["Product Led Growth", "Growth Loops", "GTM Strategy", "Monetization Models"],
    modulesCount: 2,
    iconName: "Zap"
  },
  {
    id: 9,
    title: "Business for PMs",
    description: "Understand the financial side. Unit economics, LTV/CAC calculations, P&L management, and B2B SaaS strategies.",
    duration: "2 weeks",
    difficulty: "Intermediate",
    skills: ["Unit Economics", "LTV/CAC Forecasting", "B2B SaaS PM", "Enterprise Procurement"],
    modulesCount: 2,
    iconName: "Briefcase"
  },
  {
    id: 10,
    title: "Leadership",
    description: "Align organizations. Master stakeholder management, executive presentations, and influence without authority.",
    duration: "1 week",
    difficulty: "Advanced",
    skills: ["Executive Communication", "Influence without Authority", "Conflict Resolution", "Product Reviews"],
    modulesCount: 1,
    iconName: "Users"
  },
  {
    id: 11,
    title: "Career Preparation",
    description: "Get hired. Build your PM resume, practice product sense & estimation questions, and conduct mock interviews.",
    duration: "2 weeks",
    difficulty: "Advanced",
    skills: ["PM Resume Review", "Product Sense Interview", "Estimation Interview", "Behavioral Mock"],
    modulesCount: 1,
    iconName: "GraduationCap"
  },
  {
    id: 12,
    title: "Portfolio Projects",
    description: "Build 12 progressive, industry-grade projects mimicking real-world PM responsibilities at top tech firms.",
    duration: "Ongoing",
    difficulty: "Capstone",
    skills: ["PRD Writing", "Figma Prototyping", "Analytics Dashboarding", "Product Launch GTM"],
    modulesCount: 1,
    iconName: "FolderHeart"
  }
];

export const MODULES: Module[] = [
  // Phase 1 Modules
  {
    id: 1,
    phaseId: 1,
    title: "What is Product Management?",
    description: "Understand the core responsibilities of a PM, distinct operating models, and how to develop a product mindset.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["Product Mindset", "Product Lifecycle", "Cross-functional Collaboration"],
    prerequisites: ["None"],
    objectives: [
      "Explain the differences between PM, Project Manager, and Product Owner",
      "Understand the product lifecycle stages",
      "Develop a user-first product mindset"
    ],
    topics: ["t-1-1", "t-1-2", "t-1-3", "t-1-4"],
    assignments: ["Write a 500-word critique of a product you use daily, focusing on customer pain points."],
    quiz: [
      {
        question: "What is the primary difference between a Product Manager and a Project Manager?",
        options: [
          "Product Managers own the 'Why' and 'What', while Project Managers own the 'How' and 'When'.",
          "Product Managers only write code, while Project Managers manage client budgets.",
          "Product Managers focus on day-to-day tickets, while Project Managers focus on long-term strategy.",
          "There is no difference; they are the same role."
        ],
        answerIndex: 0,
        explanation: "Product Managers deal with the product's vision, strategy, and roadmap (why & what), whereas Project Managers focus on execution, timelines, resources, and delivery (how & when)."
      }
    ],
    resources: [
      { title: "Inspired: How to Create Tech Products Customers Love", type: "Book", author: "Marty Cagan", link: "https://www.svpg.com/inspired-how-to-create-products-customers-love/" }
    ]
  },
  {
    id: 2,
    phaseId: 1,
    title: "Customer Discovery",
    description: "Learn how to talk to users, identify real problems, map customer journeys, and validate issues before writing solutions.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["User Interviews", "Jobs to be Done (JTBD)", "Journey Mapping"],
    prerequisites: ["Module 1"],
    objectives: [
      "Run non-biased customer interviews",
      "Draft a Jobs-To-Be-Done framework for a target persona",
      "Map user journey stages with pain points"
    ],
    topics: ["t-2-1", "t-2-2", "t-2-3", "t-2-4"],
    assignments: ["Interview 2 people about their online grocery habits and write down 3 verified customer problems."],
    quiz: [
      {
        question: "Which question is best suited for customer discovery interviews?",
        options: [
          "Would you buy an app that helps you manage your schedule?",
          "How much would you pay for a scheduling assistant?",
          "Tell me about the last time you struggled to organize your schedule and how you solved it.",
          "Do you think scheduling calendars are a good idea?"
        ],
        answerIndex: 2,
        explanation: "Effective customer discovery focuses on concrete past behaviors and struggles rather than hypothetical preferences or future pricing evaluations."
      }
    ],
    resources: [
      { title: "The Mom Test", type: "Book", author: "Rob Fitzpatrick", link: "https://www.momtestbook.com/" }
    ]
  },
  {
    id: 3,
    phaseId: 1,
    title: "Design Thinking",
    description: "Utilize Human-Centered Design frameworks to brainstorm, ideate, and narrow down solution directions.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["Design Thinking", "Brainstorming", "Opportunity Solution Trees"],
    prerequisites: ["Module 2"],
    objectives: [
      "Understand the Double Diamond design framework",
      "Map opportunities using Opportunity Solution Trees",
      "Sketch initial ideas using Crazy 8s"
    ],
    topics: ["t-3-1", "t-3-2", "t-3-3"],
    assignments: ["Create an Opportunity Solution Tree for a food delivery platform attempting to decrease cart abandonment."],
    quiz: [
      {
        question: "In the Double Diamond framework, what does the second diamond stand for?",
        options: [
          "Discover and Define",
          "Develop and Deliver",
          "Design and Deploy",
          "Document and Debug"
        ],
        answerIndex: 1,
        explanation: "The first diamond represents discovery and definition (understanding the problem); the second diamond represents development and delivery (ideating and creating the solution)."
      }
    ],
    resources: [
      { title: "Introduction to the Double Diamond", type: "Framework", author: "Design Council", link: "https://www.designcouncil.org.uk/our-resources/framework-for-innovation/" }
    ]
  },

  // Phase 2 Modules
  {
    id: 4,
    phaseId: 2,
    title: "Product Strategy",
    description: "Develop structural frameworks like Porter's Five Forces, Blue Ocean strategy, and formulate product missions and North Star metrics.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["Product Strategy", "North Star Metric", "Business Model Canvas"],
    prerequisites: ["Phase 1"],
    objectives: [
      "Differentiate between Vision, Strategy, and Tactics",
      "Define and validate a North Star Metric for typical business models",
      "Analyze a product using a Value Proposition Canvas"
    ],
    topics: ["t-4-1", "t-4-2", "t-4-3"],
    assignments: ["Analyze Netflix's product strategy using the Blue Ocean framework and write a mock strategy brief."],
    quiz: [
      {
        question: "What makes a good North Star Metric?",
        options: [
          "It measures daily ad impressions.",
          "It captures customer value, represents product strategy, and serves as a leading indicator of revenue.",
          "It is a lagging metric that only updates on quarterly financial calls.",
          "It tracks the total lines of code written by the engineering team."
        ],
        answerIndex: 1,
        explanation: "A North Star metric should align product teams by measuring the core value delivered to customers, which in turn leads to business success."
      }
    ],
    resources: [
      { title: "North Star Playbook", type: "Framework", author: "Amplitude", link: "https://amplitude.com/north-star" }
    ]
  },
  {
    id: 5,
    phaseId: 2,
    title: "Market Research",
    description: "Conduct quantitative calculations like TAM, SAM, and SOM, analyze competitors, and formulate pricing models.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["Market Sizing", "Competitive Analysis", "Pricing Strategy"],
    prerequisites: ["Module 4"],
    objectives: [
      "Calculate TAM, SAM, and SOM for a new product launch",
      "Draft a competitive landscape matrix",
      "Choose and justify a SaaS pricing strategy (e.g. freemium, tiered)"
    ],
    topics: ["t-5-1", "t-5-2", "t-5-3"],
    assignments: ["Estimate the Total Addressable Market (TAM) for a pet wellness app in the US and write down your assumptions."],
    quiz: [
      {
        question: "What is TAM?",
        options: [
          "Total Account Manager list",
          "Total Addressable Market: the total revenue opportunity available if a product achieves 100% market share.",
          "Target Active Monthly users: the number of active users expected in year one.",
          "Technical Architecture Model"
        ],
        answerIndex: 1,
        explanation: "TAM stands for Total Addressable Market and describes the total market demand for a product or service if 100% market share is captured."
      }
    ],
    resources: [
      { title: "How to Calculate TAM", type: "Article", author: "A16Z", link: "https://a16z.com/" }
    ]
  },

  // Phase 3 Modules
  {
    id: 6,
    phaseId: 3,
    title: "Product Discovery",
    description: "Run prioritization sessions using RICE, ICE, and Kano models to optimize value creation.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["Prioritization", "RICE Matrix", "Opportunity Assessment"],
    prerequisites: ["Phase 2"],
    objectives: [
      "Use the RICE framework to prioritize a backlog of 10 items",
      "Identify must-have vs delighter features using the Kano model",
      "Evaluate opportunities based on implementation complexity"
    ],
    topics: ["t-6-1", "t-6-2", "t-6-3"],
    assignments: ["Prioritize a given list of 5 Airbnb roadmap items using the RICE matrix with detailed score justifications."],
    quiz: [
      {
        question: "What does RICE stand for in product management prioritization?",
        options: [
          "Revenue, Interest, Cost, Effort",
          "Reach, Impact, Confidence, Effort",
          "Resource, Innovation, Competitiveness, Efficiency",
          "Retention, Insights, Conversion, Engagement"
        ],
        answerIndex: 1,
        explanation: "RICE is calculated as (Reach x Impact x Confidence) / Effort to score and prioritize features relative to one another."
      }
    ],
    resources: [
      { title: "RICE: Simple prioritization for product managers", type: "Framework", author: "Intercom", link: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/" }
    ]
  },
  {
    id: 7,
    phaseId: 3,
    title: "Product Design",
    description: "Understand user experience (UX) foundations, structure information architecture, design wireframes, and use Figma.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["UX/UI Design", "Figma Prototyping", "Wireframing"],
    prerequisites: ["Module 6"],
    objectives: [
      "Draw wireframes and map out screen navigation flows",
      "Design an interactive high-fidelity prototype in Figma",
      "Incorporate accessibility guidelines (WCAG) into UI designs"
    ],
    topics: ["t-7-1", "t-7-2", "t-7-3"],
    assignments: ["Create a 3-screen wireframe flow in Figma for a user onboarding journey on a micro-investing platform."],
    quiz: [
      {
        question: "What is the primary role of a wireframe in product design?",
        options: [
          "To test final database speeds.",
          "To illustrate screen layouts, hierarchy, and basic navigation without details like colors and branding.",
          "To serve as a production-ready css template.",
          "To generate advertising mockups for marketing campaigns."
        ],
        answerIndex: 1,
        explanation: "Wireframes serve as low-fidelity blueprints that outline layout and structural information architecture before visual polish is added."
      }
    ],
    resources: [
      { title: "Figma For Product Managers", type: "Video", author: "Figma Academy", link: "https://www.youtube.com/" }
    ]
  },
  {
    id: 8,
    phaseId: 3,
    title: "Product Requirements",
    description: "Author industry-grade Product Requirements Documents (PRDs), construct clear user stories, and outline acceptance criteria.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["PRD Writing", "User Stories", "Acceptance Criteria"],
    prerequisites: ["Module 7"],
    objectives: [
      "Write a complete, structured PRD outlining feature scope, metrics, and technical constraints",
      "Author user stories in standard format with Gherkin style (Given-When-Then) acceptance criteria",
      "Manage a backlog, detailing epics and sprint items"
    ],
    assignments: ["Draft a complete PRD for Netflix adding a 'Watch Party' feature. Include user stories and success metrics."],
    quiz: [
      {
        question: "What is the standard format for writing user stories?",
        options: [
          "If [user], then [do action], because [value].",
          "As a [type of user], I want to [perform some action] so that [co-related outcome/benefit].",
          "I will build [feature] for [customer] by [sprint date].",
          "The system shall display [data] when the user clicks [button]."
        ],
        answerIndex: 1,
        explanation: "The user story format 'As a... I want to... So that...' focuses development team members directly on user value and goals."
      }
    ],
    resources: [
      { title: "How to write a good PRD", type: "Template", author: "Lenny Rachitsky", link: "https://www.lennyrachitsky.com/p/prd-templates" }
    ],
    topics: ["t-8-1", "t-8-2", "t-8-3"]
  },

  // Phase 4 Modules
  {
    id: 9,
    phaseId: 4,
    title: "Technical Foundations",
    description: "Deep dive into APIs, system architecture, database choices (SQL vs NoSQL), authentication, caching, and CDN basics.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["APIs", "System Architecture", "SQL Basics"],
    prerequisites: ["Phase 3"],
    objectives: [
      "Understand what an API is, how REST vs GraphQL differ, and how to read JSON payloads",
      "Construct basic SQL queries using SELECT, JOIN, WHERE, and GROUP BY",
      "Distinguish between event-driven, microservice, and monolithic system designs"
    ],
    topics: ["t-9-1", "t-9-2", "t-9-3"],
    assignments: ["Write SQL queries to find the top 5 highest spending users and their favorite product category from a mock schema."],
    quiz: [
      {
        question: "Which HTTP status code signifies that a resource was not found on the server?",
        options: [
          "200 OK",
          "401 Unauthorized",
          "404 Not Found",
          "500 Internal Server Error"
        ],
        answerIndex: 2,
        explanation: "A 404 status code is returned by servers when the client is able to communicate but the requested path/file is not found."
      }
    ],
    resources: [
      { title: "APIs for Product Managers", type: "Article", author: "Airtribe", link: "https://www.airtribe.live/" }
    ]
  },
  {
    id: 10,
    phaseId: 4,
    title: "Software Engineering Basics",
    description: "Learn git workflows, continuous integration/continuous deployment (CI/CD) pipelines, and testing structures.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["Git & GitHub", "CI/CD Pipelines", "Software Testing"],
    prerequisites: ["Module 9"],
    objectives: [
      "Understand basic Git branching, merge, and pull request workflows",
      "Explain the purpose of CI/CD pipelines in code quality control",
      "Distinguish between Unit, Integration, and End-to-End automated testing"
    ],
    topics: ["t-10-1", "t-10-2", "t-10-3"],
    assignments: ["Create a diagram representing a clean Git branching strategy for a team with 3 developers working on staging and production branches."],
    quiz: [
      {
        question: "What does CI/CD stand for?",
        options: [
          "Code Integration / Cloud Deployment",
          "Continuous Integration / Continuous Delivery (or Deployment)",
          "Customer Iteration / Customer Delivery",
          "Computer Interface / Compiler Design"
        ],
        answerIndex: 1,
        explanation: "CI/CD automates building, testing, and deploying changes to make software releases safer and faster."
      }
    ],
    resources: [
      { title: "Introduction to GitHub for Non-Developers", type: "Video", author: "GitHub", link: "https://www.youtube.com/" }
    ]
  },

  // Phase 5 Module
  {
    id: 11,
    phaseId: 5,
    title: "Agile, Scrum, Kanban & Release Planning",
    description: "Master project management frameworks. Understand sprint planning, retrospectives, story point estimations, and MVP scoping.",
    duration: "1 week",
    difficulty: "Beginner",
    skills: ["Agile Development", "Scrum Ceremonies", "MVP Scoping"],
    prerequisites: ["Phase 3"],
    objectives: [
      "Differentiate between Scrum (sprints, time-boxed) and Kanban (continuous flow, WIP limits)",
      "Estimate work using Planning Poker (Story Points) based on complexity and uncertainty",
      "Formulate a release plan and coordinate deliverables across departments"
    ],
    topics: ["t-11-1", "t-11-2", "t-11-3"],
    assignments: ["Formulate a sprint scope and calendar schedule for a team launching a subscription payment page, identifying key dependencies."],
    quiz: [
      {
        question: "What is a main characteristic of Kanban compared to Scrum?",
        options: [
          "Kanban has strict 2-week iterations.",
          "Kanban relies on Work in Progress (WIP) limits instead of set time-boxes.",
          "Kanban does not allow changing priorities.",
          "Kanban requires a dedicated Scrum Master."
        ],
        answerIndex: 1,
        explanation: "Kanban focuses on continuous delivery and restricts the active tasks at any one time using Work in Progress (WIP) limits, allowing flexible priorities."
      }
    ],
    resources: [
      { title: "The Scrum Guide", type: "Framework", author: "Jeff Sutherland & Ken Schwaber", link: "https://scrumguides.org/" }
    ]
  },

  // Phase 6 Modules
  {
    id: 12,
    phaseId: 6,
    title: "Product Metrics",
    description: "Design metrics models utilizing AARRR (Pirate) and Google HEART frameworks, track cohort retentions, and structure product dashboards.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["Product Analytics", "Retention Cohorts", "AARRR Framework"],
    prerequisites: ["Phase 2", "Phase 3"],
    objectives: [
      "Map out the user lifecycle funnel using the AARRR framework",
      "Read and interpret cohort retention heatmaps to diagnose churn",
      "Define critical signals for the Google HEART dashboard"
    ],
    topics: ["t-12-1", "t-12-2", "t-12-3"],
    assignments: ["Build a Google HEART framework board for a dashboard project, choosing 2 metrics for each category (Happiness, Engagement, Adoption, Retention, Task Success)."],
    quiz: [
      {
        question: "In the AARRR metric framework, what does the first 'A' stand for?",
        options: [
          "Activation: users experience the core value proposition.",
          "Acquisition: users land on the app/landing page from marketing channels.",
          "Analysis: processing database queries.",
          "Adoption: buying an annual subscription."
        ],
        answerIndex: 1,
        explanation: "The AARRR loop consists of Acquisition, Activation, Retention, Referral, and Revenue. Acquisition is how users initially discover the product."
      }
    ],
    resources: [
      { title: "Product Analytics Book", type: "Book", author: "Amplitude", link: "https://amplitude.com/pages/product-analytics-playbook" }
    ]
  },
  {
    id: 13,
    phaseId: 6,
    title: "Experimentation",
    description: "Plan, design, and interpret A/B tests. Understand statistical significance, p-values, sample sizes, and feature flags.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["A/B Testing", "Statistical Significance", "Experiment Design"],
    prerequisites: ["Module 12"],
    objectives: [
      "Formulate testable product hypotheses",
      "Determine sample sizes and runtime calculations for statistical confidence",
      "Analyze results and decide on rolling out or rolling back features"
    ],
    topics: ["t-13-1", "t-13-2", "t-13-3"],
    assignments: ["Design an A/B test plan to change Netflix's sign-up page layout. Write down the hypothesis, primary metric, guardrail metrics, and target sample size."],
    quiz: [
      {
        question: "Why are guardrail metrics important in an A/B test?",
        options: [
          "They define the maximum speed of page load times.",
          "They protect core business metrics (e.g. latency, cancellations) from being degraded in pursuit of optimizing the target metric.",
          "They prevent users from copying text from the site.",
          "They automate code builds."
        ],
        answerIndex: 1,
        explanation: "Guardrail metrics ensure that while you try to improve a specific target (like sign-ups), you aren't severely damaging other vital indicators (like system load or retention)."
      }
    ],
    resources: [
      { title: "Trustworthy Online Controlled Experiments", type: "Book", author: "Ron Kohavi", link: "https://www.controlledexperiments.info/" }
    ]
  },

  // Phase 7 Modules (Flagship AI PM Track)
  {
    id: 14,
    phaseId: 7,
    title: "AI Foundations",
    description: "Understand the core tech of Generative AI. Explore neural networks, deep learning, transformers, tokenization, embeddings, and vector databases.",
    duration: "1 week",
    difficulty: "Advanced",
    skills: ["Machine Learning", "Transformers & LLMs", "Vector Databases"],
    prerequisites: ["Phase 4"],
    objectives: [
      "Explain how transformer-based models process text via tokenization and embeddings",
      "Describe the architecture of vector databases and their importance in AI applications",
      "Differentiate between supervised learning, unsupervised learning, and LLM pre-training"
    ],
    topics: ["t-14-1", "t-14-2", "t-14-3"],
    assignments: ["Research and sketch the workflow of a user query passing through an embedding model to retrieve contents from a vector DB."],
    quiz: [
      {
        question: "What is an embedding in the context of machine learning?",
        options: [
          "A mathematical vector representation of data (like text or images) that captures its semantic meaning.",
          "Embedding code files directly into a server directory.",
          "A font style in CSS.",
          "An encryption key for user passwords."
        ],
        answerIndex: 0,
        explanation: "Embeddings represent words or objects in high-dimensional vector spaces, placing items with similar meanings close together."
      }
    ],
    resources: [
      { title: "But what is a GPT? Visual Transformer Intro", type: "Video", author: "3Blue1Brown", link: "https://www.youtube.com/watch?v=wjZofJX0v4M" }
    ]
  },
  {
    id: 15,
    phaseId: 7,
    title: "Generative AI",
    description: "Master modern AI paradigms: Prompt & Context Engineering, Retrieval-Augmented Generation (RAG), Model Context Protocol (MCP), and AI Agent design.",
    duration: "1 week",
    difficulty: "Advanced",
    skills: ["RAG Architecture", "Prompt & Context Engineering", "AI Agents & MCP"],
    prerequisites: ["Module 14"],
    objectives: [
      "Design advanced prompting techniques (Few-shot, Chain-of-Thought, System Instructions)",
      "Outline a robust Retrieval-Augmented Generation (RAG) architecture to augment LLM context",
      "Architect autonomous AI agents capable of tool callings, loop actions, and API executions"
    ],
    topics: ["t-15-1", "t-15-2", "t-15-3", "t-15-4"],
    assignments: ["Build a system block diagram for a customer support AI Agent that uses RAG, fine-tuning, guardrails, and tool actions to query order history APIs."],
    quiz: [
      {
        question: "What does RAG stand for, and what problem does it solve?",
        options: [
          "Responsive Action Guide; solves UI button delay issues.",
          "Retrieval-Augmented Generation; solves LLM hallucination and lack of up-to-date custom data by retrieving context from external databases.",
          "Randomized Architecture Graph; solves SQL indexing bottlenecks.",
          "Recursive Agent Generator; automated testing simulator."
        ],
        answerIndex: 1,
        explanation: "RAG retrieves relevant domain documents based on user input and appends them to the LLM prompt, improving accuracy and grounding the AI response."
      }
    ],
    resources: [
      { title: "Generative AI for Product Managers", type: "Course", author: "Product Space", link: "https://www.productspace.org/" }
    ]
  },
  {
    id: 16,
    phaseId: 7,
    title: "AI Product Design",
    description: "Design premium user experiences tailored for AI. Interface patterns for Copilots, human-in-the-loop structures, safety, hallucinations, and AI metrics.",
    duration: "1 week",
    difficulty: "Advanced",
    skills: ["AI UX Patterns", "AI Safety & Guardrails", "AI Specific Metrics"],
    prerequisites: ["Module 15"],
    objectives: [
      "Select optimal UX patterns for AI outputs (streaming text, interactive chips, canvas modes)",
      "Establish guardrails and human-in-the-loop triggers to mitigate hallucination risks",
      "Define AI-centric metrics like Cost Per Query, Time-to-First-Token (TTFT), and semantic accuracy"
    ],
    topics: ["t-16-1", "t-16-2", "t-16-3"],
    assignments: ["Redesign Spotify's playlist creation flow to incorporate a generative prompt interface. Design error states for unsafe prompts."],
    quiz: [
      {
        question: "Which of the following is a vital UX best practice when designing AI-driven interfaces?",
        options: [
          "Pretending the output is 100% accurate and hiding that AI was involved.",
          "Providing user feedback controls (e.g. thumb up/down), handling hallucinations gracefully, and offering easy editing options.",
          "Preventing the user from seeing intermediate reasoning steps.",
          "Always forcing users to write long prompts to get any output."
        ],
        answerIndex: 1,
        explanation: "AI outputs are probabilistic. Great AI UX includes setting expectations, providing rapid evaluation, and making edits trivial."
      }
    ],
    resources: [
      { title: "AI UX Guidelines", type: "Framework", author: "Google PAIR", link: "https://pair.withgoogle.com/guidebook/" }
    ]
  },

  // Phase 8 Modules
  {
    id: 17,
    phaseId: 8,
    title: "Growth Loops & Monetization",
    description: "Establish viral growth loops, referral structures, pricing models (freemium, tier-based, usage-based), and optimize customer retention.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["Growth Loops", "PLG Strategy", "Monetization Models"],
    prerequisites: ["Phase 6"],
    objectives: [
      "Differentiate between viral loops (acquisition) and engagement loops (retention)",
      "Design a usage-based SaaS pricing strategy with clear feature gates",
      "Diagnose and optimize a growth funnel drop-off"
    ],
    topics: ["t-17-1", "t-17-2", "t-17-3"],
    assignments: ["Model a viral growth loop for Notion, documenting how user-created templates lead to acquisition of new workspace signups."],
    quiz: [
      {
        question: "What is Product-Led Growth (PLG)?",
        options: [
          "Relying entirely on outbound sales reps to close leads.",
          "Using the product itself (its value, features, and user experience) as the primary driver of acquisition, conversion, and expansion.",
          "A marketing strategy centered around billboard advertising.",
          "Growing a company by hiring more product managers."
        ],
        answerIndex: 1,
        explanation: "PLG centers on the product to drive growth, using free trials, freemium access, and frictionless self-service onboarding."
      }
    ],
    resources: [
      { title: "Product-Led Growth", type: "Book", author: "Wes Bush", link: "https://productled.com/book" }
    ]
  },
  {
    id: 18,
    phaseId: 8,
    title: "Go-To-Market",
    description: "Coordinate launches. Write GTM playbooks, align sales and success teams, and outline messaging frameworks.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["GTM Launch Strategy", "Product Positioning", "Sales Enablement"],
    prerequisites: ["Module 17"],
    objectives: [
      "Write a Go-To-Market plan detailing launch tier scopes (Alpha, Beta, General Availability)",
      "Draft a positioning matrix for a new product, mapping values to distinct buyer personas",
      "Equip customer-facing teams with sales sheets and FAQ collateral"
    ],
    topics: ["t-18-1", "t-18-2", "t-18-3"],
    assignments: ["Draft a GTM positioning document for Cursor AI launching an enterprise safety feature targeting security-conscious bank executives."],
    quiz: [
      {
        question: "What is the difference between pricing and packaging?",
        options: [
          "Pricing is the monetary value charged; packaging is how features are bundled together to deliver value to customer tiers.",
          "Pricing is done by engineering; packaging is done by marketing.",
          "Pricing is monthly; packaging is annual.",
          "There is no difference; they are interchangeable."
        ],
        answerIndex: 0,
        explanation: "Packaging decides which features go into which plan (e.g. Free, Pro, Enterprise); pricing sets the price tag for those plans."
      }
    ],
    resources: [
      { title: "Obviously Awesome: How to Nail Product Positioning", type: "Book", author: "April Dunford", link: "https://www.aprildunford.com/books" }
    ]
  },

  // Phase 9 Modules
  {
    id: 19,
    phaseId: 9,
    title: "Finance for PMs",
    description: "Master unit economics, formulate profit and loss metrics, calculate NPV, ROI, and forecast LTV/CAC ratios.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["Unit Economics", "LTV/CAC Ratios", "Financial Modeling"],
    prerequisites: ["Phase 2"],
    objectives: [
      "Calculate Customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC)",
      "Perform pricing and revenue modeling using excel/spreadsheets",
      "Evaluate long-term ROI and return margins for product investments"
    ],
    topics: ["t-19-1", "t-19-2", "t-19-3"],
    assignments: ["A SaaS company has an average subscription of $50/mo, a churn rate of 2%, and spends $300 to acquire a customer. Calculate LTV, CAC, and LTV:CAC ratio."],
    quiz: [
      {
        question: "What is a healthy target LTV to CAC ratio for an established B2B SaaS business?",
        options: [
          "1:1",
          "3:1 or higher",
          "1:3",
          "100:1"
        ],
        answerIndex: 1,
        explanation: "A ratio of 3:1 or higher is generally considered healthy, meaning the customer brings in three times more value over their lifetime than the cost to acquire them."
      }
    ],
    resources: [
      { title: "LTV/CAC Guide", type: "Article", author: "Tomasz Tunguz", link: "https://tomtunguz.com/" }
    ]
  },
  {
    id: 20,
    phaseId: 9,
    title: "B2B & Enterprise PM",
    description: "Understand B2B product dynamics, sales-led growth models, security compliance, APIs as products, and procurement integrations.",
    duration: "1 week",
    difficulty: "Intermediate",
    skills: ["B2B SaaS PM", "Enterprise Compliance (SOC2)", "Procurement Integrations"],
    prerequisites: ["Module 19"],
    objectives: [
      "Explain the distinction between the user (employee) and the buyer (IT/finance executive) in B2B",
      "Design features required for enterprise compliance (SSO, Role-Based Access Control, SOC2 audits)",
      "Identify APIs-as-a-Product requirements and sandbox configurations"
    ],
    topics: ["t-20-1", "t-20-2", "t-20-3"],
    assignments: ["Map out the security and administration settings page features required to sell Slack into a Fortune 500 company."],
    quiz: [
      {
        question: "What is Role-Based Access Control (RBAC) in Enterprise products?",
        options: [
          "A method of charging users based on how fast they type.",
          "An administrative control that restricts system access to authorized users based on their organizational roles (e.g. Viewer, Editor, Admin).",
          "An engineering tool that compiles codebase classes.",
          "A marketing funnel segmentation."
        ],
        answerIndex: 1,
        explanation: "RBAC is a critical enterprise security requirement, ensuring employees only have access to data and configurations necessary for their job roles."
      }
    ],
    resources: [
      { title: "B2B SaaS Product Management", type: "Article", author: "Ken Norton", link: "https://kennorton.com/" }
    ]
  },

  // Phase 10 Module
  {
    id: 21,
    phaseId: 10,
    title: "Stakeholder Management & Executive Communication",
    description: "Influence without authority. Master executive presentations, handle conflicts, and align engineering, sales, and design teams.",
    duration: "1 week",
    difficulty: "Advanced",
    skills: ["Influence without Authority", "Executive Presentation", "Conflict Management"],
    prerequisites: ["Phase 3", "Phase 6"],
    objectives: [
      "Present roadmaps and metrics summaries clearly to executives",
      "Manage conflict and prioritize requests between sales (revenue-driven) and engineering (debt-driven)",
      "Establish alignment using collaborative workshops (e.g. story mapping)"
    ],
    topics: ["t-21-1", "t-21-2", "t-21-3"],
    assignments: ["Create an Executive Summary deck (3 slides) proposing a $500k investment to rebuild an e-commerce checkout flow."],
    quiz: [
      {
        question: "What does 'influence without authority' mean for a Product Manager?",
        options: [
          "Telling the engineering team what to do because you are their boss.",
          "Using data, user empathy, and collaborative alignment to guide teams toward goals when you have no direct reports.",
          "Ignoring stakeholders and building whatever you want.",
          "Hiring third-party consultants to enforce decisions."
        ],
        answerIndex: 1,
        explanation: "PMs rarely manage engineers or designers directly. They must motivate teams using convincing insights, customer data, and clear strategy."
      }
    ],
    resources: [
      { title: "Empowered: Ordinary People, Extraordinary Products", type: "Book", author: "Marty Cagan", link: "https://www.svpg.com/empowered/" }
    ]
  },

  // Phase 11 Module
  {
    id: 22,
    phaseId: 11,
    title: "Resume, Portfolio, Interviews",
    description: "Write resume bullets that pop, build a portfolio showcasing real product artifacts, and practice FAANG mock interviews.",
    duration: "2 weeks",
    difficulty: "Advanced",
    skills: ["PM Resumes", "Product Sense Interviews", "Estimation Frameworks"],
    prerequisites: ["All prior modules"],
    objectives: [
      "Format resumes using the X-Y-Z formula (Accomplished [X], as measured by [Y], by doing [Z])",
      "Structure answers to Product Sense interview questions using custom frameworks",
      "Solve estimation questions (e.g. sizing a market) in live mock environments"
    ],
    topics: ["t-22-1", "t-22-2", "t-22-3"],
    assignments: ["Rewrite 3 bullet points of your current resume using the Google X-Y-Z formula. Solve the interview prompt: 'Design an AI for LinkedIn'."],
    quiz: [
      {
        question: "What is the Google X-Y-Z formula for resume bullet points?",
        options: [
          "Create X code, in Y days, with Z errors.",
          "Accomplished [X], as measured by [Y], by doing [Z].",
          "Exceed [X] revenue, at [Y] cost, in [Z] market.",
          "Explain [X] problem, draft [Y] plan, deploy [Z] code."
        ],
        answerIndex: 1,
        explanation: "This formula ensures your resume lists concrete impact and methods (how you achieved it and how it was measured) rather than just passive duties."
      }
    ],
    resources: [
      { title: "Decode and Conquer: Answers to Product Management Interviews", type: "Book", author: "Lewis C. Lin", link: "https://www.lewis-lin.com/decode-and-conquer" }
    ]
  },

  // Phase 12 Module (Portfolio Projects)
  {
    id: 23,
    phaseId: 12,
    title: "Portfolio Projects & Capstone",
    description: "Submit and review 12 progressive portfolio projects to build an impressive profile that catches recruiters' attention.",
    duration: "Ongoing",
    difficulty: "Capstone",
    skills: ["PRD Writing", "Figma Prototyping", "Analytics Dashboarding", "GTM Strategy"],
    prerequisites: ["Phase 11"],
    objectives: [
      "Create high-fidelity PRDs, prototypes, and analytics plans for 12 progressive domains",
      "Assemble artifacts into a polished web portfolio",
      "Receive and provide review feedback on peer submissions"
    ],
    topics: ["t-23-1"],
    assignments: ["Complete and upload Project 1: Spotify - Redesign Discover Weekly."],
    quiz: [],
    resources: []
  }
];

export const TOPICS: Topic[] = [
  // Phase 1 Module 1
  {
    id: "t-1-1",
    moduleId: 1,
    title: "Role of a Product Manager",
    youtubeId: "1w3fF7M-n9o",
    duration: "15 min",
    notesTemplate: "# Notes: Role of a Product Manager\n\n- Write your takeaways here...\n- What is the product manager responsible for?\n- Why is it at the intersection of UX, Tech, and Business?",
    exercise: "Draft a definition of a Product Manager's responsibilities to explain to a non-tech team member."
  },
  {
    id: "t-1-2",
    moduleId: 1,
    title: "PM vs Project Manager vs Product Owner",
    youtubeId: "z2P9oM5a22M",
    duration: "12 min",
    notesTemplate: "# Notes: PM vs Project Manager vs Product Owner\n\n- Differentiate roles...\n- Owner of why/what vs owner of how/when vs scrum manager.",
    exercise: "Given a scenario where a project timeline is slipping but scope is fixed, document which role does what to fix the issue."
  },
  {
    id: "t-1-3",
    moduleId: 1,
    title: "The Product Mindset",
    youtubeId: "vB3PzM47_W0",
    duration: "20 min",
    notesTemplate: "# Notes: The Product Mindset\n\n- How to focus on outcomes over outputs...\n- Empathy-driven problem solving.",
    exercise: "Explain a time a feature was shipped but failed to deliver business value. What was missing?"
  },
  {
    id: "t-1-4",
    moduleId: 1,
    title: "B2B vs B2C Product Management",
    youtubeId: "4_9Bv8H_Mh4",
    duration: "18 min",
    notesTemplate: "# Notes: B2B vs B2C PM\n\n- Buyer vs User distinction...\n- Sales cycle, enterprise requirements, usability benchmarks.",
    exercise: "Select a product (e.g. Zoom) and list how its roadmap decisions differ for its B2C consumer tier vs B2B enterprise tier."
  },

  // Phase 1 Module 2
  {
    id: "t-2-1",
    moduleId: 2,
    title: "Customer Discovery & Interviews",
    youtubeId: "z1iF1c8w5L0",
    duration: "22 min",
    notesTemplate: "# Notes: Customer Interviews\n\n- Rules of non-leading questions...\n- Digging into past behaviors.",
    exercise: "Draft 5 discovery interview questions to understand how people choose a remote work workspace."
  },
  {
    id: "t-2-2",
    moduleId: 2,
    title: "Jobs To Be Done (JTBD)",
    youtubeId: "sfGtw2C1pt4",
    duration: "15 min",
    notesTemplate: "# Notes: Jobs To Be Done\n\n- Frame user needs as 'jobs' they hire products for...\n- Structure: 'When I..., I want to..., so that I can...'",
    exercise: "Write 3 JTBD job statements for someone using a ride-sharing app during rush hour."
  },
  {
    id: "t-2-3",
    moduleId: 2,
    title: "Customer Journey Mapping",
    youtubeId: "mS6mH12O_aY",
    duration: "25 min",
    notesTemplate: "# Notes: Customer Journey Mapping\n\n- Stages: Awareness, Consideration, Purchase, Retention...\n- Pain points, actions, and emotions per stage.",
    exercise: "Sketch a quick journey map for a first-time user booking a home rental on a marketplace app."
  },
  {
    id: "t-2-4",
    moduleId: 2,
    title: "User Personas & Empathy Mapping",
    youtubeId: "2nSifPeeG_c",
    duration: "15 min",
    notesTemplate: "# Notes: User Personas\n\n- Say, Think, Do, Feel matrix...\n- Avoiding fictional fluff, grounding in interview facts.",
    exercise: "Create an Empathy Map for a busy parent trying to find healthy online recipes."
  },

  // Phase 1 Module 3
  {
    id: "t-3-1",
    moduleId: 3,
    title: "Human Centered Design & Double Diamond",
    youtubeId: "x0A4Yg8Wkac",
    duration: "18 min",
    notesTemplate: "# Notes: Double Diamond\n\n- Divergent and Convergent thinking phases...",
    exercise: "Outline how you would structure a design challenge using the Double Diamond stages."
  },
  {
    id: "t-3-2",
    moduleId: 3,
    title: "Opportunity Solution Trees",
    youtubeId: "T7dG7_30h3c",
    duration: "20 min",
    notesTemplate: "# Notes: Opportunity Solution Trees\n\n- Outcome -> Opportunities -> Solutions -> Experiments structure by Teresa Torres.",
    exercise: "Draft an Opportunity Solution Tree to increase a newsletter's referral sign-ups."
  },
  {
    id: "t-3-3",
    moduleId: 3,
    title: "Design Sprints & Crazy 8s",
    youtubeId: "g6f_U2-CexA",
    duration: "14 min",
    notesTemplate: "# Notes: Design Sprints\n\n- 5-day layout from GV: Map, Sketch, Decide, Prototype, Test.",
    exercise: "Conduct a solo Crazy 8 sketch session on paper for a checkout layout and list your top 3 concepts."
  },

  // Phase 2 Module 4
  {
    id: "t-4-1",
    moduleId: 4,
    title: "Product Strategy & Vision",
    youtubeId: "4Tz5fJqDdQw",
    duration: "25 min",
    notesTemplate: "# Notes: Product Strategy & Vision\n\n- Crafting a motivating 5-year vision and a concrete strategy to get there.",
    exercise: "Write a 3-sentence product vision statement for a community recycling platform."
  },
  {
    id: "t-4-2",
    moduleId: 4,
    title: "The North Star Metric Framework",
    youtubeId: "lV3_u3QxQ78",
    duration: "18 min",
    notesTemplate: "# Notes: North Star Metric\n\n- Definition, input metrics, value reflection...",
    exercise: "Identify input metrics and the North Star Metric for Spotify, Spotify Creators, and Netflix."
  },
  {
    id: "t-4-3",
    moduleId: 4,
    title: "Competitive Strategy (Porter's / Blue Ocean)",
    youtubeId: "mYf2_FBCvXw",
    duration: "22 min",
    notesTemplate: "# Notes: Competitive Strategy\n\n- Value curves, red oceans vs blue oceans...",
    exercise: "Compare Canva and Photoshop using the Blue Ocean strategy canvas framework."
  },

  // Phase 2 Module 5
  {
    id: "t-5-1",
    moduleId: 5,
    title: "Market Sizing: TAM, SAM, SOM",
    youtubeId: "L9a_K_6wY74",
    duration: "18 min",
    notesTemplate: "# Notes: TAM SAM SOM\n\n- Top-down vs Bottom-up calculations...",
    exercise: "Calculate the TAM, SAM, and SOM for an AI-powered code auditing startup launching in Europe."
  },
  {
    id: "t-5-2",
    moduleId: 5,
    title: "Competitive Analysis & Matrices",
    youtubeId: "J8J9fA0p3i0",
    duration: "15 min",
    notesTemplate: "# Notes: Competitive Analysis\n\n- Direct vs Indirect competitors...",
    exercise: "Draft a competitive comparison matrix for Zoom, Microsoft Teams, and Discord."
  },
  {
    id: "t-5-3",
    moduleId: 5,
    title: "SaaS Pricing & Packaging Strategies",
    youtubeId: "3m7L4lK67sw",
    duration: "20 min",
    notesTemplate: "# Notes: Pricing Strategy\n\n- Tiered plans, value metric definition, usage gates...",
    exercise: "Determine the value metric and design 3 pricing tiers (Free, Pro, Enterprise) for a cloud notes application."
  },

  // Phase 3 Module 6
  {
    id: "t-6-1",
    moduleId: 6,
    title: "Opportunity Assessments",
    youtubeId: "6vS8XWdZ1c4",
    duration: "16 min",
    notesTemplate: "# Notes: Opportunity Assessment\n\n- Deciding if a problem is worth solving...",
    exercise: "Write answers to Marty Cagan's 10 Opportunity Assessment questions for an AI transcript summaries feature."
  },
  {
    id: "t-6-2",
    moduleId: 6,
    title: "Prioritization Frameworks (RICE, Kano)",
    youtubeId: "lVb0D-m_R7o",
    duration: "24 min",
    notesTemplate: "# Notes: RICE & Kano\n\n- Scoring reach, impact, confidence, and effort...",
    exercise: "Fill out a RICE matrix scoring 3 competing roadmap ideas for an e-learning platform."
  },
  {
    id: "t-6-3",
    moduleId: 6,
    title: "Scoping an MVP (Minimum Viable Product)",
    youtubeId: "1hB1p7-111g",
    duration: "20 min",
    notesTemplate: "# Notes: MVP Scoping\n\n- Viable, lovable, simple...",
    exercise: "Scope a slice-based MVP for a dog-walking marketplace app, discarding non-essential features."
  },

  // Phase 3 Module 7
  {
    id: "t-7-1",
    moduleId: 7,
    title: "UX/UI Design Principles for PMs",
    youtubeId: "3wWw_p8u6f4",
    duration: "22 min",
    notesTemplate: "# Notes: UX/UI Principles\n\n- Fitts' law, Nielsen heuristics, cognitive load...",
    exercise: "Audit an app of your choice using 3 of Jakob Nielsen's usability heuristics."
  },
  {
    id: "t-7-2",
    moduleId: 7,
    title: "Information Architecture & User Flows",
    youtubeId: "T8xM6L5e_wI",
    duration: "18 min",
    notesTemplate: "# Notes: Information Architecture\n\n- Node charts, layout maps, screen states...",
    exercise: "Map out the user flow diagram for a user changing their password and verifying it via SMS code."
  },
  {
    id: "t-7-3",
    moduleId: 7,
    title: "Figma Fundamentals & Prototyping",
    youtubeId: "k111-H3oWmc",
    duration: "30 min",
    notesTemplate: "# Notes: Figma Prototyping\n\n- Layouts, components, triggers, transitions...",
    exercise: "Design a simple interactive button component in Figma with Hover and Click active states."
  },

  // Phase 3 Module 8
  {
    id: "t-8-1",
    moduleId: 8,
    title: "Structure of a Product Requirements Document (PRD)",
    youtubeId: "eYF7M-n1-o8",
    duration: "25 min",
    notesTemplate: "# Notes: PRD Structure\n\n- Out-of-scope, goals, personas, requirements, metrics, release phases...",
    exercise: "Copy a PRD template and write out the 'Out of Scope' and 'User Personas' sections for an AI resume analyzer."
  },
  {
    id: "t-8-2",
    moduleId: 8,
    title: "Writing User Stories & Acceptance Criteria",
    youtubeId: "L9a_K_6wY9u",
    duration: "18 min",
    notesTemplate: "# Notes: User Stories\n\n- Given-When-Then criteria formats...",
    exercise: "Write 3 detailed user stories with Gherkin acceptance criteria for an app's profile edit feature."
  },
  {
    id: "t-8-3",
    moduleId: 8,
    title: "Backlog Management & Grooming",
    youtubeId: "2nSifPeeG_d",
    duration: "15 min",
    notesTemplate: "# Notes: Backlog Grooming\n\n- Prioritization, clearing stale tickets, refining descriptions...",
    exercise: "Explain how you would handle an engineering lead who claims a strategically important ticket is too low-value to do."
  },

  // Phase 4 Module 9
  {
    id: "t-9-1",
    moduleId: 9,
    title: "APIs & Web Services (REST / GraphQL)",
    youtubeId: "y8OnoxKotPQ",
    duration: "28 min",
    notesTemplate: "# Notes: APIs for PMs\n\n- Requests, headers, bodies, JSON parsing...\n- REST endpoints vs GraphQL queries.",
    exercise: "Inspect a public API (like GitHub or Weather API) and document its endpoints, request parameters, and response JSON."
  },
  {
    id: "t-9-2",
    moduleId: 9,
    title: "Database Architecture (SQL vs NoSQL)",
    youtubeId: "Tk8U2W8W8ko",
    duration: "20 min",
    notesTemplate: "# Notes: Databases\n\n- Relational tables vs document stores...\n- Schema consistency vs flexible JSON.",
    exercise: "Determine if SQL or NoSQL is better suited for a messaging app's message logs vs an order payment transaction history."
  },
  {
    id: "t-9-3",
    moduleId: 9,
    title: "System Design for Product Managers",
    youtubeId: "SgG6L-4w8_o",
    duration: "25 min",
    notesTemplate: "# Notes: System Design\n\n- Caching, CDN, microservices, load balancing...",
    exercise: "Sketch a high-level system design diagram for an online ticketing platform expecting a high-volume launch."
  },

  // Phase 4 Module 10
  {
    id: "t-10-1",
    moduleId: 10,
    title: "Git Workflows & Pull Requests",
    youtubeId: "M1x-wM-d_oo",
    duration: "15 min",
    notesTemplate: "# Notes: Git Workflows\n\n- Commits, branches, PR merges, rebases...",
    exercise: "Explain what happens during a merge conflict to a non-technical stakeholder."
  },
  {
    id: "t-10-2",
    moduleId: 10,
    title: "CI/CD Pipelines & Devops Basics",
    youtubeId: "4Tz5fJqDdQw",
    duration: "18 min",
    notesTemplate: "# Notes: CI/CD Pipelines\n\n- Automating builds, deployments, automated test triggers...",
    exercise: "List 3 points where a PM's validation step can be built into a pipeline (e.g. staging preview links)."
  },
  {
    id: "t-10-3",
    moduleId: 10,
    title: "Testing Strategies (Unit, E2E, QA)",
    youtubeId: "M_m-XwW_p8u",
    duration: "16 min",
    notesTemplate: "# Notes: Testing Strategies\n\n- Automated unit tests vs user acceptance testing...",
    exercise: "Draft a User Acceptance Testing (UAT) script for buying a gift card on a retail store app."
  },

  // Phase 5 Module 11
  {
    id: "t-11-1",
    moduleId: 11,
    title: "Scrum Ceremonies & Sprint Planning",
    youtubeId: "2p5G-O8X-28",
    duration: "22 min",
    notesTemplate: "# Notes: Scrum Ceremonies\n\n- Standup, planning, grooming, review, retro...",
    exercise: "Write a standard template for a 15-minute daily standup update for a remote team."
  },
  {
    id: "t-11-2",
    moduleId: 11,
    title: "Estimating Velocity & Story Points",
    youtubeId: "sfGtw2C1pt4",
    duration: "18 min",
    notesTemplate: "# Notes: Velocity & Story Points\n\n- Planning poker, Fibonacci sequence, calculating sprint limits...",
    exercise: "Explain why estimating tasks in hours is usually less accurate than using relative story points."
  },
  {
    id: "t-11-3",
    moduleId: 11,
    title: "Release Planning & Roadmap Alignment",
    youtubeId: "L9a_K_6wY9u",
    duration: "20 min",
    notesTemplate: "# Notes: Release Planning\n\n- Scheduling dependencies, coordinating marketing and support, launching safely...",
    exercise: "Create a checklist of 5 tasks to coordinate with the customer support team before launching a pricing change."
  },

  // Phase 6 Module 12
  {
    id: "t-12-1",
    moduleId: 12,
    title: "Introduction to Product Metrics (AARRR/HEART)",
    youtubeId: "1w3fF7M-n9o",
    duration: "22 min",
    notesTemplate: "# Notes: AARRR & HEART\n\n- Defining activation events, metrics matrices...",
    exercise: "Select an app (like Duolingo) and identify the specific user actions that correspond to each stage of the AARRR funnel."
  },
  {
    id: "t-12-2",
    moduleId: 12,
    title: "Cohort Analysis & Retention Heatmaps",
    youtubeId: "sfGtw2C1pt4",
    duration: "20 min",
    notesTemplate: "# Notes: Cohort Analysis\n\n- Acquisition cohorts vs behavioral cohorts...",
    exercise: "Interpret a mock cohort table and identify if a retention curve is flattening or continuously dropping."
  },
  {
    id: "t-12-3",
    moduleId: 12,
    title: "Analytics Tools (Amplitude, Mixpanel)",
    youtubeId: "y8OnoxKotPQ",
    duration: "25 min",
    notesTemplate: "# Notes: Analytics Tools\n\n- Event logging, properties, tracking plans...",
    exercise: "Draft an analytics tracking plan specifying events, triggers, and properties for a video play dashboard."
  },

  // Phase 6 Module 13
  {
    id: "t-13-1",
    moduleId: 13,
    title: "A/B Testing Foundations & Statistics",
    youtubeId: "L9a_K_6wY9u",
    duration: "24 min",
    notesTemplate: "# Notes: A/B Testing Statistics\n\n- Null hypothesis, p-values, type I/II errors, sample sizes...",
    exercise: "Write a hypothesis statement and define the control vs treatment layouts for an checkout page test."
  },
  {
    id: "t-13-2",
    moduleId: 13,
    title: "Feature Flags & Progressive Rollouts",
    youtubeId: "M1x-wM-d_oo",
    duration: "18 min",
    notesTemplate: "# Notes: Feature Flags\n\n- Decoupling deployment from release, canary releases...",
    exercise: "Outline a rollout plan (1%, 10%, 50%, 100%) for a new payment gateway, listing success and rollback metrics."
  },
  {
    id: "t-13-3",
    moduleId: 13,
    title: "Designing a Product Dashboard",
    youtubeId: "y8OnoxKotPQ",
    duration: "15 min",
    notesTemplate: "# Notes: Product Dashboards\n\n- Deciding on core charts, funnel visuals, key metrics...",
    exercise: "Sketch a dashboard mockup layout for a SaaS administrator to monitor daily api usage and error rates."
  },

  // Phase 7 Module 14 (AI PM Foundations)
  {
    id: "t-14-1",
    moduleId: 14,
    title: "ML, Deep Learning, & Neural Networks",
    youtubeId: "aircAruvnKk",
    duration: "25 min",
    notesTemplate: "# Notes: ML & Neural Networks\n\n- Supervised learning, layers, backpropagation, model weights...",
    exercise: "Explain the difference between a traditional heuristic program and a machine learning model."
  },
  {
    id: "t-14-2",
    moduleId: 14,
    title: "Transformers & Large Language Models (LLMs)",
    youtubeId: "zjkBMFhNj_g",
    duration: "30 min",
    notesTemplate: "# Notes: Transformers & LLMs\n\n- Key paper: Attention Is All You Need...\n- Tokenization, attention mechanism, embeddings...",
    exercise: "Andrej Karpathy introduces LLMs as text predictors. Document 3 implications of this for product output accuracy."
  },
  {
    id: "t-14-3",
    moduleId: 14,
    title: "Vector Databases & Embeddings",
    youtubeId: "y8OnoxKotPQ",
    duration: "18 min",
    notesTemplate: "# Notes: Vector Databases\n\n- Semantic search, high-dimensional vector math, pinecone/chromadb...",
    exercise: "Explain what cosine similarity is and how it helps retrieve relevant customer documents in a vector search."
  },

  // Phase 7 Module 15 (Gen AI)
  {
    id: "t-15-1",
    moduleId: 15,
    title: "Prompt Engineering & Context Design",
    youtubeId: "vB3PzM47_W0",
    duration: "20 min",
    notesTemplate: "# Notes: Prompt Engineering\n\n- Chain-of-thought, few-shot prompts, system prompts...",
    exercise: "Write a system prompt template that constrains an LLM to respond strictly as a technical support agent in JSON format."
  },
  {
    id: "t-15-2",
    moduleId: 15,
    title: "Retrieval-Augmented Generation (RAG)",
    youtubeId: "zjkBMFhNj_g",
    duration: "25 min",
    notesTemplate: "# Notes: RAG Architecture\n\n- Query -> Vector DB retrieval -> Prompt stuffing -> LLM response...",
    exercise: "Draw a RAG flow diagram showing how a customer support chatbot answers questions using a private help article PDF database."
  },
  {
    id: "t-15-3",
    moduleId: 15,
    title: "AI Agents & Tool Callings",
    youtubeId: "z1iF1c8w5L0",
    duration: "28 min",
    notesTemplate: "# Notes: AI Agents\n\n- Loops: ReAct framework (Reason + Action), function calling, tool executions...",
    exercise: "List the tool schema definitions (JSON format) for an AI agent to query user order status and file a return ticket."
  },
  {
    id: "t-15-4",
    moduleId: 15,
    title: "Model Context Protocol (MCP) & APIs",
    youtubeId: "y8OnoxKotPQ",
    duration: "20 min",
    notesTemplate: "# Notes: Model Context Protocol\n\n- Stethoscoping context, sharing server resources, standardizing LLM interactions...",
    exercise: "Design a product scenario where a calendar scheduling agent connects with a Slack agent using the Model Context Protocol."
  },

  // Phase 7 Module 16 (AI UX/Safety)
  {
    id: "t-16-1",
    moduleId: 16,
    title: "Designing AI UX & Interactions",
    youtubeId: "z1iF1c8w5L0",
    duration: "22 min",
    notesTemplate: "# Notes: AI UX\n\n- Text streaming, canvas interfaces, prompt templates, handling delays...",
    exercise: "Compare the UX design patterns of ChatGPT (conversational) with Notion AI (inline edit) and Cursor AI (split screen)."
  },
  {
    id: "t-16-2",
    moduleId: 16,
    title: "AI Safety, Hallucinations, & Guardrails",
    youtubeId: "vB3PzM47_W0",
    duration: "18 min",
    notesTemplate: "# Notes: AI Safety\n\n- Llama guard, Nemo Guardrails, filtering outputs, managing system prompts...",
    exercise: "Outline a moderation checklist for a generative logo writer platform to prevent generating inappropriate content."
  },
  {
    id: "t-16-3",
    moduleId: 16,
    title: "AI-Specific Metrics & Cost Analysis",
    youtubeId: "1w3fF7M-n9o",
    duration: "20 min",
    notesTemplate: "# Notes: AI Metrics\n\n- TTFT, Cost per 1k tokens, semantic evaluation, user accept rate...",
    exercise: "Calculate the average cost per daily user of a customer support AI assuming 5 inputs per user at $0.015 per 1k input tokens."
  },

  // Phase 8 Module 17
  {
    id: "t-17-1",
    moduleId: 17,
    title: "Product Led Growth (PLG) Loops",
    youtubeId: "3m7L4lK67sw",
    duration: "22 min",
    notesTemplate: "# Notes: PLG Loops\n\n- Contrast PLG with sales-led acquisition...",
    exercise: "Draft a viral loop diagram for Zoom, mapping how meeting invitations act as user acquisition points."
  },
  {
    id: "t-17-2",
    moduleId: 17,
    title: "Viral Expansion & Network Effects",
    youtubeId: "mYf2_FBCvXw",
    duration: "18 min",
    notesTemplate: "# Notes: Network Effects\n\n- Direct, indirect, two-sided networks...",
    exercise: "Explain the cold start problem and how Airbnb solved it for early hosts."
  },
  {
    id: "t-17-3",
    moduleId: 17,
    title: "Optimizing SaaS Monetization Tiers",
    youtubeId: "3m7L4lK67sw",
    duration: "20 min",
    notesTemplate: "# Notes: Monetization Tiers\n\n- Designing premium paywalls, trial conversions...",
    exercise: "Identify the feature gates in Figma's free plan vs professional plan and propose one improvement."
  },

  // Phase 8 Module 18
  {
    id: "t-18-1",
    moduleId: 18,
    title: "Designing a Go-To-Market (GTM) Plan",
    youtubeId: "mYf2_FBCvXw",
    duration: "24 min",
    notesTemplate: "# Notes: GTM Plan\n\n- Timeline, target buyer personas, value mapping, marketing alignment...",
    exercise: "Write a GTM plan timeline (weeks -4 to +2) for an email app launching an AI autocomplete feature."
  },
  {
    id: "t-18-2",
    moduleId: 18,
    title: "Product Positioning & Core Messaging",
    youtubeId: "3m7L4lK67sw",
    duration: "18 min",
    notesTemplate: "# Notes: Positioning\n\n- Value pillars, competitor contrasts...",
    exercise: "Draft a 1-page positioning guide that contrasts a new privacy-focused analytics app with Google Analytics."
  },
  {
    id: "t-18-3",
    moduleId: 18,
    title: "Sales Enablement & Support Collateral",
    youtubeId: "J8J9fA0p3i0",
    duration: "16 min",
    notesTemplate: "# Notes: Sales Enablement\n\n- Pitch decks, FAQ sheets, customer training plans...",
    exercise: "Write a 10-point FAQ list for support agents preparing for a major system update that alters user dashboards."
  },

  // Phase 9 Module 19
  {
    id: "t-19-1",
    moduleId: 19,
    title: "Unit Economics: LTV & CAC Calculations",
    youtubeId: "3m7L4lK67sw",
    duration: "25 min",
    notesTemplate: "# Notes: LTV & CAC\n\n- ARPU, expansion MRR, churn rate impact...",
    exercise: "Calculate the customer lifetime value (LTV) of a user with a monthly ARPU of $30, gross margin of 80%, and monthly churn of 1.5%."
  },
  {
    id: "t-19-2",
    moduleId: 19,
    title: "Pricing Metrics & Expansion Revenue",
    youtubeId: "3m7L4lK67sw",
    duration: "18 min",
    notesTemplate: "# Notes: Expansion Revenue\n\n- Cross-sells, up-sells, seat expansion loops...",
    exercise: "Design an expansion loop for a project management tool based on collaborator seat counts."
  },
  {
    id: "t-19-3",
    moduleId: 19,
    title: "P&L Management for Product Lines",
    youtubeId: "L9a_K_6wY74",
    duration: "20 min",
    notesTemplate: "# Notes: P&L Management\n\n- COGS, research & dev costs, operational margins...",
    exercise: "Analyze how a 10% increase in API infrastructure costs affects the overall gross margin of a SaaS product."
  },

  // Phase 9 Module 20
  {
    id: "t-20-1",
    moduleId: 20,
    title: "Selling to Enterprise: SOC2, SSO, & RBAC",
    youtubeId: "J8J9fA0p3i0",
    duration: "22 min",
    notesTemplate: "# Notes: Enterprise Requirements\n\n- Security checklists, SAML SSO, user provisioning...",
    exercise: "Compile a checklist of administrative security features that a startup needs before closing enterprise bank deals."
  },
  {
    id: "t-20-2",
    moduleId: 20,
    title: "API-as-a-Product & Platform PM",
    youtubeId: "y8OnoxKotPQ",
    duration: "20 min",
    notesTemplate: "# Notes: API-as-a-Product\n\n- Developer experiences, SDKs, pricing per call, rate limiting...",
    exercise: "Outline the key developer onboarding documentation structure for Stripe's checkout api."
  },
  {
    id: "t-20-3",
    moduleId: 20,
    title: "Sales-Led Growth vs Self-Serve Funnels",
    youtubeId: "3m7L4lK67sw",
    duration: "18 min",
    notesTemplate: "# Notes: Sales vs Self-Serve\n\n- Enterprise contracts, pilot periods, product assistance hooks...",
    exercise: "Design a trigger event in a self-serve platform (e.g. Slack) that prompts an enterprise sales outreach team."
  },

  // Phase 10 Module 21
  {
    id: "t-21-1",
    moduleId: 21,
    title: "Influencing without Authority",
    youtubeId: "vB3PzM47_W0",
    duration: "24 min",
    notesTemplate: "# Notes: Influence without Authority\n\n- Finding win-win tradeoffs, building trust, aligning roadmaps...",
    exercise: "Write a Slack message to an engineering lead pitching why they should help debug a critical checkout issue immediately."
  },
  {
    id: "t-21-2",
    moduleId: 21,
    title: "Executive Presentations & Product Reviews",
    youtubeId: "J8J9fA0p3i0",
    duration: "20 min",
    notesTemplate: "# Notes: Executive Presentations\n\n- The Minto Pyramid Principle, highlighting bottom-lines first...",
    exercise: "Summarize a complex feature delay into a 4-bullet update using the Minto Pyramid (answer-first) structure."
  },
  {
    id: "t-21-3",
    moduleId: 21,
    title: "Conflict Management in Product Teams",
    youtubeId: "2nSifPeeG_c",
    duration: "18 min",
    notesTemplate: "# Notes: Conflict Management\n\n- Balancing sales requests (short term MRR) vs technical debt (long term velocity)...",
    exercise: "Draft a negotiation framework that allocates 20% of team bandwidth to engineering health during roadmap planning."
  },

  // Phase 11 Module 22
  {
    id: "t-22-1",
    moduleId: 22,
    title: "Structuring a PM Resume & Portfolio",
    youtubeId: "4Tz5fJqDdQw",
    duration: "22 min",
    notesTemplate: "# Notes: Resume Formatting\n\n- Showing outcomes, scoping metrics, highlighting project artifacts...",
    exercise: "Rewrite one of your past roles' bullet points to follow the format: 'Delivered X, by doing Y, leading to Z% improvement.'"
  },
  {
    id: "t-22-2",
    moduleId: 22,
    title: "The Product Sense Interview Framework",
    youtubeId: "y8OnoxKotPQ",
    duration: "25 min",
    notesTemplate: "# Notes: Product Sense\n\n- Circles method, user segmentation, pain point prioritization, solutions...",
    exercise: "Solve the prompt: 'Design an AI-powered smart refrigerator for university dorm rooms' using the CIRCLES method."
  },
  {
    id: "t-22-3",
    moduleId: 22,
    title: "Estimation Questions & Metrics Reviews",
    youtubeId: "sfGtw2C1pt4",
    duration: "20 min",
    notesTemplate: "# Notes: Estimation Questions\n\n- Sizing math, scoping population assumptions...",
    exercise: "Estimate the annual revenue of a local bicycle repair shop in a town of 100,000 people. Write down your formula."
  },

  // Phase 12 Module 23
  {
    id: "t-23-1",
    moduleId: 23,
    title: "Launching your Portfolio Journey",
    youtubeId: "1w3fF7M-n9o",
    duration: "15 min",
    notesTemplate: "# Notes: Portfolio Projects\n\n- Overview of the 12 progressive projects...\n- Grading rubrics, submission queues, and reviews.",
    exercise: "Setup a local Google doc folder or Github repo to store your PM portfolio project deliverables."
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-1",
    title: "Spotify — Redesign Discover Weekly",
    difficulty: "Beginner",
    duration: "1 week",
    skills: ["User Research", "Jobs to be Done (JTBD)", "User Flow", "Wireframing", "PRD Writing"],
    deliverables: ["Product Requirements Document (PRD)", "Figma Wireframes (3 screens)", "User Interview Synthesis"],
    technologies: ["Figma", "Notion / Google Docs"],
    domain: "B2C Music Streaming",
    businessContext: "Discover Weekly is Spotify's flagship personalization playlist. However, user engagement has plateaued, and users report receiving suggestions that deviate from their core preferences, leading to skip rates over 40%.",
    problemStatement: "How might we design a feedback loop that lets users refine their recommendation preferences directly inside the Discover Weekly experience, improving playlist relevance and reducing high skip rates?",
    requirements: [
      "Add interactive feedback controls (e.g. 'More like this', 'Tweak recommendations') to the playlist viewport.",
      "Create a custom settings modal that allows users to filter recommended genres/artists for the week.",
      "Track preference inputs and pass them as real-time updates to the recommendation query APIs."
    ],
    evaluationCriteria: [
      "Clarity and completeness of the PRD requirements.",
      "User empathy demonstrated in interview summaries.",
      "Wireframe usability and flow layout logic."
    ],
    sampleOutput: "## Sample Output: Spotify Redesign PRD\n\n### 1. Goals\n- Reduce song skip rate on Discover Weekly by 15%.\n- Increase weekly playlist completion rate by 8%.\n\n### 2. User Stories\n- **As a active listener**, I want to flag a song that doesn't fit my mood so that the algorithm replaces it with a better option immediately.\n- **As a listener**, I want to temporarily exclude heavy metal from my recommendation engine so that my work playlist remains calm."
  },
  {
    id: "proj-2",
    title: "Netflix — Improve Content Recommendations",
    difficulty: "Beginner",
    duration: "1 week",
    skills: ["Metrics Definition", "A/B Testing Plans", "Product Roadmapping"],
    deliverables: ["A/B Test Design Doc", "KPI Dashboard Wireframe", "1-Year Product Roadmap"],
    technologies: ["Amplitude / Mixpanel templates", "Lucidchart / Miro"],
    domain: "B2C Streaming Entertainment",
    businessContext: "Netflix tracks user engagement via monthly active hours. Content discovery friction has increased, resulting in a 5% drop in session starts as users scroll endlessly without selecting a video.",
    problemStatement: "Design a new content-grouping widget ('Recommended for your weekend') and outline a statistically sound A/B test plan to measure its impact on search abandonment and streaming start rates.",
    requirements: [
      "Define primary, secondary, and guardrail metrics.",
      "Calculate target sample size and run-time parameters.",
      "Outline the feature rollout timeline using flags."
    ],
    evaluationCriteria: [
      "Statistical accuracy of A/B test plan parameters.",
      "Relevance of guardrail metrics to business revenue.",
      "Roadmap priority logic."
    ],
    sampleOutput: "## Sample A/B Test Plan: Netflix widget\n- **Hypothesis**: Presenting a 'Recommended for your weekend' carousel based on temporal viewing habits will reduce search abandonment by 10%.\n- **Primary Metric**: Conversion Rate (Percentage of sessions starting a title within 3 minutes of opening app).\n- **Guardrail Metrics**: App Load Time (latency), Unsubscribes/Cancels."
  },
  {
    id: "proj-3",
    title: "Swiggy — Increase Repeat Orders",
    difficulty: "Beginner",
    duration: "1 week",
    skills: ["Growth Loops", "Funnel Analysis", "Cohort Retention Mapping"],
    deliverables: ["Growth Funnel Audit", "Engagement Loop Mockup", "Pricing/Monetization Strategy"],
    technologies: ["Excel / Google Sheets for math", "Figma for UI"],
    domain: "B2C Hyperlocal Food Delivery",
    businessContext: "Swiggy is observing high acquisition costs for new users, but a steep drop in active orders after the first transaction. The month-1 retention rate is low at 12%.",
    problemStatement: "Design a loyalty and discount subscription program (resembling Swiggy One) and calculate the unit economics that justify its margin cost.",
    requirements: [
      "Map out the onboarding conversion funnel from App Install to 3rd food order.",
      "Design a subscription check-out card inside the standard cart page.",
      "Calculate LTV and payback periods based on a $10 recurring monthly subscription."
    ],
    evaluationCriteria: [
      "Mathematical correctness of LTV:CAC projections.",
      "Frictionless UI check-out placement.",
      "Relevance of retention loop strategy."
    ],
    sampleOutput: "## Sample Funnel and Loop Projections\n- **Acquisition Hook**: Flat 50% discount on order 1.\n- **Retention Loop**: Free delivery package on subscribing to 'Swiggy Plus'.\n- **LTV:CAC Math**: Subscribing users increase order frequency from 1.5x to 4.2x monthly, shifting user LTV from $45 to $140."
  },
  {
    id: "proj-4",
    title: "WhatsApp AI — Design an AI Copilot",
    difficulty: "Intermediate",
    duration: "1 week",
    skills: ["AI Product Design", "AI UX Patterns", "Conversational AI Interface"],
    deliverables: ["Conversational Wireframes", "AI System Architecture Diagram", "Safety & Moderation Policy"],
    technologies: ["Figma", "Whimsical / Mermaid"],
    domain: "B2C Communication / AI Assistant",
    businessContext: "WhatsApp wants to integrate a smart assistant directly into user text threads to assist with scheduling, translation, and summarizing long messages.",
    problemStatement: "Design the UX and message flows for 'WhatsApp Copilot' ensuring it feels organic, respects user data privacy, and mitigates hallucination issues.",
    requirements: [
      "Create message triggers (e.g. tagging '@copilot' or clicking an action bubble).",
      "Design context sharing controls allowing users to select which messages the AI can read.",
      "Write error handling screens for prompt violations and system failures."
    ],
    evaluationCriteria: [
      "Clean visual design matching standard WhatsApp aesthetics.",
      "Intuitive context-sharing permissions layout.",
      "Robust safety policy definition."
    ],
    sampleOutput: "## WhatsApp AI UX Specifications\n- **Trigger**: Long-press a message and click 'Ask Copilot' to initiate a split-screen session.\n- **Privacy Guard**: The AI is local-first, sending data to LLM servers only when explicitly tagged by the user.\n- **Error State**: Safe prompt filter trigger returns: 'I am unable to analyze this content. Please try another query.'"
  },
  {
    id: "proj-5",
    title: "Gmail AI — Build an AI Email Assistant",
    difficulty: "Intermediate",
    duration: "1 week",
    skills: ["AI Product Design", "UI Prompt Components", "Context Engineering"],
    deliverables: ["AI Draft Generator PRD", "Inbox Sidebar Figma Design", "Latency & Scaling plan"],
    technologies: ["Figma", "Notion"],
    domain: "B2B/B2C SaaS & Email AI",
    businessContext: "Gmail seeks to integrate a sidebar assistant (similar to Gemini) to generate email drafts, draft replies based on thread contexts, and summarize long email exchanges.",
    problemStatement: "Draft the requirements for an email autocomplete and smart reply generator, detailing how the model retrieves thread history without introducing latency bottlenecks.",
    requirements: [
      "Design a sidebar prompt box with quick action pills (e.g. 'Draft reply', 'Change tone').",
      "Specify thread context constraints (max context window tokens, RAG extraction rules).",
      "Detail success metrics (e.g. Draft Acceptance Rate, Time saved per email)."
    ],
    evaluationCriteria: [
      "Usefulness of quick-action context pills.",
      "Detailed specifications for context assembly.",
      "Performance metrics defined (TTFT, token cost limits)."
    ],
    sampleOutput: "## Gmail AI PRD Summary\n- **Feature**: 'Smart Compose Plus'\n- **UX**: Inline text streaming with gray text placeholder; clicking Tab auto-fills.\n- **Metrics**: 40% of suggestions accepted, reduction in average email composition duration by 2.5 minutes."
  },
  {
    id: "proj-6",
    title: "Airbnb — Marketplace Strategy",
    difficulty: "Intermediate",
    duration: "1 week",
    skills: ["Marketplace Dynamics", "Supply & Demand Alignment", "Trust & Safety Features"],
    deliverables: ["Supply Acquisition Strategy", "Review System Redesign", "Marketplace Liquidity Dashboard"],
    technologies: ["Figma", "Miro"],
    domain: "B2C Marketplace / Travel",
    businessContext: "Airbnb is facing supply issues in major metropolitan markets where city regulations restrict long-term vacation rentals. Meanwhile, host churn has risen due to host dissatisfaction with guest behaviors.",
    problemStatement: "Propose a regulatory-compliant supply acquisition strategy and redesign the double-blind review system to improve trust on both sides of the marketplace.",
    requirements: [
      "Design verified tenant check-in security flows.",
      "Draft an incentive system that rewards high-quality hosts and consistent guests.",
      "Construct a marketplace dashboard tracking occupancy rates and supply counts."
    ],
    evaluationCriteria: [
      "Feasibility of compliance with city ordinances.",
      "Double-blind review safety logic.",
      "Utility of marketplace dashboard indicators."
    ],
    sampleOutput: "## Double-Blind Review Spec\n- **Rule**: Host and guest reviews are hidden until both submit, or 14 days pass. This prevents retaliatory negative reviews and ensures honest feedback."
  },
  {
    id: "proj-7",
    title: "Uber — Dynamic Pricing",
    difficulty: "Intermediate",
    duration: "1 week",
    skills: ["Pricing Strategy", "Supply & Demand Balancing", "UX Trust Interfaces"],
    deliverables: ["Dynamic Pricing Algorithm Specs", "Fare Breakdown Wireframe", "Driver Incentives Model"],
    technologies: ["Figma", "Google Sheets"],
    domain: "B2C Hyperlocal Ridesharing",
    businessContext: "Uber experiences severe driver shortages during rainy hours, leading to unfulfilled rides. Passengers report feeling cheated by unpredictable surge pricing multipliers.",
    problemStatement: "Redesign the surge pricing pricing interface to build user trust and outline a matching dynamic driver incentive system to boost driver supply.",
    requirements: [
      "Create a transparent fare breakdown screen showing surge factors.",
      "Design a driver-side app interface highlighting high-multiplier demand zones.",
      "Draft driver payout adjustments for bad weather shifts."
    ],
    evaluationCriteria: [
      "Transparency of fare justifications.",
      "Usability of surge heatmaps for drivers.",
      "Balance of dynamic pricing formulas."
    ],
    sampleOutput: "## Surge UX Specifications\n- **Fare Transparency Card**: Shows Base rate + Time/Distance + Surge multiplier (justified by: '1.8x due to 45% driver shortage in your sector')."
  },
  {
    id: "proj-8",
    title: "OpenAI — Design a Custom GPT Product",
    difficulty: "Advanced",
    duration: "1 week",
    skills: ["AI Product Strategy", "AI Marketplace Design", "Developer Monetization Plans"],
    deliverables: ["GPT Store Monetization PRD", "Developer Portal Figma Layout", "Security & IP Policy"],
    technologies: ["Figma", "Notion"],
    domain: "AI Platform & Dev Tools",
    businessContext: "OpenAI has launched GPTs allowing users to customize ChatGPT. Now they need to build the GPT Store to help users distribute, discover, and monetize these customized agents.",
    problemStatement: "Design the marketplace dynamics and monetization payouts for the GPT Store, establishing developer incentives while protecting user copyright integrity.",
    requirements: [
      "Design developer portal screens for upload, review queue, and analytics.",
      "Draft a monetization model (e.g. usage-based pool, subscription split).",
      "Outline an intellectual property moderation system."
    ],
    evaluationCriteria: [
      "Viability of developer payout algorithms.",
      "Moderation pipeline scalability.",
      "Portal design usability."
    ],
    sampleOutput: "## GPT Store Monetization Spec\n- **Developer Payout Model**: Monthly pool split based on total user engagement hours with the custom GPT, requiring a minimum of 100 active user hours to qualify."
  },
  {
    id: "proj-9",
    title: "Cursor AI — Build an AI Coding Assistant",
    difficulty: "Advanced",
    duration: "1 week",
    skills: ["AI Product Strategy", "IDE Code Context Engineering", "Developer UX Patterns"],
    deliverables: ["Context Retrieval specs (.cursorrules)", "Workspace Indexing Plan", "IDE Tab Complete Design"],
    technologies: ["Figma", "Notion"],
    domain: "Developer Tools & AI IDE",
    businessContext: "Cursor AI wants to introduce a repository-wide code indexing feature (similar to Composer/Chat) that answers codebase questions without crashing local machine resources.",
    problemStatement: "Design the context engineering architecture for repository-wide index scans and outline user interface patterns to toggle context scopes (file vs folders vs whole repo).",
    requirements: [
      "Design the workspace chat component showing reference attachments.",
      "Specify indexing constraints (ignore patterns, vector DB synchronization).",
      "Optimize multi-line suggestion states in editor screens."
    ],
    evaluationCriteria: [
      "Understanding of developer context challenges.",
      "IDE interaction layout cleanliness.",
      "Repository scanning resource plan viability."
    ],
    sampleOutput: "## Cursor Context Control Specs\n- **Interface**: Prefixing queries with '@Codebase' prompts search queries across files. User can append individual file chips dynamically in the prompt bar."
  },
  {
    id: "proj-10",
    title: "Healthcare AI Product",
    difficulty: "Advanced",
    duration: "1 week",
    skills: ["Regulated AI PM", "HIPAA Compliance", "Error & Diagnosis UX Safety"],
    deliverables: ["Clinical Decision Support PRD", "Medical Audit log Specs", "Compliance Checklist (HIPAA/FDA)"],
    technologies: ["Notion", "Lucidchart"],
    domain: "HealthTech / AI Diagnosis Support",
    businessContext: "A digital health company wants to launch an AI tool that scans radiological images to flag early signs of lung nodules. The product must comply with FDA regulations.",
    problemStatement: "Draft the regulatory validation and clinical integration requirements for a radiology AI assistant, ensuring diagnosis accuracy and detailed audit logging.",
    requirements: [
      "Design UI highlights on CT scans with clear probability scores.",
      "Draft a Clinician-in-the-loop validation flow for approval.",
      "Outline compliance safeguards for patient data encryption (HIPAA)."
    ],
    evaluationCriteria: [
      "Depth of regulatory knowledge (FDA Class II/III guidelines).",
      "Safety mechanisms for false negatives.",
      "Audit trail specifications."
    ],
    sampleOutput: "## Healthcare AI Safety Protocol\n- **FDA Rule**: The AI is classified as Clinical Decision Support Software. It flags potential anomalies but cannot finalize diagnostics; a certified radiologist must click 'Approve/Reject' for every nodule card."
  },
  {
    id: "proj-11",
    title: "Enterprise SaaS Dashboard",
    difficulty: "Advanced",
    duration: "1 week",
    skills: ["B2B SaaS PM", "Enterprise SSO/RBAC Permissions", "Usage Billing Analytics"],
    deliverables: ["RBAC Permission Settings Design", "Billings & Audit Portal UI", "SaaS Admin PRD"],
    technologies: ["Figma", "Notion"],
    domain: "B2B Enterprise SaaS",
    businessContext: "A SaaS company scaling to enterprise customers needs a robust workspace admin panel. Customers require SAML SSO, audit log history, and custom team seat assignments.",
    problemStatement: "Design the administrative workspace dashboard for an enterprise client to manage users, security compliance, billing usage, and audit logs.",
    requirements: [
      "Create team permission management screens (Owner, Administrator, Member, Billing).",
      "Design audit logs tracking actions (SSO changes, data export triggers).",
      "Formulate custom API rate-limit widgets."
    ],
    evaluationCriteria: [
      "Security layout alignment.",
      "Detailed audit log schemas.",
      "Clarity of enterprise seat budgeting controls."
    ],
    sampleOutput: "## Enterprise Workspace Spec\n- **SSO SAML Toggle**: Allows admins to enforce login via Okta or Active Directory. Turning SSO on disables local password access for all users under the company domain."
  },
  {
    id: "proj-12",
    title: "Capstone — Your Own Startup",
    difficulty: "Capstone",
    duration: "4 weeks",
    skills: ["End-to-End PM Specs", "GTM Strategy", "Figma Prototyping", "Analytics Tracking"],
    deliverables: ["Comprehensive Launch PRD", "High-fidelity Figma Prototype", "Analytics Setup & GTM Strategy Deck"],
    technologies: ["Figma", "Notion / Pitch decks", "Google Sheets"],
    domain: "Founder / Any Domain",
    businessContext: "You are the founding PM of your own startup. You must compile all the skills learned—from customer discovery to GTM execution—to define, design, and plan a product launch.",
    problemStatement: "Select a real-world problem of your choice, validate it, design a product solution, write the full PRD, build a prototype, and write the launch GTM plan.",
    requirements: [
      "Draft User Interview Synthesis and JTBD statements.",
      "Complete a feature PRD including technical system block diagrams.",
      "Create an interactive Figma prototype representing the core MVP flow.",
      "Formulate the TAM, pricing tiers, and Go-to-Market launch plan."
    ],
    evaluationCriteria: [
      "Overall cohesion across research, design, technology, and strategy.",
      "High level of polish in Figma prototypes.",
      "Realistic and actionable Go-To-Market roadmap."
    ],
    sampleOutput: "## Capstone Portfolio Structure\n- **Link**: [My Startup Portfolio](file:///docs/capstone_portfolio.pdf)\n- **Overview**: Includes discovery notes, 10-page product PRD, 15-screen Figma interactive prototype, unit economics model, and GTM launch deck."
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-1",
    company: "Spotify",
    type: "Classic",
    title: "Unlocking Virality with Spotify Wrapped",
    problem: "How Spotify turned raw listening histories into a annual social media sensation, transforming user data into a viral user-acquisition growth engine.",
    analysis: "Spotify shifted from simple metric charts to personalized, shareable story modules. They targeted social network sizing guidelines to fit Instagram and Snapchat stories, using bold colors and custom graphics. They optimized the sharing flow to be single-click, generating free viral reach.",
    frameworkUsed: "Viral Loop Acquisition Strategy",
    metrics: ["Social Shares (Instagram/X)", "User Engagement Hours", "December App Downloads (30% increase YoY)"],
    interviewQuestions: [
      "How would you evaluate the ROI of Spotify Wrapped which doesn't directly charge users?",
      "Design an equivalent 'Wrapped' feature for an online banking app. What metrics would you show?"
    ],
    tags: ["Growth Loops", "B2C", "Social Sharing", "Data Personalization"]
  },
  {
    id: "case-2",
    company: "Netflix",
    type: "Classic",
    title: "The Transition from Ratings to Personalization",
    problem: "Netflix observed that users struggled to rate movies out of 5 stars, leading to a decline in rating volume and inaccurate recommendation predictions.",
    analysis: "Netflix replaced the 5-star rating scale with a simpler Thumbs Up/Down model. This reduced user cognitive friction and increased total rating inputs by 200%. They combined this data with implicit signals (watch time, hover durations) to compute a personalized 'Match Score' percentage per user.",
    frameworkUsed: "Implicit Signals Recommendation Model",
    metrics: ["Rating volume increase", "Discovery completion rates", "User watch time sessions"],
    interviewQuestions: [
      "Why did the Thumbs Up/Down model outperform the 5-star rating model?",
      "What primary metric would you track if you were changing the Netflix recommendation engine?"
    ],
    tags: ["Personalization", "A/B Testing", "UX Friction", "Metrics"]
  },
  {
    id: "case-3",
    company: "ChatGPT",
    type: "AI",
    title: "Shattering App Growth Records: ChatGPT Launch",
    problem: "OpenAI launched a research preview of GPT-3.5 in a conversational format. They needed to scale interface availability to support 100 million active users in 2 months.",
    analysis: "By wrapping an API in a minimal conversational interface resembling text message apps, OpenAI made AI accessible to non-technical users. They optimized text streaming (generating responses word-by-word) which reduced the user's perceived latency, transforming wait times into engaging active reading states.",
    frameworkUsed: "Conversational Chat UX & API Scaling",
    metrics: ["Monthly Active Users (reached 100M in 60 days)", "Cost per inference query", "User retention cohorts"],
    interviewQuestions: [
      "How does word-by-word text streaming affect user engagement and perceived latency?",
      "If you were the PM, how would you balance compute cost thresholds vs model response lengths?"
    ],
    tags: ["Generative AI", "AI UX", "App Scaling", "First-Mover Advantage"]
  },
  {
    id: "case-4",
    company: "Cursor",
    type: "AI",
    title: "Reimagining the IDE with Repository-Wide Context",
    problem: "Traditional coding assistants (like Copilot) suggest line autocompletes but lack context of whole directories, causing incorrect imports and code patterns.",
    analysis: "Cursor integrated context indexing. By compiling codebase files into a local vector index, Cursor allows the editor model to retrieve relevant code snippets across files contextually. They introduced split-screen chat panels and custom keyboard shortcuts (Cmd+K) to trigger editing inside active files directly.",
    frameworkUsed: "Context Retrieval-Augmented IDE (RAG)",
    metrics: ["Workspace Code Acceptance Rate", "Search queries saved per developer", "IDE retention levels"],
    interviewQuestions: [
      "How does Cursor's @-mention context indexing interface reduce developer search friction?",
      "How would you measure the success of Cursor's Cmd+K edit suggestion feature?"
    ],
    tags: ["AI IDE", "Vector Indexing", "Developer UX", "Product Strategy"]
  },
  {
    id: "case-5",
    company: "Google Maps",
    type: "FAANG Prompt",
    title: "FAANG Interview: Improve Google Maps for Tourists",
    problem: "Google Maps is highly optimized for daily commuting but fails to help tourists discover local hidden gems, historical spots, and plan itineraries.",
    analysis: "A framework answer to improve Google Maps: 1. Target tourist segments (active explorers, budget backpackers). 2. Detail pain points (finding authentic spots, lack of offline maps, route sequence optimization). 3. Propose solutions: 'Tourist Mode' toggle, AI-guided walking itineraries, offline audio guide pins. 4. Prioritize using RICE and establish metric frameworks.",
    frameworkUsed: "CIRCLES Method Product Sense",
    metrics: ["Tourist mode activations", "Itinerary save rates", "Local business bookmark metrics"],
    interviewQuestions: [
      "How would you prioritize between a tourist itinerary planner vs improving ETA routing accuracy?",
      "What are the privacy considerations of recommending local pins based on real-time location histories?"
    ],
    tags: ["Product Sense", "Interview Prep", "User Segmentation", "Maps"]
  }
];

export const RESOURCE_LIBRARY: ResourceItem[] = [
  {
    id: "res-1",
    title: "Inspired: How to Create Tech Products Customers Love",
    category: "Books",
    author: "Marty Cagan",
    description: "The bible of tech product management. Explains how to set up product teams, discover value, and ship products that win.",
    link: "https://www.svpg.com/inspired-how-to-create-products-customers-love/",
    tags: ["Product Team", "Discovery", "Process"]
  },
  {
    id: "res-2",
    title: "The Mom Test",
    category: "Books",
    author: "Rob Fitzpatrick",
    description: "A practical guide on how to talk to customers and validate ideas even when everyone is lying to you.",
    link: "https://www.momtestbook.com/",
    tags: ["User Interview", "Discovery", "Customer Feedback"]
  },
  {
    id: "res-3",
    title: "Lenny's Podcast & Newsletter",
    category: "Podcasts",
    author: "Lenny Rachitsky",
    description: "The top product podcast. Deconstructs PM growth strategies, GTM playbooks, and organizational structures with tech leaders.",
    link: "https://www.lennyrachitsky.com/",
    tags: ["Podcast", "PM Career", "Growth Strategies"]
  },
  {
    id: "res-4",
    title: "Product-Led Growth Playbook",
    category: "Frameworks",
    author: "Wes Bush",
    description: "A comprehensive guide on how to design freemium systems, onboarding flows, and growth loops to scale products.",
    link: "https://productled.com/",
    tags: ["PLG", "Growth", "Pricing"]
  },
  {
    id: "res-5",
    title: "Google PAIR AI UX Guidebook",
    category: "Templates",
    author: "Google PAIR",
    description: "A set of guidelines and design patterns for building human-centered AI products that feel safe and trustable.",
    link: "https://pair.withgoogle.com/guidebook/",
    tags: ["AI UX", "Generative AI", "Design Patterns"]
  }
];
