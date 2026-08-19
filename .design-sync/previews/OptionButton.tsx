import type { CSSProperties } from "react";
import { OptionButton } from "ajmal-diagnostic";

const stack: CSSProperties = { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "640px" };
const noop = () => {};

/** Resting and selected. The filled dot is the non-colour signal for selection. */
export function States() {
  return (
    <div style={stack}>
      <OptionButton
        optionId="a"
        text="I have a documented strategy with specific milestones and quarterly targets."
        selected={false}
        onSelect={noop}
      />
      <OptionButton
        optionId="b"
        text="I have a clear general direction, but it's not formally documented."
        selected
        onSelect={noop}
      />
      <OptionButton
        optionId="c"
        text="We adapt as we go — the market changes too fast for fixed plans."
        selected={false}
        onSelect={noop}
      />
    </div>
  );
}
