// services/contentfulClient.ts
import { createClient } from 'contentful';
import { env } from 'hono/adapter'; // Import 'env' from 'hono/adapter'

// IMPORTANT: Removed 'export const runtime = 'edge';' from here.
// This declaration should only be in your main Hono entry file (e.g., api/index.ts)
// as this file is a utility and not a standalone Vercel Edge Function.

/**
 * Returns an Edge-compatible Contentful client instance.
 * This function must be called within a Hono route handler,
 * passing the Hono context 'c' to it.
 *
 * @param c The Hono context object, used to access environment variables.
 * @returns A Contentful client instance.
 * @throws Error if Contentful environment variables are not set.
 */
export const getContentfulClient = (c: any) => {
  // Access environment variables using Hono's adapter from the provided context 'c'
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = env<{
    CONTENTFUL_SPACE_ID: string;
    CONTENTFUL_ACCESS_TOKEN: string;
  }>(c);

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    // Log an error and throw to prevent the function from proceeding without credentials.
    // This error will be caught by your route's try/catch block.
    console.error('Missing Contentful environment variables in Vercel environment!');
    throw new Error('Contentful environment variables (CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN) are not configured. Please set them in your Vercel Project Settings.');
  }

  // Initialize the Contentful client.
  // The Contentful SDK (especially newer versions) is designed to be isomorphic,
  // meaning it should automatically use the global `fetch` API available in Edge Runtimes.
  const contentfulClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  console.log('Contentful client initialized for Edge Function.');
  return contentfulClient;
};

// IMPORTANT: Removed 'export let contentfulClient = getContentfulClient({});'
// You cannot initialize the client globally with an empty context.
// The client MUST be created per request within your Hono route handlers,
// where the 'c' (context) object is available and populated with environment variables.
