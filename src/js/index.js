// src/js/index.js
import {
  getPosts,
  getPostContent,
  renderPostList,
  renderMarkdown,
  renderPostCards,
} from './script.js';

const blogArea = document.getElementById('post-grid');

async function init() {
  console.log('App booting...');
  const posts = await getPosts();
  renderPostCards(posts, 'post-grid'); // chỉ render cards

  handleLocation(posts);
  window.addEventListener('hashchange', () => handleLocation(posts));
}

async function handleLocation(posts) {
  if (!posts) posts = await getPosts();
  const mainId = 'post-grid';
  const slug = window.location.hash.substring(1);
  const hero = document.getElementById('hero');
  const blog = document.getElementById('blog');
  const main = document.querySelector('main');

  if (slug) {
    if (hero) hero.classList.add('hidden');

    if (main) {
      main.classList.remove('lg:grid-cols-2');
      main.classList.add('grid-cols-1');
    }

    if (blog) {
      blog.classList.remove('lg:col-span-2');
      blog.classList.add('w-full');
    }
    // READ MODE
    document.getElementById(mainId).innerHTML =
      '<div style="margin-top:20px; opacity:0.5;">Đang tải bài viết...</div>';

    const data = await getPostContent(slug);
    const content = data ? data.content : null;
    if (content) {
      renderMarkdown(data, mainId);
      document.getElementById(mainId).scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      document.getElementById(mainId).innerHTML = '<p>Không tìm thấy bài viết.</p>';
    }
  } else {
    if (hero) hero.classList.remove('hidden');

    if (main) {
      main.classList.remove('grid-cols-1');
      main.classList.add('lg:grid-cols-2');
    }

    if (blog) {
      blog.classList.remove('w-full');
    }
    // LIST MODE
    renderPostCards(posts, mainId);
  }
}

init();
