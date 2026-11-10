// Page Contact (version française) : envoi par EmailJS, avec un message dans la page au lieu d'une alerte.
leverTitre('#t-page');
if (!calme) gsap.from('.infos > *, .formulaire', { y: 34, opacity: 0, duration: .8, stagger: .08, delay: .2, ease: 'power3.out', clearProps: 'transform,opacity' });

const cp = $('#copier');
cp.addEventListener('click', async () => {
  const mail = cp.dataset.mail;
  try { await navigator.clipboard.writeText(mail); annonce('Adresse copiée : ' + mail); }
  catch (e) { annonce('Mon e-mail : ' + mail); }
});

if (window.emailjs) emailjs.init('5isJBmAuFL6ZYuSz0'); // clé publique

const form = $('#contact-form'), etat = $('#etat');
function montrer(classe, texte) { etat.className = 'etat ' + classe; etat.textContent = texte; }
form.addEventListener('submit', e => {
  e.preventDefault();
  $('#time').value = new Date().toLocaleString();
  const bouton = form.querySelector('button');
  bouton.disabled = true;
  bouton.textContent = 'Envoi...';
  etat.className = 'etat';
  const envoi = window.emailjs ? emailjs.sendForm('service_m2yfsk6', 'template_sxbx8dh', form) : Promise.reject(new Error('EmailJS indisponible'));
  envoi
    .then(() => { montrer('ok', etat.dataset.ok); form.reset(); })
    .catch(err => { console.error('Erreur EmailJS :', err); montrer('erreur', etat.dataset.erreur); })
    .finally(() => { bouton.disabled = false; bouton.textContent = 'Envoyer le message'; });
});
