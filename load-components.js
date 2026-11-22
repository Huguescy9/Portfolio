// Fonction pour charger le header et le footer
async function loadComponents() {
  // Langue mémorisée ?
  const savedLang = localStorage.getItem("siteLang");

  // Détecter le dossier courant (fr ou en)
  const path = window.location.pathname.replace(/\\/g, '/');
  const parts = path.split('/').filter(Boolean);
  const urlLang = parts[0] === 'fr' || parts[0] === 'en' ? parts[0] : null;

  // Langue finale = localStorage > URL > FR par défaut
  const currentLang = savedLang || urlLang || 'fr';

  // Charger le header
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    try {
      const headerResponse = await fetch(`/${currentLang}/header.html`);
      const headerHtml = await headerResponse.text();
      headerPlaceholder.innerHTML = headerHtml;
      initializeHeader();
    } catch (error) {
      console.error('Erreur lors du chargement du header:', error);
    }
  }

  // Charger le footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    try {
      const footerResponse = await fetch(`/${currentLang}/footer.html`);
      const footerHtml = await footerResponse.text();
      footerPlaceholder.innerHTML = footerHtml;
    } catch (error) {
      console.error('Erreur lors du chargement du footer:', error);
    }
  }
}

// Fonction pour initialiser les fonctionnalités du header
function initializeHeader() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const overlay = document.getElementById('overlay');
  const header = document.querySelector('header');

  // --- Menu responsive ---
  if (menuToggle && mainNav && overlay) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      overlay.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });

    overlay.addEventListener('click', () => {
      mainNav.classList.remove('active');
      overlay.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove('active');
          overlay.classList.remove('active');
          const icon = menuToggle.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // --- Effet de scroll ---
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 50
        ? 'rgba(44, 62, 80, 0.95)'
        : '#2c3e50';
    });
  }

  // --- Dropdown langue ---
  const langToggle = document.getElementById("langToggle");
  const langMenu = document.getElementById("langMenu");

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenu.classList.toggle("show");
    });

    langMenu.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => {
        const lang = li.getAttribute("data-lang");

        // Sauvegarde la langue choisie
        localStorage.setItem("siteLang", lang);

        // Page actuelle (index.html si rien derrière /fr ou /en)
        const path = window.location.pathname.replace(/\\/g, '/');
        const parts = path.split('/').filter(Boolean);
        const currentFile = parts[1] || "index.html";

        // Redirection vers la bonne langue
        window.location.href = `/${lang}/${currentFile}`;
      });
    });

    // Fermer le menu si on clique ailleurs
    document.addEventListener("click", () => {
      langMenu.classList.remove("show");
    });
  }
}

// Charger les composants
document.addEventListener('DOMContentLoaded', loadComponents);
