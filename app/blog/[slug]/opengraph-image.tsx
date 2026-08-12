import { ImageResponse } from 'next/og';
import { getPostBySlug, getPostSlugs } from '../../lib/posts';
import { content, SITE_CONFIG } from '../../lib/config';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#121212',
          color: '#f4f4f5',
          padding: '56px',
          fontFamily: 'monospace, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.035) 0%, rgba(18,18,18,0) 70%)',
          }}
        />

        {/* Card Container matching site's clean border style */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '44px 48px',
            backgroundColor: 'rgba(255, 255, 255, 0.015)',
          }}
        >
          {/* Top Bar: Author & Site Identity */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: 22,
                color: '#71717a',
              }}
            >
              <span style={{ color: '#f4f4f5', fontWeight: 600 }}>{SITE_CONFIG.profile.name}</span>
              <span>{content.home.location}</span>
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 18,
                color: '#a1a1aa',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              {post?.categories}
            </div>
          </div>

          {/* Middle Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              margin: '16px 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 54,
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#ffffff',
                maxWidth: '1000px',
                letterSpacing: '-0.02em',
              }}
            >
              {post?.title}
            </div>

            {post?.quote ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  color: '#a1a1aa',
                  maxWidth: '920px',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                “{post?.quote}”
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  fontSize: 22,
                  color: '#71717a',
                  maxWidth: '920px',
                  lineHeight: 1.5,
                }}
              >
                {post?.excerpt}
              </div>
            )}
          </div>

          {/* Bottom Bar: Meta & Domain */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '20px',
              fontSize: 20,
              color: '#52525b',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <span>{post?.createdAt}</span>
              <span>·</span>
              <span>{content.site.description}</span>
            </div>

            <div style={{ display: 'flex', color: '#71717a', fontWeight: 500 }}>
              {SITE_CONFIG.site.url}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}