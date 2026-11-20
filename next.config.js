const path = require("path");

const isProd = process.env.NODE_ENV === "production";
const siteIsHttps = (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https://");

const scriptSrc = isProd
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

if (isProd && siteIsHttps) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  // Pages regroupées (nov. 2026) : les anciennes URL renvoient vers la section qui les remplace.
  async redirects() {
    return [
      ["/a-propos/histoire", "/a-propos"],
      ["/a-propos/familles", "/a-propos#familles"],
      ["/a-propos/temoignages", "/a-propos#temoignages"],
      ["/a-propos/projet-educatif", "/a-propos#valeurs"],
      ["/a-propos/projet-educatif/viser-l-excellence", "/a-propos#excellence"],
      ["/a-propos/projet-educatif/s-ouvrir-au-monde", "/a-propos#ouverture"],
      ["/a-propos/projet-educatif/donner-du-sens", "/a-propos#sens"],
      ["/a-propos/vie-a-hautefeuille", "/a-propos/information-generale#vie"],
      ["/nouvelles", "/a-propos/information-generale#actualites"],
      ["/a-propos/documentation", "/a-propos/information-generale#documentation"],
      ["/a-propos/soutenez-nous", "/a-propos/inscriptions#soutenez-nous"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
