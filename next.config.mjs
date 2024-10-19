/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['edamam-product-images.s3.amazonaws.com'], // Add your domain here
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default nextConfig;
