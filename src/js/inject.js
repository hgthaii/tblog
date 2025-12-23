import { PATHS } from '../consts/paths.js';
import { tailwindConfig } from '../configs/tailwind.config.js';

export function injectHead() {
  const head = document.head;

  window.tailwind = {
    config: tailwindConfig,
  };
  console.log('tailwind config injected:', window.tailwind);

  // favicon
  const favicon = document.createElement('link');
  favicon.rel = 'shortcut icon';
  favicon.href = PATHS.icon.favicon;
  head.appendChild(favicon);

  // main css
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = PATHS.css.style;
  head.appendChild(css);

  // tailwind
  const tw = document.createElement('script');
  tw.src = PATHS.lib.tailwind;
  head.appendChild(tw);
}

export async function injectHome() {
  const resp = await fetch(PATHS.html.home);
  const html = await resp.text();
  document.body.insertAdjacentHTML('beforeend', html);
}
