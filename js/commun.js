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

// Chargeur. Première visite : un ciel étoilé tourne au-dessus d'antennes pendant le chargement.
// Sur l'accueil, il se referme ensuite dans les lettres de HUGUES en partant du G, puis laisse place à la photo.
// Visites suivantes : un simple rideau qui se lève. « entree » se résout quand la page apparaît.
const chargeur = $('#chargeur');

// Point le plus « épais » d'une lettre (centre du plus grand cercle qui tient dedans).
function pointDansLettre(lettre, police) {
  const T = 220, N = T * 2, c = document.createElement('canvas');
  c.width = c.height = N;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.font = `${T}px ${police}`;
  x.fillStyle = '#000';
  x.fillText(lettre, T * .4, T * 1.5);
  const a = x.getImageData(0, 0, N, N).data, d = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) d[i] = a[i * 4 + 3] > 128 ? 1e6 : 0;
  const D = 1.41;
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) { const k = j * N + i; d[k] = Math.min(d[k], d[k - 1] + 1, d[k - N] + 1, d[k - N - 1] + D, d[k - N + 1] + D); }
  let mx = 0, px = 0, py = 0;
  for (let j = N - 2; j > 0; j--) for (let i = N - 2; i > 0; i--) { const k = j * N + i; d[k] = Math.min(d[k], d[k + 1] + 1, d[k + N] + 1, d[k + N + 1] + D, d[k + N - 1] + D); if (d[k] > mx) { mx = d[k]; px = i; py = j; } }
  return { x: (px - T * .4) / T, y: (py - T * 1.5) / T, r: mx / T };
}

// Silhouettes de radiotélescopes au premier plan.
function dessinerAntennes(x, W, H, alpha) {
  if (alpha <= 0) return;
  x.save(); x.globalAlpha = alpha; x.fillStyle = '#02040c';
  const sol = H * .9;
  x.beginPath(); x.moveTo(0, sol); x.quadraticCurveTo(W * .3, sol - H * .035, W * .6, sol); x.quadraticCurveTo(W * .85, sol + H * .012, W, sol - H * .02); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  for (const [cx, k, ang] of [[.14, 1, -.5], [.33, .68, -.32], [.76, 1.18, -.62], [.93, .6, -.38]]) {
    const u = Math.min(W, H) * .1 * k, bx = W * cx, by = sol + H * .004;
    x.beginPath(); x.moveTo(bx - u * .36, by); x.lineTo(bx - u * .12, by - u * .92); x.lineTo(bx + u * .12, by - u * .92); x.lineTo(bx + u * .36, by); x.fill();
    x.save(); x.translate(bx, by - u * 1.05); x.rotate(ang);
    x.beginPath(); x.ellipse(0, 0, u * .98, u * .44, 0, 0, Math.PI); x.fill();
    x.fillRect(-u * .035, -u * .8, u * .07, u * .8);
    x.beginPath(); x.arc(0, -u * .82, u * .07, 0, 6.283); x.fill();
    x.restore();
  }
  x.restore();
}

// Ciel animé sur le canevas du chargeur. v pilote la vitesse, la longueur des traînées et les antennes.
function cielEtoile(cv) {
  const x = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
  const W = cv.width = Math.round(innerWidth * dpr), H = cv.height = Math.round(innerHeight * dpr);
  // Le ciel garde ses traînées sur un canevas à part ; l'écran le recopie puis ajoute antennes et masque.
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const o = off.getContext('2d');
  const px = W * .5, py = H * .16, R = Math.hypot(W, H) * 1.05;
  const teintes = ['225,233,255', '200,214,255', '255,238,214', '255,206,168', '255,168,168'];
  const et = Array.from({ length: innerWidth < 900 ? 900 : 1500 }, () => {
    const chaud = Math.random() < .3;
    return { r: Math.sqrt(Math.random()) * R, a: Math.random() * 6.283, b: .3 + Math.random() * .7, c: teintes[chaud ? 2 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2)], w: Math.random() < .05 ? 2.4 : (Math.random() < .3 ? 1.3 : .8) };
  });
  o.fillStyle = '#050a1c'; o.fillRect(0, 0, W, H);
  const v = { vit: .0012, trace: .14, ant: 1, z: 1 };
  let masque = null, vivant = true;
  (function dessin() {
    if (!vivant) return;
    o.globalCompositeOperation = 'source-over';
    o.fillStyle = `rgba(5,10,28,${v.trace})`; o.fillRect(0, 0, W, H);
    o.globalCompositeOperation = 'lighter';
    for (const s of et) {
      const a0 = s.a; s.a += v.vit * (1.25 - s.r / R * .5);
      o.strokeStyle = `rgba(${s.c},${s.b})`; o.lineWidth = s.w * dpr * 1.3;
      o.beginPath(); o.arc(px, py, s.r, a0, s.a); o.stroke();
    }
    x.globalCompositeOperation = 'source-over';
    x.clearRect(0, 0, W, H); x.drawImage(off, 0, 0);
    dessinerAntennes(x, W, H, v.ant);
    if (masque) {
      // Le navigateur refuse le texte géant : on agrandit une image des lettres dessinée une fois.
      const m = masque, s = 1 + (m.sMax - 1) * v.z;
      x.globalCompositeOperation = 'destination-in';
      x.save(); x.translate(m.ax, m.ay); x.scale(s, s); x.translate(-m.ax, -m.ay);
      x.drawImage(m.img, m.bx, m.by, m.bw, m.bh);
      x.restore();
    }
    requestAnimationFrame(dessin);
  })();
  return {
    v,
    arreter() { vivant = false; },
    // mot : { fs, lettres: [{ c, x, y }], ax, ay, r } en pixels CSS (y = ligne de base).
    masquer(mot) {
      const k = dpr, f = mot.fs * k, K = 3;
      const mes = x.measureText ? (x.font = `${f}px Anton`, x.measureText('HUGUES')) : null;
      const A = mes ? mes.fontBoundingBoxAscent : f * .95, De = mes ? mes.fontBoundingBoxDescent : f * .25;
      const ls = mot.lettres.map(l => ({ c: l.c, x: l.x * k, y: l.y * k }));
      const bx = ls[0].x - f * .1, by = ls[0].y - A, bw = ls[ls.length - 1].x + f * .8 - bx, bh = A + De;
      const img = document.createElement('canvas'); img.width = Math.ceil(bw * K); img.height = Math.ceil(bh * K);
      const mx = img.getContext('2d');
      mx.scale(K, K); mx.translate(-bx, -by); mx.font = `${f}px Anton`; mx.fillStyle = '#000';
      ls.forEach(l => mx.fillText(l.c, l.x, l.y));
      const ax = mot.ax * k, ay = mot.ay * k, rr = mot.r * k;
      const sMax = Math.max(Math.hypot(ax, ay), Math.hypot(W - ax, ay), Math.hypot(ax, H - ay), Math.hypot(W - ax, H - ay)) / rr * 1.15;
      masque = { img, bx, by, bw, bh, ax, ay, sMax };
    },
  };
}

const entree = new Promise(fin => {
  if (!chargeur || calme) { if (chargeur) chargeur.style.display = 'none'; fin(); return; }
  const premiere = document.documentElement.classList.contains('premiere');
  const delai = ms => new Promise(r => setTimeout(r, ms));
  const charge = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
  const pret = Promise.race([Promise.all([charge, document.fonts.ready]), delai(premiere ? 5000 : 1200)]);
  const lever = () => {
    gsap.to(chargeur, { yPercent: -100, duration: premiere ? .9 : .6, ease: 'power4.inOut', onComplete: () => { chargeur.style.visibility = 'hidden'; if (lenis) lenis.start(); } });
    setTimeout(fin, premiere ? 380 : 220);
  };
  if (lenis) lenis.stop();
  if (!premiere) { pret.then(lever); return; }

  const ciel = cielEtoile($('#ch-ciel'));
  const n = $('#ch-n'), b = $('#ch-b'), v = { p: 0 };
  const montre = () => { n.textContent = Math.round(v.p); b.style.transform = 'scaleX(' + v.p / 100 + ')'; };
  gsap.from('.ch-haut > *', { opacity: 0, y: 12, duration: .6, stagger: .1, ease: 'power3.out' });
  gsap.from('.ch-compte', { opacity: 0, y: 40, duration: .8, ease: 'power3.out' });
  gsap.to(ciel.v, { vit: .012, trace: .04, duration: 2.6, ease: 'power2.in' });
  const montee = gsap.to(v, { p: 90, duration: 2.2, ease: 'power2.inOut', onUpdate: montre });
  Promise.all([pret, delai(2200)]).then(() => {
    montee.kill();
    gsap.to(v, { p: 100, duration: .4, ease: 'power1.inOut', onUpdate: montre, onComplete: () => {
      const tl = gsap.timeline({ onComplete: () => { ciel.arreter(); chargeur.style.visibility = 'hidden'; if (lenis) lenis.start(); } });
      tl.to(['.ch-haut', '.ch-compte', '.ch-barre'], { opacity: 0, duration: .3 });
      // Sur l'accueil, la page fournit la place exacte des lettres de HUGUES.
      const lettres = typeof window.motAccueil === 'function' ? Promise.resolve(window.voilePret).then(() => window.motAccueil()).catch(() => null) : Promise.resolve(null);
      lettres.then(mot => {
        if (!mot) { tl.add(lever); return; }
        window.huguesForme = true;
        ciel.masquer(mot);
        chargeur.style.background = 'transparent';
        tl.to(ciel.v, { z: 0, duration: 1.4, ease: 'expo.inOut' }, '<')
          .to(ciel.v, { ant: 0, duration: .5 }, '<')
          .to(ciel.v, { vit: .004, trace: .015, duration: 1.4, ease: 'power2.out' }, '<')
          .add(fin)
          .to('#ch-ciel', { opacity: 0, duration: .9, ease: 'power2.inOut' });
      });
    } });
  });
});

// Le rideau redescend avant de changer de page (liens internes uniquement).
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || !chargeur || calme || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target && a.target !== '_self') return;
  if (a.hasAttribute('download')) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || !/(\.html|\/)$/.test(u.pathname)) return;
  if (u.pathname === location.pathname && u.search === location.search) return;
  e.preventDefault();
  chargeur.style.visibility = 'visible';
  gsap.fromTo(chargeur, { yPercent: 100 }, { yPercent: 0, duration: .5, ease: 'power3.in', onComplete: () => { location.href = u.href; } });
});
// Retour arrière depuis le cache du navigateur : la page doit réapparaître sans rideau.
addEventListener('pageshow', e => { if (e.persisted && chargeur) { gsap.set(chargeur, { yPercent: -100 }); chargeur.style.visibility = 'hidden'; if (lenis) lenis.start(); } });


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
  if (!calme) {
    gsap.set(sel + ' span', { yPercent: 105 });
    entree.then(() => gsap.to(sel + ' span', { yPercent: 0, duration: .95, stagger: .05, ease: 'power4.out' }));
  }
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
