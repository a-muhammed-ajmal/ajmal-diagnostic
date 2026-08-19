import type { CSSProperties } from "react";
import { ProgressBar } from "ajmal-diagnostic";

const stack: CSSProperties = { display: "flex", flexDirection: "column", gap: "32px", maxWidth: "560px" };

/** The bar through a 12-question run. The count and percentage are derived, not passed. */
export function Progress() {
  return (
    <div style={stack}>
      <ProgressBar current={1} total={12} />
      <ProgressBar current={6} total={12} />
      <ProgressBar current={11} total={12} />
      <ProgressBar current={12} total={12} />
    </div>
  );
}
