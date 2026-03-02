/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_TIME: String(Date.now())
  },
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
