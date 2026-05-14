import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "CareerLink job portal preview";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const bannerImage = await readFile(
    join(process.cwd(), "public/home-assets/banner-hero.png"),
  );
  const bannerSrc = `data:image/png;base64,${bannerImage.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #f1f2f4 0%, #e7f0fa 100%)",
          color: "#18191c",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            width: "620px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: "14px",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            <LogoMark />
            CareerLink
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                fontWeight: 700,
                letterSpacing: "-3px",
                lineHeight: 1.05,
              }}
            >
              Find a job that suits your skills.
            </div>
            <div
              style={{
                color: "#5e6670",
                fontSize: "28px",
                lineHeight: 1.35,
              }}
            >
              Discover open roles, top companies, and career opportunities in
              one place.
            </div>
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "white",
            borderRadius: "42px",
            boxShadow: "0 28px 80px rgba(0, 44, 109, 0.16)",
            display: "flex",
            height: "390px",
            justifyContent: "center",
            overflow: "hidden",
            width: "390px",
          }}
        >
          <img
            alt=""
            height={304}
            src={bannerSrc}
            style={{ objectFit: "contain" }}
            width={392}
          />
        </div>
      </div>
    ),
    size,
  );
}

const LogoMark = () => (
  <div
    style={{
      alignItems: "center",
      background: "#0a65cc",
      borderRadius: "12px",
      color: "white",
      display: "flex",
      height: "52px",
      justifyContent: "center",
      width: "52px",
    }}
  >
    <svg fill="none" height="32" viewBox="0 0 24 24" width="32">
      <path
        d="M8.5 7V5.75C8.5 4.78 9.28 4 10.25 4h3.5c.97 0 1.75.78 1.75 1.75V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M4.75 7h14.5c.97 0 1.75.78 1.75 1.75v8.5c0 .97-.78 1.75-1.75 1.75H4.75C3.78 19 3 18.22 3 17.25v-8.5C3 7.78 3.78 7 4.75 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3 11.25h18M10 11.25v1.25h4v-1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  </div>
);
