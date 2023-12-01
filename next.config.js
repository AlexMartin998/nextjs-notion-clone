/** @type {import('next').NextConfig} */
const nextConfig = {
  // allow external source images
  images: {
    domains: ['jkvwuvvfqyqrcyxfgfef.supabase.co'], // env - NEXT_PUBLIC_SUPABASE_URL
  },
};

module.exports = nextConfig;
