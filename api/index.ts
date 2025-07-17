// api/index.ts (your main Hono app file)
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { getContentfulClient } from './service'; // Import the function

// This is crucial for telling Vercel to deploy this as an Edge Function
// export const config = {
//   runtime: 'edge',
// };
//
const app = new Hono();

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'https://greentube-frontend.vercel.app/'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET'],
    maxAge: 600,
    credentials: true,
  }),
);

app.get('/', (c) => {
  return c.text('Hono.js Backend for Greentube Homepage');
});

app.get('/news', async (c) => {
  try {
    // !!! IMPORTANT: Call getContentfulClient(c) here, inside the route handler !!!
    const contentfulClient = getContentfulClient(c);

    const entries = await contentfulClient.getEntries({
      content_type: 'newsArticle',
      limit: 5,
      include: 10,
    });

    const newsArticles = entries.items.map((item: any) => ({
      id: item.sys.id,
      title: item.fields.title,
      excerpt: item.fields.excerpt,
      publishDate: item.fields.publishDate,
      slug: item.fields.slug,
      featuredImageUrl: item.fields.featuredImage
        ? `https:${item.fields.featuredImage.fields.file.url}`
        : null,
      featuredImageAlt: item.fields.featuredImage
        ? item.fields.featuredImage.fields.description ||
        item.fields.featuredImage.fields.title
        : null,
    }));

    return c.json(newsArticles);
  } catch (error: any) {
    console.error('Error fetching news from Contentful:', error.message);
    return c.json(
      { error: 'Failed to fetch news', details: error.message },
      500,
    );
  }
});

app.get('/product-showcase', async (c) => {
  try {
    // !!! IMPORTANT: Call getContentfulClient(c) here, inside the route handler !!!
    const contentfulClient = getContentfulClient(c);

    const entries = await contentfulClient.getEntries({
      content_type: 'productShowcaseItem',
      include: 10,
    });

    const showcaseItems = entries.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.name,
      showcaseImageUrl: item.fields.showcaseImage
        ? `https:${item.fields.showcaseImage.fields.file.url}`
        : null,
      showcaseImageAlt: item.fields.showcaseImage
        ? item.fields.showcaseImage.fields.description ||
        item.fields.showcaseImage.fields.title
        : null,
      hoverImageUrl: item.fields.hoverImage
        ? `https:${item.fields.hoverImage.fields.file.url}`
        : null,
      hoverImageAlt: item.fields.hoverImage
        ? item.fields.hoverImage.fields.description ||
        item.fields.hoverImage.fields.title
        : null,
      link: item.fields.link || null,
    }));

    return c.json(showcaseItems);
  } catch (error: any) {
    console.error(
      'Error fetching product showcase items from Contentful:',
      error.message,
    );
    return c.json(
      {
        error: 'Failed to fetch product showcase items',
        details: error.message,
      },
      500,
    );
  }
});

app.get('/partners', async (c) => {
  try {
    // !!! IMPORTANT: Call getContentfulClient(c) here, inside the route handler !!!
    const contentfulClient = getContentfulClient(c);

    const entries = await contentfulClient.getEntries({
      content_type: 'partner',
      include: 10,
    });

    const partners = entries.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.name,
      logo: item.fields.logo
        ? `https:${item.fields.logo.fields.file.url}`
        : null,
      websiteUrl: item.fields.websiteUrl || null,
    }));

    return c.json(partners);
  } catch (error: any) {
    console.error('Error fetching partners from Contentful:', error.message);
    return c.json(
      { error: 'Failed to fetch partners', details: error.message },
      500,
    );
  }
});

export default handle(app);
