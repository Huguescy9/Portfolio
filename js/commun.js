// Partagé par les pages refaites : défilement, pied de page, menu, fiches de projet, messages.
gsap.registerPlugin(ScrollTrigger);
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

let lenis = null;
if (!calme) {
  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Pied de page commun, toujours en français sur ces pages.
fetch('footer.html').then(r => r.text()).then(h => { $('#pied').innerHTML = h; ScrollTrigger.refresh(); }).catch(() => {});

// Menu mobile.
const menu = $('#menu'), bMenu = $('#ouvreMenu');
function basculeMenu(ouvert) {
  menu.classList.toggle('ouvert', ouvert);
  bMenu.setAttribute('aria-expanded', ouvert);
  bMenu.textContent = ouvert ? 'Fermer' : 'Menu';
  if (lenis) ouvert ? lenis.stop() : lenis.start();
}
bMenu.addEventListener('click', () => basculeMenu(!menu.classList.contains('ouvert')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => basculeMenu(false)));

// Le titre de page monte lettre par lettre à l'arrivée.
function leverTitre(sel) {
  const t = $(sel);
  t.setAttribute('aria-label', t.textContent);
  // L'espace devient insécable : sinon il disparaît entre deux lettres animées (« MON CV »).
  t.innerHTML = [...t.textContent].map(l => `<span aria-hidden="true">${l === ' ' ? '&nbsp;' : l}</span>`).join('');
  if (!calme) gsap.from(sel + ' span', { yPercent: 105, duration: .95, stagger: .05, ease: 'power4.out' });
}

// Message discret à l'écran.
const toast = $('#toast');
function annonce(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(annonce.t); annonce.t = setTimeout(() => toast.classList.remove('on'), 2400); }

// Fiches : le texte vient des fiches de projets.html, pour n'en garder qu'une seule version.
let source = null;
function chargerFiches() {
  if (document.querySelector('.popup')) return Promise.resolve(document);
  if (!source) source = fetch('projets.html').then(r => r.text()).then(h => new DOMParser().parseFromString(h, 'text/html'));
  return source;
}
function remplirFiche(doc, cle, repli) {
  const c = $('#f-c'), racine = doc && doc.getElementById(cle + 'Popup');
  c.innerHTML = '';
  const titre = document.createElement('h2');
  titre.id = 'f-t';
  titre.textContent = racine ? racine.querySelector('.popup-header h2').textContent : repli;
  c.appendChild(titre);
  if (!racine) {
    const p = document.createElement('p');
    p.innerHTML = 'Le détail ne peut pas être affiché ici. <a href="projets.html">Voir la page Projets</a>';
    c.appendChild(p);
    return;
  }
  const g = document.createElement('div'), d = document.createElement('div');
  const h3 = t => { const e = document.createElement('h3'); e.textContent = t; return e; };
  g.appendChild(h3('Objectifs atteints'));
  const ul = document.createElement('ul');
  racine.querySelectorAll('.popup-list li').forEach(li => { const e = document.createElement('li'); e.textContent = li.textContent; ul.appendChild(e); });
  g.appendChild(ul);
  g.appendChild(h3('Compétences utilisées'));
  const tags = document.createElement('div');
  tags.className = 'etiquettes';
  racine.querySelectorAll('.modal-tag').forEach(t => { const e = document.createElement('span'); e.textContent = t.textContent; tags.appendChild(e); });
  g.appendChild(tags);
  const desc = document.createElement('p');
  desc.innerHTML = racine.querySelector('.popup-description').innerHTML;
  d.appendChild(desc);
  const r = racine.querySelector('.popup-reflection');
  if (r) { const e = document.createElement('p'); e.className = 'reflexion'; e.innerHTML = r.innerHTML; d.appendChild(e); }
  const liens = [...racine.querySelectorAll('.popup-document a')].filter(a => a.getAttribute('href') !== '#');
  if (liens.length) {
    d.appendChild(h3('Documents'));
    const box = document.createElement('div');
    box.className = 'docs';
    liens.forEach(a => { const e = document.createElement('a'); e.href = a.href; e.target = '_blank'; e.rel = 'noopener'; e.textContent = a.textContent.trim(); box.appendChild(e); });
    d.appendChild(box);
  }
  c.append(g, d);
}

// La photo cliquée grandit jusqu'au plein écran, puis se referme à sa place.
const fe = $('#feuille'), clore = $('#clore');
let origine = null, ficheOuverte = false;
const plein = 'inset(0px 0px 0px 0px)';
const coupe = r => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
function bloquer(oui) {
  if (lenis) oui ? lenis.stop() : lenis.start();
  if (!matchMedia('(hover:hover)').matches) document.documentElement.style.overflow = oui ? 'hidden' : '';
}
async function ouvrirFiche(b) {
  if (ficheOuverte) return;
  ficheOuverte = true;
  const photo = b.classList.contains('photo') ? b : b.closest('article').querySelector('.photo');
  origine = { photo, bouton: b };
  let doc = null;
  try { doc = await chargerFiches(); } catch (e) { doc = null; }
  remplirFiche(doc, b.dataset.p, photo.getAttribute('aria-label').replace('Voir le détail : ', ''));
  const img = $('#f-i');
  img.src = b.dataset.img;
  img.alt = photo.querySelector('img').alt;
  fe.scrollTop = 0;
  bloquer(true);
  clore.style.display = 'block';
  gsap.set(fe, { visibility: 'visible' });
  if (calme) { gsap.set(fe, { clipPath: plein }); }
  else {
    gsap.fromTo(fe, { clipPath: coupe(photo.getBoundingClientRect()) }, { clipPath: plein, duration: .75, ease: 'expo.inOut' });
    gsap.fromTo('#f-c > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, delay: .5, duration: .5, ease: 'power3.out' });
    gsap.fromTo(clore, { opacity: 0 }, { opacity: 1, delay: .5, duration: .3 });
  }
  clore.focus({ preventScroll: true });
}
function fermerFiche() {
  if (!ficheOuverte) return;
  ficheOuverte = false;
  clore.style.display = 'none';
  const fin = () => { gsap.set(fe, { visibility: 'hidden' }); bloquer(false); origine.bouton.focus({ preventScroll: true }); };
  if (calme) return fin();
  gsap.to(fe, { clipPath: coupe(origine.photo.getBoundingClientRect()), duration: .6, ease: 'expo.inOut', onComplete: fin });
}
$$('.ouvre').forEach(b => b.addEventListener('click', () => ouvrirFiche(b)));
clore.addEventListener('click', fermerFiche);
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (ficheOuverte) fermerFiche();
  else if (menu.classList.contains('ouvert')) { basculeMenu(false); bMenu.focus(); }
});
const prechargement = () => chargerFiches().catch(() => {});
'requestIdleCallback' in window ? requestIdleCallback(prechargement) : setTimeout(prechargement, 1200);
