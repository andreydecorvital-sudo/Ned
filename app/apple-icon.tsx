import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#7040ff",
          background: "#08080a",
          fontFamily: "Arial, sans-serif",
          fontSize: 118,
          fontWeight: 900,
        }}
      >
        N
      </div>
    ),
    size,
  );
}
