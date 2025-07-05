document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.adsbygoogle').forEach(ad => { if (ad.closest('section')) ad.closest('section').style.display = 'none'; else ad.style.display = 'none'; });
    // Mobile menu toggle logic
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        }
        // Trigger chart redraw if charts are visible and Chart.js is loaded
        if (typeof Chart !== 'undefined' && window.updateChartsOnThemeChange) {
            window.updateChartsOnThemeChange();
        }
    }

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            if (htmlElement.classList.contains('dark')) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        });
    }

    // Dynamic year update for footers
    const currentYearElements = document.querySelectorAll('[id^="current-year-footer"]');
    const currentYearMain = document.getElementById('current-year'); // For index.html
    const currentYear = new Date().getFullYear();

    if (currentYearMain) {
        currentYearMain.textContent = currentYear;
    }
    currentYearElements.forEach(element => {
        element.textContent = currentYear;
    });

    // Google Ads Initialization
    const loadGoogleAds = () => {
        // Only load if not already loaded by a previous script tag
        if (!document.querySelector('script[src^="https://pagead2.googlesyndication.com"]')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUB_ID'; // Replace YOUR_PUB_ID
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        }
        // Push ad units after script is loaded
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    // Load ads after page load
    window.addEventListener('load', loadGoogleAds);

    // Active navigation link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop(); // Get current file name

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});