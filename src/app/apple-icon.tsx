import { ImageResponse } from "next/og";

// Literal hex is unavoidable here: ImageResponse is rendered by Satori, which cannot
// read the CSS custom properties in globals.css. These match the design tokens
// (--color-brand #0052FF, --color-accent #FFBF00).

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          top: 14,
          right: 14,
          width: 34,
          height: 34,
          borderTop: "8px solid #FFBF00",
          borderRight: "8px solid #FFBF00",
        }}
      />
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          fontFamily: "sans-serif",
          display: "flex",
          letterSpacing: "-3px",
        }}
      >
        <span style={{ color: "#FFFFFF" }}>M</span>
        <span style={{ color: "#FFBF00" }}>A</span>
      </div>
    </div>,
    { ...size },
  );
}
