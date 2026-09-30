const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Le dépôt est dans un dossier parent qui a son propre lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
