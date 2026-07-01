/**
 * @format
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Next.js-er built-in React Compiler option code optimization-er jonno
  reactCompiler: true,

  // External icons package bundle config support
  transpilePackages: ["@gravity-ui/icons"],

  // Safe external domains theke images load korar patterns configuration
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "nai-sell-server.vercel.app" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "*.googleapis.com" },
      { protocol: "https", hostname: "i.ibb.co" }, // Imgbub image hosting path
    ],
  },
};

export default nextConfig;
