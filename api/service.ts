import { createClient } from 'contentful';
import 'dotenv/config';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  console.error('Missing Contentful environment variables!');
  console.error('Please ensure CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN are set in your .env file or environment.');
}

export const contentfulClient = createClient({
  space: spaceId || '',
  accessToken: accessToken || '',
});

console.log('Contentful client initialized.');
