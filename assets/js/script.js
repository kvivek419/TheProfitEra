// assets/js/script.js

document.addEventListener('DOMContentLoaded', function () {
    // Hide ads by default (unchanged)
    document.querySelectorAll('.adsbygoogle').forEach(ad => {
        if (ad.closest('section')) ad.closest('section').style.display = 'none';
        else ad.style.display = 'none';
    });

    // Mobile menu toggle logic (unchanged)
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
        console.log(`setTheme called with theme: ${theme}`);
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
            // Force light mode styles to counter browser dark mode
            document.body.style.backgroundColor = '#F9FAFB';
            document.body.style.color = '#1F2937';
        }
        // Trigger chart redraw and animations
        if (typeof Chart !== 'undefined' && window.updateChartsOnThemeChange) {
            console.log('Triggering updateChartsOnThemeChange');
            window.updateChartsOnThemeChange();
        }
        // Log current state for debugging
        console.log(`Current theme in localStorage: ${localStorage.getItem('theme')}`);
        console.log(`dark class on <html>: ${htmlElement.classList.contains('dark')}`);
    }

    // Initialize theme
    function initializeTheme() {
        // Explicitly remove dark class to prevent external interference
        htmlElement.classList.remove('dark');
        const savedTheme = localStorage.getItem('theme');
        console.log(`Saved theme from localStorage: ${savedTheme}`);
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('light'); // Default to light mode
        }
        // Safeguard: Reapply theme after 500ms to handle late scripts/extensions
        setTimeout(() => {
            const currentSavedTheme = localStorage.getItem('theme');
            if (currentSavedTheme && currentSavedTheme !== (htmlElement.classList.contains('dark') ? 'dark' : 'light')) {
                console.warn('Theme mismatch detected, reapplying saved theme:', currentSavedTheme);
                setTheme(currentSavedTheme);
            }
        }, 500);
    }

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            console.log(`Toggling theme to: ${newTheme}`);
            setTheme(newTheme);
        });
    }

    // Initialize theme on page load
    initializeTheme();

    // Monitor system theme changes (optional, for user convenience)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) { // Only apply if no user preference
            console.log(`System theme changed to: ${e.matches ? 'dark' : 'light'}`);
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Dynamic year update for footers (unchanged)
    const currentYearElements = document.querySelectorAll('[id^="current-year-footer"]');
    const currentYearMain = document.getElementById('current-year');
    const currentYear = new Date().getFullYear();
    if (currentYearMain) {
        currentYearMain.textContent = currentYear;
    }
    currentYearElements.forEach(element => {
        element.textContent = currentYear;
    });

    // Google Ads Initialization (unchanged)
    const loadGoogleAds = () => {
        if (!document.querySelector('script[src^="https://pagead2.googlesyndication.com"]')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUB_ID'; // Replace YOUR_PUB_ID
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    };
    window.addEventListener('load', loadGoogleAds);

    // Active navigation link highlighting (unchanged)
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});