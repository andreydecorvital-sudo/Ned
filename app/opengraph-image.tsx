import { ImageResponse } from "next/og";

export const alt = "Ned Marketing — sua marca precisa de direção";
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
          background: "#f1eee7",
          fontFamily: "Arial, sans-serif",
          padding: "56px 64px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(#08080a 1px, transparent 1px), linear-gradient(90deg, #08080a 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", zIndex: 2, width: "74%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              color: "#08080a",
            }}
          >
            <strong style={{ fontSize: 64, lineHeight: 0.8, letterSpacing: 1 }}>NED</strong>
            <span style={{ paddingBottom: 6, fontSize: 15, fontWeight: 800, letterSpacing: 5 }}>
              MARKETING
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 62,
              fontSize: 74,
              lineHeight: 0.92,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            <span>Sua marca não precisa</span>
            <span>de mais posts.</span>
            <span style={{ textDecoration: "underline", textDecorationThickness: 2 }}>
              Precisa de direção.
            </span>
          </div>

          <div style={{ display: "flex", marginTop: "auto", fontSize: 19, color: "#55525a" }}>
            Marketing e conteúdo • Conversão e aquisição • Marketplaces
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 64,
            top: 56,
            bottom: 56,
            width: 246,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 26,
            color: "#f1eee7",
            background: "#08080a",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 3 }}>DIREÇÃO</span>
          <span style={{ fontSize: 66, lineHeight: 0.85, fontWeight: 900 }}>ANTES DE FERRAMENTA.</span>
          <span style={{ fontSize: 13, color: "#aaa8af" }}>NED / 2026</span>
        </div>

        <div style={{ position: "absolute", right: 64, bottom: 56, display: "flex", width: 246, height: 8 }}>
          <span style={{ flex: 1, background: "#ff2b32" }} />
          <span style={{ flex: 1, background: "#25ff74" }} />
          <span style={{ flex: 1, background: "#1268ff" }} />
          <span style={{ flex: 1, background: "#ff7a1a" }} />
        </div>
      </div>
    ),
    size,
  );
}
