import { readingTimeMinutes } from "./readingTime";

/**
 * Content registry for the Insights section.
 *
 * Single source of truth for article copy, metadata, categories, sitemap entries and
 * read time. The article page, the insights index, the category pages, the sitemap and
 * the article JSON-LD all read from here, so adding a future article in one place makes
 * it appear everywhere automatically.
 */

export interface ArticleSource {
  label: string;
  url: string;
}

export interface ArticleStat {
  /** Headline figure, e.g. "97%". */
  value: string;
  /** The full statement the figure supports. */
  statement: string;
  /** One or more reachable sources that evidence the figure. Never empty. */
  sources: ArticleSource[];
}

export interface ArticleStage {
  n: string;
  name: string;
  body: string;
  /** "What this looks like in practice" — concrete UAE-SME actions. Added in Block 4. */
  practice?: string[];
  /** "Ask yourself" — one diagnostic question. Added in Block 4. */
  ask?: string;
}

export interface ArticleAuthor {
  name: string;
  role: string;
  /** Honest bio drawn only from the /about page. Added in Block 4. */
  bioParagraphs: string[];
}

export interface Article {
  slug: string;
  /** On-page H1. */
  title: string;
  /** <title> / og:title. May differ slightly from the H1. */
  metaTitle: string;
  description: string;
  category: string;
  categorySlug: string;
  /** ISO date. */
  publishedAt: string;
  /** ISO date. */
  updatedAt: string;
  /** One-line card summary for the insights grid. */
  excerpt: string;
  author: ArticleAuthor;
  intro: string[];
  founderTrap: { heading: string; body: string; stat: ArticleStat };
  theFix: {
    heading: string;
    /** Lead-in figure for the section, rendered as a pull-quote callout. */
    stat: ArticleStat;
    body: string;
    stages: ArticleStage[];
  };
  payoff: { heading: string; body: string; pullQuote: string };
  /** "Where to start" closing section. Added in Block 4. */
  whereToStart?: { heading: string; body: string[] };
  cta: { heading: string; body: string };
}

export const CATEGORIES: { name: string; slug: string; desc: string }[] = [
  {
    name: "SME Growth Architecture",
    slug: "sme-growth-architecture",
    desc: "Scaling frameworks, strategic planning, and growth infrastructure for founder-led businesses.",
  },
  {
    name: "Operational Excellence",
    slug: "operational-excellence",
    desc: "SOPs, process design, quality systems, and the operational backbone of scalable businesses.",
  },
  {
    name: "AI-Enabled Systems",
    slug: "ai-enabled-systems",
    desc: "Practical automation, CRM optimization, and AI integration for SME operations.",
  },
  {
    name: "Founder Leadership",
    slug: "founder-leadership",
    desc: "The mindset shifts, delegation frameworks, and accountability systems that let founders step back.",
  },
];

export const ARTICLES: Article[] = [
  {
    slug: "the-5-stage-business-operating-system",
    title: "The 5-Stage Business Operating System for UAE SMEs",
    metaTitle: "The 5-Stage Business Operating System for UAE SMEs",
    description:
      "How founder-led UAE and GCC SMEs move from owner-dependent to system-driven — a five-stage operating system: Diagnose, Design, Build, Optimize, Scale.",
    category: "SME Growth Architecture",
    categorySlug: "sme-growth-architecture",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-23",
    excerpt:
      "Move from owner-dependent to system-driven with five stages: Diagnose, Design, Build, Optimize, Scale.",
    author: {
      name: "Muhammed Ajmal",
      role: "Strategic Growth Architect",
      bioParagraphs: [],
    },
    intro: [
      "Most founder-led businesses in the UAE do not have a growth problem. They have a dependency problem. The business runs on the founder — not on a system — and that single fact quietly caps how large it can become.",
      "The pattern is consistent enough to be predictable. Businesses that break through their ceiling are not the ones with better founders — they are the ones that stopped needing a better founder. They installed a system: five stages that move a company from owner-driven to system-driven to team-enabled.",
    ],
    founderTrap: {
      heading: "The founder trap",
      body: "When every decision, every fix, and every key client runs through you, growth slows to the speed of your personal bandwidth. It is not a lack of effort — working harder is exactly what keeps the trap closed.",
      stat: {
        value: "97%",
        statement:
          "97% of small-business owners work weekends — and 40% do so always or often.",
        sources: [
          {
            label: "The Alternative Board",
            url: "https://www.thealternativeboard.com/blog/new-survey-shows-work-life-balance-is-possible-but-not-likely-for-entrepreneurs",
          },
        ],
      },
    },
    theFix: {
      heading: "The fix: a business operating system",
      stat: {
        value: "63.5%",
        statement: "SMEs power 63.5% of the UAE non-oil economy (2022 figure).",
        sources: [
          {
            label: "UAE Ministry of Economy, via Gulf Today",
            url: "https://www.gulftoday.ae/Business/2024/05/19/SMEs-contribute-635-to-UAE-non-oil-GDP",
          },
          {
            label: "UAE Government SME portal",
            url: "https://u.ae/en/information-and-services/business/small-and-medium-enterprises",
          },
        ],
      },
      body: "The difference between the businesses that scale and the ones that stall is rarely talent or market — it is whether the company is engineered to run without its founder in every room. That engineering happens in five stages.",
      stages: [
        {
          n: "01",
          name: "Diagnose",
          body: "Find the real constraint before you fix anything. Map where decisions bottleneck, where cash leaks, and where work gets redone. Most founders treat symptoms; the operating system starts with an honest diagnosis.",
        },
        {
          n: "02",
          name: "Design",
          body: "Design the structure before you build it: role scorecards, decision rights, KPIs, and an SOP map. Clarity on paper precedes systems in practice.",
        },
        {
          n: "03",
          name: "Build",
          body: "Install the rails — one CRM, one source of truth, documented golden-path SOPs, and automated lead capture, follow-ups, and reporting.",
        },
        {
          n: "04",
          name: "Optimize",
          body: "Tighten the engine. A weekly KPI rhythm and an issue-solving cadence so quality stops depending on your personal standards.",
        },
        {
          n: "05",
          name: "Scale",
          body: "With the system running, you scale capacity instead of chaos. Develop leaders, expand, and step back — the business holds without you in every room.",
        },
      ],
    },
    payoff: {
      heading: "The payoff is enterprise value",
      body: "The reward is not only your weekends back. A business that does not depend on one person is worth more — often meaningfully more.",
      pullQuote:
        "Buyers pay for a business that keeps running, not for a job that stops when you do. A company that depends on its owner is priced as a job; one that runs on systems is priced as an asset.",
    },
    cta: {
      heading: "Which stage is your bottleneck?",
      body: "The free 4-minute diagnostic identifies your primary growth constraint and sends a personalised action plan to your inbox.",
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return ARTICLES.filter((a) => a.categorySlug === categorySlug);
}

/** All prose in the article, concatenated — the basis for an accurate read time. */
export function articleFullText(article: Article): string {
  const parts: string[] = [...article.intro];
  parts.push(article.founderTrap.heading, article.founderTrap.body, article.founderTrap.stat.statement);
  parts.push(article.theFix.heading, article.theFix.stat.statement, article.theFix.body);
  for (const stage of article.theFix.stages) {
    parts.push(stage.name, stage.body);
    if (stage.practice) parts.push(...stage.practice);
    if (stage.ask) parts.push(stage.ask);
  }
  parts.push(article.payoff.heading, article.payoff.body, article.payoff.pullQuote);
  if (article.whereToStart) {
    parts.push(article.whereToStart.heading, ...article.whereToStart.body);
  }
  return parts.join(" ");
}

export function getReadingTime(article: Article): number {
  return readingTimeMinutes(articleFullText(article));
}
