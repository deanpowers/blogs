/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'zojaxblogs.wpenginepowered.com',
            },
        ],
    },
};

export default nextConfig;
