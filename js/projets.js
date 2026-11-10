// Animations propres à la page Projets (version française).

leverTitre('#t-page');

// Chaque photo se dévoile en arrivant à l'écran.
let devoilements = [];
if (!calme) devoilements = $$('.carte').map(c => gsap.from(c.querySelector('.photo'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.out', clearProps: 'clipPath', scrollTrigger: { trigger: c, start: 'top 88%', once: true } }));
function toutDevoiler() { devoilements.forEach(t => { if (t.scrollTrigger) t.scrollTrigger.kill(); t.progress(1); }); devoilements = []; }

// Le filtre replace les projets en douceur.
const grille = $('#cartes'), cartes = $$('.carte');
$$('.filtre').forEach(b => b.addEventListener('click', () => {
  toutDevoiler();
  $$('.filtre').forEach(x => x.setAttribute('aria-pressed', x === b));
  const f = b.dataset.f;
  const avant = new Map(cartes.filter(c => !c.classList.contains('masque')).map(c => [c, c.getBoundingClientRect()]));
  grille.classList.toggle('filtree', f !== 'tout');
  cartes.forEach(c => c.classList.toggle('masque', !(f === 'tout' || c.dataset.t.split(' ').includes(f))));
  ScrollTrigger.refresh();
  if (calme) return;
  cartes.filter(c => !c.classList.contains('masque')).forEach(c => {
    const n = c.getBoundingClientRect(), a = avant.get(c);
    if (a) gsap.from(c, { x: a.left - n.left, y: a.top - n.top, duration: .6, ease: 'power3.out', clearProps: 'transform' });
    else gsap.from(c, { opacity: 0, y: 34, duration: .5, ease: 'power3.out', clearProps: 'transform,opacity' });
  });
}));

// Les liens de la page Compétences ouvrent directement le bon projet.
const VERS = { python: 'raspberrypi', reseau: 'raspberrypi', linux: 'linux' };
function ouvrirDepuisLien() {
  const cle = VERS[new URLSearchParams(location.search).get('open')];
  if (!cle) return;
  const b = $(`.photo[data-p="${cle}"]`);
  toutDevoiler();
  if (lenis) lenis.scrollTo(b, { immediate: true, offset: -90 }); else b.scrollIntoView({ block: 'center' });
  setTimeout(() => ouvrirFiche(b), 250);
}
document.fonts.ready.then(() => { ScrollTrigger.refresh(); ouvrirDepuisLien(); });
