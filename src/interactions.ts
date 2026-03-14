export function initCardGlow(): void {
  const cards = document.querySelectorAll<HTMLElement>('.card');
  cards.forEach((card) => {
    const glow = card.querySelector<HTMLElement>('.card-glow');
    if (!glow) return;
    card.addEventListener(
      'mousemove',
      (e) => {
        const rect = card.getBoundingClientRect();
        glow.style.left = `${e.clientX - rect.left - rect.width}px`;
        glow.style.top = `${e.clientY - rect.top - rect.height}px`;
      },
      { passive: true }
    );
  });
}

export function initScrollReveal(): void {
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  cards.forEach((card) => observer.observe(card));
}

export function initConsoleEasterEgg(): void {
  console.log('%c🚀 Built by Aspenini', 'color: #0088ff; font-size: 20px; font-weight: bold;');
  console.log('%cK.I.S.S. - Keep It Simple, Stupid', 'color: #00d4ff; font-size: 14px;');
  console.log('%cCEO of ApeXPloit Studios • Monkey Meets Machine', 'color: #0088ff; font-size: 12px;');
}
