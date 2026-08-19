import { ImageResponse } from "next/og";

// Literal hex is unavoidable here: ImageResponse is rendered by Satori, which cannot
// read the CSS custom properties in globals.css. These match the design tokens
// (--color-brand #0052FF, --color-accent #FFBF00).

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#0052FF",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          right: 2,
          width: 7,
          height: 7,
          borderTop: "2px solid #FFBF00",
          borderRight: "2px solid #FFBF00",
        }}
      />
      <div
        style={{
          fontSize: 15,
          fontWeight: 900,
          fontFamily: "sans-serif",
          display: "flex",
          letterSpacing: "-0.5px",
        }}
      >
        <span style={{ color: "#FFFFFF" }}>M</span>
        <span style={{ color: "#FFBF00" }}>A</span>
      </div>
    </div>,
    { ...size },
  );
}
