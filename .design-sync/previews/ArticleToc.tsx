import { ArticleToc } from "ajmal-diagnostic";

// .article-toc is a desktop (lg+) composition — below that breakpoint it is
// hidden, so this card declares a wide viewport in cfg.overrides.

const items = [
  { id: "why-dependency-forms", label: "Why founder dependency forms" },
  { id: "the-three-signals", label: "The three signals" },
  { id: "decision-speed", label: "Decision speed" },
  { id: "execution-consistency", label: "Execution consistency" },
  { id: "operational-visibility", label: "Operational visibility" },
  { id: "what-to-do-first", label: "What to do first" },
];

/** The sticky article table of contents. The first item is active until a heading scrolls in. */
export function Default() {
  return <ArticleToc items={items} />;
}
