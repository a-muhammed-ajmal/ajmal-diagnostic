import { ImageResponse } from "next/og";

// Literal hex is unavoidable here: ImageResponse is rendered by Satori, which cannot
// read the CSS custom properties in globals.css. These match the design tokens
// (--color-brand #2563EB, --color-accent #F59E0B).

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#2563EB",
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
          borderTop: "8px solid #F59E0B",
          borderRight: "8px solid #F59E0B",
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
        <span style={{ color: "#F59E0B" }}>A</span>
      </div>
    </div>,
    { ...size },
  );
}
