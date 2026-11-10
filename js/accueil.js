// Animations propres à la page d'accueil (version française).

// La phrase de recherche s'allume mot à mot.
const phrase = $('#phrase');
phrase.innerHTML = phrase.textContent.split(' ').map(m => `<span>${m}</span>`).join(' ');
if (!calme) gsap.to('#phrase span', { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: '#phrase', start: 'top 75%', end: 'bottom 50%', scrub: .4 } });

// Plongée dans le G de HUGUES : on zoome sur le point le plus épais de la lettre,
// la photo s'ouvre alors jusqu'à remplir tout l'écran.
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

let G = null, encre = null, lettres = [], hauteurMot = 0;
const gr = $('#m-g'), z = { p: 0 }, courbe = gsap.parseEase('power3.in');
function poserVoile() {
  const W = innerWidth, H = $('#intro').offsetHeight;
  $('#voile').setAttribute('viewBox', `0 0 ${W} ${H}`);
  ['#m-fond', '#v-r'].forEach(s => { $(s).setAttribute('width', W); $(s).setAttribute('height', H); });
  const t = $('#m-t');
  t.setAttribute('x', W / 2); t.setAttribute('font-size', 100); t.setAttribute('y', 0);
  let b = t.getBBox();
  const fs = Math.min(W * .9 / b.width, H * .62 / b.height) * 100;
  t.setAttribute('font-size', fs); t.setAttribute('y', 0); b = t.getBBox();
  t.setAttribute('y', H * .46 - (b.y + b.height / 2));
  b = t.getBBox();
  // Une lettre par élément, pour qu'elles puissent monter une à une comme les titres des autres pages.
  // Le contour (lc) garde le mot lisible même là où la photo est sombre.
  const NS = 'http://www.w3.org/2000/svg', lm = $('#lm'), lc = $('#lc');
  lm.innerHTML = ''; lc.innerHTML = '';
  lettres = [...t.textContent].map((ch, i) => {
    const x = t.getStartPositionOfChar(i).x;
    return [[lm, { fill: '#000' }], [lc, { fill: 'none', stroke: '#fff', 'stroke-width': 1.6 }]].map(([g, attrs]) => {
      const e = document.createElementNS(NS, 'text');
      e.textContent = ch;
      e.setAttribute('class', 'lettre');
      e.setAttribute('x', x); e.setAttribute('y', t.getAttribute('y')); e.setAttribute('font-size', fs);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      g.appendChild(e);
      return e;
    });
  });
  // Fenêtre de la ligne de base au haut des lettres : elles sortent de sous le mot, sans dépasser.
  const base = +t.getAttribute('y'), f = $('#fen-r');
  f.setAttribute('x', 0); f.setAttribute('y', base - fs * .95); f.setAttribute('width', W); f.setAttribute('height', fs * 1.0);
  hauteurMot = fs * .92;
  encre = encre || pointDansLettre('G', 'Anton');
  const s = t.getStartPositionOfChar(2), cx = s.x + encre.x * fs, cy = s.y + encre.y * fs, r = encre.r * fs;
  const loin = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy));
  G = { cx, cy, maxi: loin / r * 1.12 };
  appliquer();
}
function appliquer() {
  if (!G) return;
  const s = 1 + (G.maxi - 1) * courbe(z.p);
  const m = `translate(${G.cx} ${G.cy}) scale(${s}) translate(${-G.cx} ${-G.cy})`;
  gr.setAttribute('transform', m);
  $('#contour').setAttribute('transform', m);
  $('#voile').style.visibility = z.p >= .999 ? 'hidden' : 'visible';
}
function monterIntro() {
  poserVoile();
  if (calme) { $('#voile').style.display = 'none'; $('#sous').style.display = 'none'; return; }
  // Entrée : les lettres de HUGUES montent une à une, comme les titres des autres pages, puis la ligne du dessous.
  lettres.forEach((paire, i) => gsap.from(paire, { y: hauteurMot * 1.15, duration: .95, delay: .08 + i * .06, ease: 'power4.out' }));
  gsap.from('#sous span', { y: 26, opacity: 0, duration: .8, delay: .55, ease: 'power3.out' });
  gsap.timeline({ scrollTrigger: { trigger: '#intro', start: 'top top', end: '+=170%', pin: true, scrub: .5 } })
    .to('#sous', { opacity: 0, duration: .1 }, 0)
    .to('#contour', { opacity: 0, duration: .14 }, .02)
    .to(z, { p: 1, duration: .8, ease: 'none', onUpdate: appliquer }, 0)
    .fromTo('.intro-photo', { scale: 1.2 }, { scale: 1, duration: 1, ease: 'none' }, 0)
    .to('#apres', { opacity: 1, duration: .16 }, .76)
    .to({}, { duration: .12 });
}

// Projets en vedette : à l'horizontale sur grand écran, à la verticale sur mobile.
gsap.matchMedia().add({ ordi: '(min-width:900px) and (prefers-reduced-motion: no-preference)', mob: '(max-width:899px) and (prefers-reduced-motion: no-preference)' }, ctx => {
  const rail = $('#rail');
  if (ctx.conditions.ordi) {
    const dist = () => rail.scrollWidth - innerWidth;
    const tw = gsap.to(rail, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#projets', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
    $$('.volet .photo img').forEach(i => gsap.fromTo(i, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: i.closest('.volet'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
  } else {
    $$('.volet .photo img').forEach(i => gsap.from(i, { scale: 1.2, ease: 'none', scrollTrigger: { trigger: i, start: 'top bottom', end: 'bottom top', scrub: true } }));
  }
});

if (!calme) {
  const pans = $$('.pan');
  pans.slice(0, -1).forEach((p, i) => gsap.to(p, { scale: .93, transformOrigin: '50% 30%', ease: 'none', scrollTrigger: { trigger: pans[i + 1], start: 'top bottom', end: 'top top', scrub: true } }));
  $$('.ligne > div').forEach(h => gsap.from(h, { yPercent: 110, duration: .9, ease: 'power4.out', scrollTrigger: { trigger: h.parentElement, start: 'top 88%', once: true } }));
}

// Copie de l'adresse e-mail, avec un message à l'écran plutôt qu'une alerte.
const cp = $('#copier');
cp.addEventListener('click', async () => {
  const mail = cp.dataset.mail;
  try { await navigator.clipboard.writeText(mail); annonce('Adresse copiée : ' + mail); }
  catch (e) { annonce('Mon e-mail : ' + mail); }
});

document.fonts.load('100px Anton').catch(() => {}).then(() => document.fonts.ready).then(() => { monterIntro(); ScrollTrigger.sort(); ScrollTrigger.refresh(); });
let attente, largeur = innerWidth;
addEventListener('resize', () => { if (innerWidth === largeur) return; largeur = innerWidth; clearTimeout(attente); attente = setTimeout(() => { poserVoile(); ScrollTrigger.refresh(); }, 200); });
