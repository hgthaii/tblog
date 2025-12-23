import { API_BASE } from '../consts/consts.js';

const form = document.getElementById('post-form');
const previewBtn = document.getElementById('preview-btn');
const previewEl = document.getElementById('preview');

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/\s+/g, '-');
}

previewBtn.addEventListener('click', () => {
  const content = document.getElementById('content').value;
  previewEl.innerHTML = content ? marked.parse(content) : 'Chưa có nội dung.';
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  let slug = document.getElementById('slug').value.trim();
  const content = document.getElementById('content').value;
  if (!slug) slug = slugify(title) || Date.now().toString();

  const payload = { title, slug, content };
  try {
    const resp = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error('Không thể tạo bài');
    const data = await resp.json();
    alert('Tạo bài thành công: ' + data.slug);
    // redirect to view
    window.location.href = '/#' + data.slug;
  } catch (err) {
    alert('Lỗi: ' + err.message);
  }
});
