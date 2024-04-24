import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    experimental: {
        mdxRs: true,
    },
    swcMinify: true,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pbs.twimg.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "abs.twimg.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images-na.ssl-images-amazon.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    headers() {
        return [
            {
                source: "/images/rauchg-3d4cecf.jpg",
                headers: [
                    {
                        key: "cache-control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
    redirects() {
        return [
            {
                source: "/essays/:nested*",
                destination: "/",
                permanent: true,
            },
            {
                source: "/slackin/:nested*",
                destination: "https://github.com/rauchg/slackin",
                permanent: true,
            },
        ];
    },
};

const withMDX = createMDX({});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
