import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#0B2545",
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
          borderTop: "2px solid #C8A24A",
          borderRight: "2px solid #C8A24A",
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
        <span style={{ color: "#C8A24A" }}>A</span>
      </div>
    </div>,
    { ...size },
  );
}
