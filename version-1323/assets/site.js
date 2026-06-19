const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupMenu() {
  const button = $('.menu-toggle');
  const panel = $('.mobile-panel');
  if (!button || !panel) return;
  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
  });
}

function setupHero() {
  const carousel = $('.hero-carousel');
  if (!carousel) return;
  const slides = $$('.hero-slide', carousel);
  const dots = $$('.hero-dot');
  const bg = $('.hero-bg img');
  if (!slides.length) return;
  let index = 0;
  const show = next => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (bg) {
      const img = $('img', slides[index]);
      if (img) bg.src = img.getAttribute('src');
    }
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  show(0);
  window.setInterval(() => show(index + 1), 5200);
}

function setupFilters() {
  const panel = $('.search-panel');
  if (!panel) return;
  const input = $('[data-filter="keyword"]', panel);
  const year = $('[data-filter="year"]', panel);
  const region = $('[data-filter="region"]', panel);
  const type = $('[data-filter="type"]', panel);
  const button = $('[data-filter="submit"]', panel);
  const cards = $$('.movie-card, .rank-item');
  const empty = $('.empty-state');

  const queryParams = new URLSearchParams(window.location.search);
  const initial = queryParams.get('q');
  if (initial && input) input.value = initial;

  const match = card => {
    const haystack = [
      card.dataset.title,
      card.dataset.year,
      card.dataset.region,
      card.dataset.type,
      card.dataset.genre,
      card.dataset.tags
    ].join(' ').toLowerCase();
    const keyword = input ? input.value.trim().toLowerCase() : '';
    const yearValue = year ? year.value : '';
    const regionValue = region ? region.value : '';
    const typeValue = type ? type.value : '';
    return (!keyword || haystack.includes(keyword)) &&
      (!yearValue || card.dataset.year === yearValue) &&
      (!regionValue || card.dataset.region === regionValue) &&
      (!typeValue || card.dataset.type === typeValue);
  };

  const apply = () => {
    let visible = 0;
    cards.forEach(card => {
      const ok = match(card);
      card.style.display = ok ? '' : 'none';
      if (ok) visible += 1;
    });
    if (empty) empty.classList.toggle('show', visible === 0);
  };

  [input, year, region, type].filter(Boolean).forEach(el => {
    el.addEventListener('input', apply);
    el.addEventListener('change', apply);
  });
  if (button) button.addEventListener('click', apply);
  apply();
}

async function attachHls(video, source) {
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    await video.play();
    return;
  }
  const mod = await import(new URL('./hls-vendor.js', import.meta.url).href);
  const Hls = mod.H;
  if (Hls && Hls.isSupported()) {
    const hls = new Hls({ enableWorker: true });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else {
    video.src = source;
    await video.play();
  }
}

function setupPlayers() {
  $$('.player-box').forEach(box => {
    const video = $('video', box);
    const overlay = $('.play-overlay', box);
    const button = $('button', overlay || box);
    if (!video || !button) return;
    const start = async () => {
      const source = video.dataset.src;
      if (!source) return;
      overlay.classList.add('is-hidden');
      try {
        if (!video.dataset.ready) {
          video.dataset.ready = '1';
          await attachHls(video, source);
        } else {
          await video.play();
        }
      } catch (error) {
        overlay.classList.remove('is-hidden');
      }
    };
    button.addEventListener('click', start);
    video.addEventListener('click', () => {
      if (video.paused) start();
    });
    video.addEventListener('play', () => overlay.classList.add('is-hidden'));
  });
}

setupMenu();
setupHero();
setupFilters();
setupPlayers();
