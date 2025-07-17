import { createClient } from 'contentful';
import { env } from 'hono/adapter'; // Import 'env' from 'hono/adapter'

export const runtime = 'edge';

export const getContentfulClient = (c: any) => { // 'c' is the Hono context object
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = env<{
    CONTENTFUL_SPACE_ID: string;
    CONTENTFUL_ACCESS_TOKEN: string;
  }>(c);

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.error('Missing Contentful environment variables in Vercel environment!');
  }

  const contentfulClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  console.log('Contentful client initialized for Edge Function.');
  return contentfulClient;
};
