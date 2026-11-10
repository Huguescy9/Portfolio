// Page CV (version française) : entrée animée et agrandissement de l'aperçu en plein écran.
leverTitre('#t-page');
if (!calme) {
  gsap.from('.feuille-cv', { y: 70, rotation: -2.5, opacity: 0, duration: 1.1, delay: .25, ease: 'power3.out', clearProps: 'transform,opacity' });
  gsap.from('.cote > *', { y: 26, opacity: 0, duration: .7, stagger: .08, delay: .45, ease: 'power3.out', clearProps: 'transform,opacity' });
}

// L'aperçu grandit jusqu'au plein écran, comme les photos de projets, puis se referme à sa place.
const apercu = $('#apercu'), vis = $('#visionneuse'), fermerCv = $('#fermerCv');
let cvOuvert = false;
function ouvrirCv() {
  if (cvOuvert) return;
  cvOuvert = true;
  vis.scrollTop = 0;
  bloquer(true);
  fermerCv.style.display = 'block';
  gsap.set(vis, { visibility: 'visible' });
  if (calme) gsap.set(vis, { clipPath: plein });
  else gsap.fromTo(vis, { clipPath: coupe(apercu.getBoundingClientRect()) }, { clipPath: plein, duration: .7, ease: 'expo.inOut' });
  fermerCv.focus({ preventScroll: true });
}
function refermerCv() {
  if (!cvOuvert) return;
  cvOuvert = false;
  fermerCv.style.display = 'none';
  const fin = () => { gsap.set(vis, { visibility: 'hidden' }); bloquer(false); apercu.focus({ preventScroll: true }); };
  if (calme) return fin();
  gsap.to(vis, { clipPath: coupe(apercu.getBoundingClientRect()), duration: .55, ease: 'expo.inOut', onComplete: fin });
}
apercu.addEventListener('click', ouvrirCv);
fermerCv.addEventListener('click', refermerCv);
addEventListener('keydown', e => { if (e.key === 'Escape') refermerCv(); });
