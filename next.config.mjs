/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_TIME: String(Date.now())
  },
  images: {
    formats: ["image/avif", "image/webp"]
  },
  // Limit build workers to avoid thread exhaustion on constrained hosts (Infomaniak)
  experimental: {
    cpus: 1,
    workerThreads: false
  }
};

export default nextConfig;
