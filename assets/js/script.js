document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.site-header')) {
        document.querySelector('header')?.remove();
        document.querySelector('footer')?.remove();
        const shell = document.createElement('div');
        shell.innerHTML = `<header class="site-header"><div class="nav-shell"><a class="brand" href="index.html" aria-label="The Profit Era home"><img src="assets/img/logo.png" alt="The Profit Era logo"><span>The Profit Era<sup>™</sup></span></a><nav class="desktop-nav" aria-label="Primary navigation"><a href="index.html#platform">Platform</a><a href="index.html#core-product">Product</a><a href="index.html#tools">Tools</a><a href="index.html#experience">Experience</a><a href="about.html">Our Story</a><a href="contact.html">Contact</a></nav><div class="nav-actions"><a class="text-link" href="https://portal.theprofitera.com/Auth/Login">Log in</a><a class="button button-small" href="https://portal.theprofitera.com/Auth/Register">Open your account <span>↗</span></a><button class="menu-toggle" id="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button></div></div><div class="mobile-nav" id="mobile-nav"><a href="index.html#platform">Platform</a><a href="index.html#core-product">Product</a><a href="index.html#tools">Tools</a><a href="index.html#experience">Experience</a><a href="about.html">Our Story</a><a href="contact.html">Contact</a><a href="https://portal.theprofitera.com/Auth/Login">Log in</a><a class="button" href="https://portal.theprofitera.com/Auth/Register">Open your account <span>↗</span></a></div></header>`;
        document.body.prepend(shell.firstElementChild);
        const footer = document.createElement('footer');
        footer.className = 'site-footer';
        footer.innerHTML = `<div class="footer-main section-shell"><div class="footer-brand"><a class="brand" href="index.html"><img src="assets/img/logo.png" alt="The Profit Era logo"><span>The Profit Era<sup>™</sup></span></a><p>A clearer perspective for every market journey.</p><div class="footer-social" aria-label="The Profit Era social links"><a href="https://twitter.com/theprofitera" target="_blank" rel="noopener noreferrer" aria-label="The Profit Era on X">𝕏</a><a href="https://www.facebook.com/people/The-Profit-Era/61572953304388/" target="_blank" rel="noopener noreferrer" aria-label="The Profit Era on Facebook">f</a><a href="https://www.instagram.com/theprofitera25/" target="_blank" rel="noopener noreferrer" aria-label="The Profit Era on Instagram">◎</a><a href="https://www.youtube.com/@THEPROFITERA25" target="_blank" rel="noopener noreferrer" aria-label="The Profit Era on YouTube">▶</a><a href="https://www.threads.com/@theprofitera25" target="_blank" rel="noopener noreferrer" aria-label="The Profit Era on Threads">@</a></div></div><div class="footer-column"><b>Explore</b><a href="index.html#platform">Platform</a><a href="index.html#core-product">Product</a><a href="index.html#tools">Tools</a><a href="index.html#experience">Experience</a></div><div class="footer-column"><b>Portal</b><a href="https://portal.theprofitera.com/">Market dashboard</a><a href="https://portal.theprofitera.com/PaperTrading/Index">Paper trading</a><a href="https://portal.theprofitera.com/Auth/Login">Log in</a></div><div class="footer-column"><b>Company</b><a href="about.html">Our story</a><a href="contact.html">Contact</a><a href="privacy-policy.html">Privacy</a><a href="terms-conditions.html">Terms</a></div></div><div class="footer-bottom section-shell"><span>© <span id="current-year"></span> The Profit Era. All rights reserved.</span><span>Market data is for educational purposes only. Investments are subject to market risks.</span></div>`;
        document.body.append(footer);
    }

    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const year = document.getElementById('current-year');

    if (year) year.textContent = new Date().getFullYear();

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
            menuToggle.textContent = isOpen ? '×' : '☰';
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation');
                menuToggle.textContent = '☰';
            });
        });
    }

    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('visible'));
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000 && mobileNav && menuToggle) {
            mobileNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
            menuToggle.textContent = '☰';
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && mobileNav?.classList.contains('open')) {
            mobileNav.classList.remove('open');
            menuToggle?.setAttribute('aria-expanded', 'false');
            menuToggle?.focus();
        }
    });
});
