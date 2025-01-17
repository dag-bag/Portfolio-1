import { sanityClient } from '@/lib/sanity/sanity-server';
import { postSlugsQuery } from '@/lib/sanity/queries';

import type { GetServerSideProps } from 'next';

const createSitemap = (
  slugs: string[],
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${slugs
          .map((slug) => {
            return `
                <url>
                    <loc>${`https://alexanderkonietzko.vercel.app/${slug}`}</loc>
                </url>
            `;
          })
          .join('')}
    </urlset>
`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const allPosts = await sanityClient.fetch(postSlugsQuery);
  const allPages = [
    ...allPosts.map(
      ({ slug, language }: { slug: string; language: string }) =>
        `${language !== 'en' ? language + '/' : ''}blog/${slug}`,
    ),
    ...['', 'blog', 'dashboard', 'guestbook', 'projects', 'about'],
    ...[
      'de',
      'de/blog',
      'de/dashboard',
      'de/guestbook',
      'de/projects',
      'de/about',
    ],
  ];

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1200, stale-while-revalidate=600',
  );
  res.write(createSitemap(allPages));
  res.end();

  return {
    props: {},
  };
};

export default function Sitemap() {
  return null;
}
