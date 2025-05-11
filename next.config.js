/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: "/ddcg/diagnostic",
  // assetPrefix: "/ddcg/diagnostic",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
};

module.exports = nextConfig;
