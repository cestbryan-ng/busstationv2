/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    images: {
        remotePatterns: [
            'bougna.net',
            'st.depositphotos.com',
            'c.wallhere.com',
            'media.istockphoto.com',
            'images.unsplash.com',
            's3.amazonaws.com',

        ].map(hostname => ({
            protocol: 'https' as const,
            hostname,
            pathname: '/**',
        })),
    },
    eslint:{
        ignoreDuringBuilds:true
    },
    async rewrites() {
        return [
            {
                source: `${process.env.NEXT_PUBLIC_PROXY_URL_TRIP_AGENCY}/:path*`,
                destination: `${process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;