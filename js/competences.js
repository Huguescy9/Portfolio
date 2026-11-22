// Animations propres à la page Compétences (version française).
leverTitre('#t-page');

// Chaque compétence glisse à sa place quand elle arrive à l'écran.
if (!calme) $$('.skill').forEach(s => gsap.from(s, { y: 36, opacity: 0, duration: .7, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: s, start: 'top 94%', once: true } }));

document.fonts.ready.then(() => ScrollTrigger.refresh());
