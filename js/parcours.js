// Animations propres à la page Parcours (version française).
leverTitre('#t-page');

if (!calme) {
  // La ligne rouge suit la lecture ; chaque point s'allume quand on atteint son étape.
  $$('.frise').forEach(f => gsap.fromTo(f.querySelector('.trait'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top 65%', end: 'bottom 65%', scrub: .4 } }));
  $$('.etape').forEach(e => {
    ScrollTrigger.create({ trigger: e, start: 'top 65%', onEnter: () => e.querySelector('.point').classList.add('allume'), onLeaveBack: () => e.querySelector('.point').classList.remove('allume') });
    gsap.from(e.querySelectorAll('.date, h3, .lieu, .texte'), { y: 30, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: e, start: 'top 90%', once: true } });
  });
} else {
  $$('.point').forEach(p => p.classList.add('allume'));
}
document.fonts.ready.then(() => ScrollTrigger.refresh());
