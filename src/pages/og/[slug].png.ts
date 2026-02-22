import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts
    .filter(post => !post.data.draft)
    .map(post => ({ params: { slug: post.slug }, props: post }));
}

export const GET: APIRoute = async ({ props }) => {
  const post = props as Awaited<ReturnType<typeof getCollection<'blog'>>>[number];

  const fontPaths = [
    resolve('./node_modules/@fontsource/public-sans/files/public-sans-latin-700-normal.woff'),
    'C:/Windows/Fonts/arialbd.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  ];
  let fontData: Buffer = Buffer.alloc(0);
  for (const fp of fontPaths) {
    try { fontData = readFileSync(fp); break; } catch { /* try next */ }
  }

  const title = post.data.title;
  const description = post.data.description ?? '';
  const date = post.data.publishDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          fontFamily: 'sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '24px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#7dd3fc',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '3px',
                    },
                    children: 'Djamel Bougouffa · Blog',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 50 ? '44px' : '56px',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      lineHeight: 1.2,
                      maxWidth: '900px',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      color: '#94a3b8',
                      lineHeight: 1.5,
                      maxWidth: '850px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                    },
                    children: description.length > 120 ? description.slice(0, 120) + '…' : description,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '18px', color: '#64748b' },
                    children: date,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#7dd3fc',
                      background: 'rgba(125, 211, 252, 0.1)',
                      border: '1px solid rgba(125, 211, 252, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 20px',
                    },
                    children: 'djamel-bougouffa.com',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: fontData.length > 0
        ? [{ name: 'sans-serif', data: fontData, weight: 700, style: 'normal' }]
        : [],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
