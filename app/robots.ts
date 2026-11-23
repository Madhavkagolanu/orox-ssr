import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/order-confirmation', '/order-placed', '/login'],
    },
    sitemap: 'https://orox.in/sitemap.xml',
  };
}
