/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Expo uses EXPO_PUBLIC_* automatically. This repository currently runs on
  // Next.js, so expose only the two explicitly public Supabase values here.
  env: {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
