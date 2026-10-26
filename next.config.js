const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  // `npm run lighthouse` builds into its own folder so it can run next to `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    // List each remote image a post uses, not whole hosts: anyone can make /_next/image
    // optimize any URL that matches here, and every new one is a billed transformation.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com',
        port: '',
        pathname: '/max/2000/1*KmHMETupo3tKwV6rxLlJ9g.png',
      },
    ],
  },
});
