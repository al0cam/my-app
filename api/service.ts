import { createClient } from 'contentful';
import { env } from 'hono/adapter'; // Import 'env' from 'hono/adapter'

export const runtime = 'edge';

// We'll create a function to get the client, passing 'c' (Hono context) to it
// This allows us to access environment variables via Hono's adapter
export const getContentfulClient = (c: any) => { // 'c' is the Hono context object
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = env<{
    CONTENTFUL_SPACE_ID: string;
    CONTENTFUL_ACCESS_TOKEN: string;
  }>(c);

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    // In an Edge Function, logging to console.error might not be immediately visible
    // Consider throwing an error or returning a specific response if critical
    console.error('Missing Contentful environment variables in Vercel environment!');
  }

  const contentfulClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  console.log('Contentful client initialized for Edge Function.');
  return contentfulClient;
};

export let contentfulClient = getContentfulClient({}); // Initialize the client with an empty context
