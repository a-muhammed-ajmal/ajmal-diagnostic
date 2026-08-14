import { readingTimeMinutes } from "./readingTime";

export interface ArticleStage {
  n: string;
  name: string;
  body: string;
  practice?: string[];
  ask?: string;
}

export interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  updatedAt: string;
  excerpt: string;
  author: { name: string; role: string; bioParagraphs: string[] };
  intro: string[];
  founderTrap: { heading: string; body: string };
  theFix: { heading: string; body: string; stages: ArticleStage[] };
  payoff: { heading: string; body: string; pullQuote: string };
  whereToStart?: { heading: string; body: string[] };
  cta: { heading: string; body: string };
}

export const CATEGORIES = [
  {
    name: "Founder-Led Operations",
    slug: "founder-led-operations",
    desc: "Practical thinking on founder dependency, operating systems, team ownership, and applied AI for UAE SMEs.",
  },
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "founder-trap",
    title: "The Founder Trap: Building Beyond Founder Dependency",
    metaTitle: "The Founder Trap for Founder-Led UAE SMEs",
    description: "How founder-led UAE SMEs can spot dependence on the founder and strengthen systems, ownership, visibility, and consistent execution.",
    category: "Founder-Led Operations",
    categorySlug: "founder-led-operations",
    publishedAt: "2026-07-23",
    updatedAt: "2026-08-14",
    excerpt: "Founder dependency is an operating pattern. Learn how to observe it and where to begin building a more independent business.",
    author: {
      name: "Muhammed Ajmal",
      role: "Business Operations & Growth Consultant",
      bioParagraphs: [
        "Muhammed Ajmal is a Business Operations & Growth Consultant based in Dubai, working with founder-led UAE SMEs.",
        "He applies business management knowledge, systems thinking, practical execution, and applied AI to help businesses reduce founder dependency.",
      ],
    },
    intro: [
      "Founder dependency is not a character flaw and it is not solved by telling a founder to delegate more. It is an operating pattern: decisions, knowledge, customer relationships, or recovery work still return to one person because the business has not yet made them visible, repeatable, and owned.",
      "The first useful question is not whether the founder works hard. It is where the business waits for them, what information only they can interpret, and which standards change when they are absent.",
    ],
    founderTrap: {
      heading: "What the Founder Trap looks like",
      body: "The pattern usually shows up in observable ways: approvals are delayed, important knowledge lives in people rather than systems, urgent firefighting displaces planned work, and execution varies depending on who is involved. These symptoms are signals to investigate, not proof of a single root cause.",
    },
    theFix: {
      heading: "What to examine next",
      body: "A practical response turns dependency into a visible operating question. Each area below helps move responsibility from individual memory into a business that can be understood, managed, and improved.",
      stages: [
        {
          n: "01",
          name: "Make the dependency visible",
          body: "List recurring decisions, approvals, exceptions, and customer moments that still wait for the founder. Look for the work that stops, slows, or becomes uncertain when the founder is unavailable.",
          practice: ["Review a normal week and record every decision that could not move without the founder.", "Ask team members where they need clarification most often before continuing work."],
        },
        {
          n: "02",
          name: "Clarify ownership and decision rights",
          body: "For the work that should not rely on the founder, make the accountable role, expected standard, and escalation point clear. Ownership works when people know what they may decide and when they need support.",
          practice: ["Choose one repeated workflow and write down its accountable owner.", "State the few decisions that role can make without seeking approval."],
        },
        {
          n: "03",
          name: "Create useful operating visibility",
          body: "A founder should not need to chase people for basic business status. Simple management rhythms, KPIs, and current workflow information make progress and issues visible early.",
          practice: ["Agree a short weekly view of work in progress, blockers, and decisions needed.", "Keep information in one accessible place rather than in private messages or memory."],
        },
        {
          n: "04",
          name: "Apply AI where it improves the system",
          body: "Automation and AI can improve capacity, speed, or visibility when there is a clear process and an accountable owner. They do not replace the need for role clarity, standards, and management attention.",
          practice: ["Start with a repeated, stable task that creates avoidable manual effort.", "Define the human review point before automating a decision or communication."],
        },
      ],
    },
    payoff: {
      heading: "A business with more than one operating centre",
      body: "The aim is not to remove the founder from the business. It is to make founder involvement more intentional: direction, high-value decisions, and leadership rather than continual operational rescue.",
      pullQuote: "The strongest operating systems make good work easier to see, own, and repeat.",
    },
    whereToStart: {
      heading: "Where to start",
      body: [
        "A self-reported diagnostic can be a useful starting view of business behavior. It can show where founder dependency may be concentrating, but it does not establish root cause.",
        "An Audit is the evidence-led next step when the business needs to verify why the pattern exists and identify the binding constraint to address.",
      ],
    },
    cta: {
      heading: "Start with a practical view of your business.",
      body: "Take the free diagnostic to begin identifying where the business may still be relying too heavily on you.",
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return ARTICLES.filter((article) => article.categorySlug === categorySlug);
}

export function articleFullText(article: Article): string {
  return [
    article.title,
    ...article.intro,
    article.founderTrap.heading,
    article.founderTrap.body,
    article.theFix.heading,
    article.theFix.body,
    ...article.theFix.stages.flatMap((stage) => [stage.name, stage.body, ...(stage.practice ?? []), stage.ask ?? ""]),
    article.payoff.heading,
    article.payoff.body,
    article.payoff.pullQuote,
    ...(article.whereToStart ? [article.whereToStart.heading, ...article.whereToStart.body] : []),
    article.cta.heading,
    article.cta.body,
  ].join(" ");
}

export function getReadingTime(article: Article): number {
  return readingTimeMinutes(articleFullText(article));
}
