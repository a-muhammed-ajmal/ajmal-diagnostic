import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#5B21B6",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="6" fill="white" />
        <path d="M20 19 14 12a12 12 0 0 0-5 10M28 19 34 12a12 12 0 0 1 5 10M18 28 10 34a12 12 0 0 0 14 5M30 28 38 34a12 12 0 0 1-14 5" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="9" cy="24" r="2.5" fill="white" />
        <circle cx="39" cy="24" r="2.5" fill="white" />
        <circle cx="24" cy="39" r="2.5" fill="white" />
      </svg>
    </div>,
    { ...size },
  );
}
