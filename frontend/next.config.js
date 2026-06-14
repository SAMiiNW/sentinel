/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/sentinel',
  trailingSlash: true,
};

module.exports = nextConfig;
