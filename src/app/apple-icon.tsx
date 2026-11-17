import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#f5f0e4",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 64 64" width="160" height="160">
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            fill="none"
            stroke="#282dd6"
            strokeWidth="3"
          />
          <path
            d="M22 45V23m0 8c0-10 16-10 16 0s-16 10-16 0"
            fill="none"
            stroke="#282dd6"
            strokeWidth="4"
          />
          <path d="M36 43h12" stroke="#282dd6" strokeWidth="4" />
          <rect x="44" y="46" width="6" height="5" fill="#dcfa83" />
        </svg>
      </div>
    ),
    size,
  );
}
