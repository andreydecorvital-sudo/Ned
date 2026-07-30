import { ImageResponse } from "next/og";

export const alt = "Ned Marketing — Construímos sistemas que vendem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "#08080a",
          background: "#f2f0ea",
          fontFamily: "Arial, sans-serif",
          padding: "62px 70px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(#08080a 1px, transparent 1px), linear-gradient(90deg, #08080a 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", zIndex: 2, width: "72%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 18, letterSpacing: 5, fontWeight: 800 }}>
            <span style={{ width: 42, height: 2, background: "#7040ff" }} />
            NED MARKETING
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 74, fontSize: 78, lineHeight: 0.94, fontWeight: 900, textTransform: "uppercase" }}>
            <span>Não fazemos marketing</span>
            <span style={{ color: "#7040ff" }}>barulhento.</span>
            <span>Construímos sistemas que vendem.</span>
          </div>

          <div style={{ display: "flex", marginTop: "auto", fontSize: 21, color: "#4c4c54" }}>
            Sites • Automações • Tráfego • Marketplaces
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: -44,
            top: 108,
            width: 390,
            height: 390,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #08080a",
            borderRadius: "50%",
          }}
        >
          <div
            style={{
              width: 235,
              height: 235,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #08080a",
              borderRadius: "50%",
            }}
          >
            <div style={{ width: 98, height: 98, background: "#7040ff", borderRadius: "50%" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
