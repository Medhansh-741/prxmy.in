import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { socialImage } from "@/lib/metadata";

export const alt = socialImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const font = readFile(
  join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf"),
);
const cpu = readFile(join(process.cwd(), "public/hardware/cpu.png"));

export default async function OpenGraphImage() {
  const [sans, chip] = await Promise.all([font, cpu]);
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#faf3e5",
          color: "#1738c6",
          fontFamily: "Geist",
          padding: "55px 60px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 650,
            paddingTop: 55,
          }}
        >
          <span style={{ fontSize: 100, lineHeight: 1.02, letterSpacing: -6 }}>
            Prakhar
          </span>
          <span style={{ fontSize: 100, lineHeight: 1.02, letterSpacing: -6 }}>
            Gupta
          </span>
          <span style={{ fontSize: 29, marginTop: 28, letterSpacing: -1 }}>
            Backend & full-stack developer
          </span>
          <span style={{ fontSize: 20, marginTop: 21, color: "#5d6473" }}>
            Web applications, developer tools, and civic platforms.
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: 105,
            right: 68,
            width: 340,
            height: 380,
            background: "#1c368e",
            border: "3px solid #102363",
            borderRadius: 12,
          }}
        >
          <img
            src={`data:image/png;base64,${chip.toString("base64")}`}
            width={248}
            height={246}
            alt=""
          />
          <span
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              inset: 0,
              fontSize: 56,
              letterSpacing: -3,
            }}
          >
            PG
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 37,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 19,
            borderTop: "1px solid #d8d6cf",
            fontSize: 19,
          }}
        >
          <span>prxmy.in</span>
          <span style={{ color: "#5d6473", fontSize: 16 }}>Jaipur, India</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: sans, style: "normal", weight: 400 }],
    },
  );
}
