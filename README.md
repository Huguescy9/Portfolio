<div align="center">

# Portfolio · CHANE-YIN Hugues

**Étudiant en BUT Réseaux & Télécommunications · IUT de La Réunion**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=black)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![FR | EN](https://img.shields.io/badge/langues-FR%20%7C%20EN-555555)](#pages)
[![Droits](https://img.shields.io/badge/droits-tous%20réservés-lightgrey)](#droits)

[Pages](#pages) · [Technologies](#technologies) · [Lancer en local](#lancer-le-site-en-local) · [Contact](#contact)

</div>

---

Portfolio personnel d'un étudiant en **BUT Réseaux et Télécommunications** (IUT de La Réunion, 2023-2026), à la recherche d'un emploi dans les réseaux et les télécommunications.

Le site présente mes projets (chat souverain, cybersécurité, Raspberry Pi, fibre optique, Linux…), mes compétences, mon parcours et mon CV.

## Pages

| Page | Contenu |
| --- | --- |
| Accueil | Présentation, projets phares, aperçu des compétences et du parcours |
| Projets | Tous les projets, filtrables par domaine (cyber, réseau, télécom, web), avec une fiche détaillée en plein écran |
| Compétences | Compétences techniques, chacune reliée aux projets où elle a servi |
| Parcours | Formation et expériences sous forme de frise |
| Contact | Formulaire de contact (EmailJS) et coordonnées |
| CV | Aperçu du CV et téléchargement en PDF |
| Mentions légales | Éditeur, hébergeur, données personnelles, crédits photo |

Le site existe en français (`fr/`) et en anglais (`en/`). La page racine redirige vers la langue du navigateur.

## Technologies

- HTML, CSS et JavaScript, sans framework ni étape de compilation
- [GSAP](https://gsap.com) et ScrollTrigger pour les animations
- [Lenis](https://lenis.darkroom.engineering) pour le défilement fluide
- [EmailJS](https://www.emailjs.com) pour l'envoi du formulaire de contact
- Polices Anton et Hanken Grotesk (Google Fonts), icônes Font Awesome
- Hébergement sur [Vercel](https://vercel.com)

## Structure

```
├── index.html        Redirection vers /fr ou /en
├── fr/               Pages en français
├── en/               Pages en anglais
├── css/              commun.css (styles partagés) + une feuille par page
├── js/               commun.js (menu, fiches, animations) + un script par page
│   └── lib/          GSAP, ScrollTrigger, Lenis
└── assets/           Photos, CV, favicon
```

## Lancer le site en local

Les pages utilisent des chemins absolus (`/fr/...`) et chargent le pied de page avec `fetch`. Il faut donc un petit serveur HTTP lancé à la racine du dépôt, et pas une simple ouverture du fichier :

```bash
python -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Crédits photo

- Traînées d'étoiles au-dessus d'ALMA : ESO/B. Tafreshi (twanight.org), CC BY 4.0
- Serveurs : Victorgrigas, CC BY-SA 3.0
- Fibre optique : Hustvedt, CC BY-SA 3.0
- Raspberry Pi sur un switch réseau : RAIL P (RAIL.PHOTOGRAPHY), CC0
- Terminal Linux : Wikimedia Commons, CC0
- Ordinateur portable et cadenas : Unsplash (licence Unsplash)

## Droits

Les textes, les présentations de projets, le CV et le design de ce site m'appartiennent : tous droits réservés. Le code est visible pour consultation, mais il ne peut pas être réutilisé ni copié sans mon accord. Les photos de tiers restent soumises à leur propre licence (voir ci-dessus).

## Contact

h.chane-yin@rt-iut.re
