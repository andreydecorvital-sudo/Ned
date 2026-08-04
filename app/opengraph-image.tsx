import { ImageResponse } from "next/og";

export const alt = "Ned Marketing — sua marca precisa de direção";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ned-git-main-vitaldecor.vercel.app";

export default function OpenGraphImage() {
  const logoUrl = new URL("/brand/ned-logo-dark.svg", siteUrl).toString();
  const symbolUrl = new URL("/brand/ned-symbol-spiral.svg", siteUrl).toString();

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

        <div style={{ display: "flex", flexDirection: "column", zIndex: 2, width: "72%" }}>
          <img src={logoUrl} width="310" height="105" alt="NED Marketing" style={{ objectFit: "contain" }} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 54,
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
            width: 270,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#08080a",
            border: "1px solid rgba(8,8,10,.18)",
          }}
        >
          <img src={symbolUrl} width="118" height="118" alt="" style={{ objectFit: "contain" }} />
        </div>

        <div style={{ position: "absolute", right: 64, bottom: 56, display: "flex", width: 270, height: 8 }}>
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
