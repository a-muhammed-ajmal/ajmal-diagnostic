import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#132A4A",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 24,
          height: 24,
          borderTop: "4px solid #C6752E",
          borderRight: "4px solid #C6752E",
        }}
      />
      <div
        style={{
          fontSize: 80,
          fontWeight: 900,
          fontFamily: "sans-serif",
          display: "flex",
          letterSpacing: "-4px",
        }}
      >
        <span style={{ color: "#FFFFFF" }}>M</span>
        <span style={{ color: "#C6752E" }}>A</span>
      </div>
    </div>,
    { ...size },
  );
}
