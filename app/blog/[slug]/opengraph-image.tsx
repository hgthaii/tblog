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

	const truncate = (text?: string, limit: number = 140) => {
		if (!text) return '';
		return text.length > limit ? text.slice(0, limit) + '...' : text;
	};

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
            backgroundColor: '#1b1b1a',
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
                gap: '12px',
                fontSize: 22,
                color: '#71717a',
              }}
            >
              <span>{content.home.location}</span>
            </div>
          </div>

          {/* Middle Content - Centered Vertically */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
              flexGrow: 1, // Để khu vực này chiếm hết không gian trống giữa Top và Bottom Bar
              margin: '32px 0',
            }}
          >
            {post?.quote ? (
              <div
                style={{
									display: 'flex',
                  fontSize: 48, // Nâng size cực lớn để làm điểm nhấn
                  fontWeight: 600, // Đậm hơn 1 chút
                  color: '#ffffff', // Đổi sang trắng sáng
                  maxWidth: '1000px',
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                  fontStyle: 'italic', // Giữ phong cách quote
                }}
              >
                {`“${truncate(post?.quote)}”`}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  fontSize: 40,
                  color: '#e4e4e7',
                  maxWidth: '1000px',
                  lineHeight: 1.4,
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
              paddingTop: '24px',
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
              {SITE_CONFIG.site.url.replace(/^https?:\/\//, '') /* Bỏ http:// nếu có để domain trông gọn hơn */}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}