/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Keep dashboards, auth flows and the API out of search results.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/admin/:path*", headers: noindex },
      { source: "/employer/:path*", headers: noindex },
      { source: "/jobseeker/:path*", headers: noindex },
      { source: "/advertiser/:path*", headers: noindex },
      { source: "/api/:path*", headers: noindex },
    ];
  },
};

module.exports = nextConfig;
