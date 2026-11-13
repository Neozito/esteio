const slides = document.querySelectorAll('.slide');
const tabs = document.querySelectorAll('.hero-tab');
let current = 0;
function showSlide(index) {
  if (!slides.length) return;
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.classList.toggle('active', i === current); slide.setAttribute('aria-hidden', String(i !== current)); });
  tabs.forEach((tab, i) => { tab.classList.toggle('active', i === current); tab.setAttribute('aria-pressed', String(i === current)); });
}
// Alterna automaticamente entre as três imagens do hero a cada 4 segundos.
// Ao usar as setas ou abas, o visitante mantém o controle e a contagem reinicia.
const HERO_SLIDE_INTERVAL_MS = 4000;
let heroAutoTimer = null;
function startHeroAutoRotation() {
  if (slides.length < 2) return;
  window.clearInterval(heroAutoTimer);
  heroAutoTimer = window.setInterval(() => showSlide(current + 1), HERO_SLIDE_INTERVAL_MS);
}
function selectSlideManually(index) {
  showSlide(index);
  startHeroAutoRotation();
}
tabs.forEach(tab => tab.addEventListener('click', () => selectSlideManually(Number(tab.dataset.slide))));
document.querySelector('.slider-arrow.prev')?.addEventListener('click', () => selectSlideManually(current - 1));
document.querySelector('.slider-arrow.next')?.addEventListener('click', () => selectSlideManually(current + 1));
showSlide(0);
startHeroAutoRotation();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
function setMenu(open) {
  nav?.classList.toggle('open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  if (menuToggle) menuToggle.textContent = open ? '×' : '☰';
}
menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('open')) { setMenu(false); menuToggle.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) setMenu(false); });
window.matchMedia('(min-width:821px)').addEventListener('change', () => setMenu(false));
// Atendimento comercial padrão. Alguns formulários indicam a central do associado.
const WHATSAPP_NUMBER = '5545999820251';
document.querySelectorAll('.whatsapp-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    let message = `Olá Esteio Sul!\n\n${form.dataset.formTitle || 'Contato pelo site'}\n`;
    for (const [key, value] of new FormData(form).entries()) {
      if (String(value).trim()) message += `\n${key}: ${String(value).trim()}`;
    }
    window.open(`https://wa.me/${form.dataset.whatsappNumber || WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
});

// Fundo parallax da secao de diferenciais, sem interferir nos cards nem na navegacao.
(() => {
  const section = document.querySelector('.differentials-section');
  const background = section?.querySelector('.differentials-parallax-bg');
  if (!section || !background) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationFrame = 0;
  function updateParallax() {
    animationFrame = 0;
    if (reducedMotion.matches) { background.style.transform = 'none'; return; }
    const bounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (bounds.bottom < 0 || bounds.top > viewportHeight) return;
    const progress = Math.max(0, Math.min(1, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));
    const amplitude = Math.min(125, bounds.height * 0.1);
    const shift = (progress * 2 - 1) * amplitude;
    background.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
  }
  function scheduleParallax() {
    if (!animationFrame) animationFrame = requestAnimationFrame(updateParallax);
  }
  window.addEventListener('scroll', scheduleParallax, { passive:true });
  window.addEventListener('resize', scheduleParallax, { passive:true });
  reducedMotion.addEventListener?.('change', scheduleParallax);
  scheduleParallax();
})();
