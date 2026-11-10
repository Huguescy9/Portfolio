// Page Mentions légales (version française) : titre animé comme les autres pages.
leverTitre('#t-page');
if (!calme) gsap.from('.legal section', { y: 24, opacity: 0, duration: .6, stagger: .05, delay: .25, ease: 'power3.out', clearProps: 'transform,opacity' });
