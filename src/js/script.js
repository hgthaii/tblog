// js/script.js
import { JSON_PATH, MARKDOWN_PATH, API_BASE } from '../consts/consts.js';
import { marked } from '../lib/marked.esm.js';

export async function getPosts() {
  try {
    const resp = await fetch(`${API_BASE}/posts`);
    if (resp.ok) return await resp.json();
    else return [];
  } catch (err) {
    return [];
  }
}

// 2. Hàm lấy nội dung markdown
export async function getPostContent(slug) {
  try {
    // Đường dẫn tính từ index.html
    // Try API first
    const resp = await fetch(`${API_BASE}/posts/${slug}`);
    if (resp.ok) {
      const data = await resp.json();
      return data || null;
    }
    // Fallback to raw markdown file
    const response = await fetch(`${MARKDOWN_PATH}/${slug}.md`);
    if (!response.ok) throw new Error('Bài viết không tồn tại');
    return await response.text();
  } catch (err) {
    console.error('Lỗi tải nội dung:', err);
    return null;
  }
}

/* Deprecated: không dùng cho layout hiện tại */
export function renderPostList(posts, elementId) {
  const listEl = document.getElementById(elementId);
  listEl.innerHTML = '';

  posts.forEach(post => {
    const li = document.createElement('li');
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString() : post.date || '';
    li.innerHTML = `<a href="#${post.slug}">${post.title}</a> <small style="color:var(--muted);font-size:12px"> ${date}</small>`;
    listEl.appendChild(li);
  });
}

function stripMarkdown(md = '') {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '') // image
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // link
    .replace(/[`*_>#-]/g, '') // markdown symbols
    .replace(/\n+/g, ' ') // new lines
    .trim();
}

export function renderPostCards(posts, elementId) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';
  container.className = 'flex flex-col';

  if (!posts || posts.length === 0) {
    container.innerHTML = `
          <div class="my-24 text-sm text-second text-center">
            Chưa có bài viết.
          </div>
        `;
    return;
  }

  posts.forEach((post, index) => {
    const card = document.createElement('article');
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString() : post.date || '';
    const excerpt = stripMarkdown(post.excerpt || '');

    const isLast = index === posts.length - 1;

    card.className = `
            group
            py-4
            px-6
            cursor-pointer
            w-full
            transition-colors duration-200 ease-out
            hover:bg-white/5
            rounded-md
            ${!isLast ? 'border-b border-primary/10' : ''}
        `;

    card.onclick = () => {
      window.location.href = '/#' + post.slug;
    };

    card.innerHTML = `
          <h2 class="text-base font-medium text-primary mb-1">
            ${post.title}<span
            class="inline-block ml-2 text-second
                    opacity-0
                    translate-x-[-6px]
                    transition-all duration-300 ease-out
                    will-change-transform will-change-opacity
                    group-hover:opacity-100 group-hover:translate-x-0">
            ᯓ★
            </span>
          </h2>

          <div class="text-xs text-second mb-2">
            ${date}
          </div>

          ${
            excerpt
              ? `<div
                   class="text-sm text-third leading-6
                          overflow-hidden text-ellipsis
                          line-clamp-2">
                   ${excerpt}
                 </div>`
              : ''
          }
        `;

    container.appendChild(card);
  });
}

// 4. Hàm render nội dung bài viết (dùng thư viện Marked)
export function renderMarkdown(data, elementId) {
  const contentEl = document.getElementById(elementId);
  const date = data.created_at
    ? new Date(data.created_at).toTimeString().split(' ')[0]
    : data.date || '';
  if (!data.content) {
    contentEl.innerHTML = '<p>Không tìm thấy bài viết này.</p>';
    return;
  }
  // marked là biến toàn cục từ thư viện CDN
  // contentEl.innerHTML = `
  //   <div class="flex justify-center px-6 py-10">
  //     <div class="prose prose-invert w-full max-w-3xl">
  //       ${marked.parse(content)}
  //     </div>
  //   </div>
  // `;
  contentEl.innerHTML = `
    <div class="flex justify-center px-6">
        <article class="w-full max-w-3xl">
        <header class="mb-10">
            <h1 class="text-3xl font-bold text-primary mb-3">
            ${data.title || ''}
            </h1>
            <div class="text-sm text-second">
            ${date || ''}
            </div>
        </header>

        <div class="prose prose-invert max-w-none">
            ${marked.parse(data.content)}
        </div>
        </article>
    </div>
    `;
}
