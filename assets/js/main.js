/**
 * Investigative Journalism Collective - Core Interactions
 */

// Prevent browser from restoring scroll position automatically
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Global Force Scroll to Top on Load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
    // 0. Navbar Toggle (Hamburger)
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking a link
        const navItems = navLinksContainer.querySelectorAll('.nav-item, .btn');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // 0.1 Robust Scroll to Top
    window.scrollTo(0, 0);
    
    // Also handle refresh explicitly
    if (performance.getEntriesByType('navigation')[0].type === 'reload') {
        window.scrollTo(0, 0);
    }

    // Force scroll to top when clicking home links while already on home
    const homeLinks = document.querySelectorAll('a[href="index.html"], a.logo');
    homeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isHomePage = window.location.pathname.endsWith('index.html') || 
                               window.location.pathname.endsWith('/') || 
                               window.location.pathname === '';
            if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // If it's the nav-item, ensure active class is set (already is, but good for consistency)
                if (link.classList.contains('nav-item')) {
                    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                updateThemeIcon('light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon('dark');
            }
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            if (icon) icon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // 1.5 RTL Toggle Logic
    const rtlToggles = document.querySelectorAll('#rtl-toggle, .rtl-toggle');
    const isRTL = localStorage.getItem('rtl') === 'true';

    // Swap navbar logo position for RTL — DOM swap + forced inline !important styles
    function swapNavbarLogo(rtl) {
        const navContent = document.querySelector('.nav-content');
        if (!navContent) return;
        const logo = navContent.querySelector('a.logo');
        const navLinks = navContent.querySelector('.nav-links');
        if (!logo || !navLinks) return;

        if (rtl) {
            // 1. DOM swap: move logo to end of flex container → RIGHT side
            navContent.appendChild(logo);
            // 2. Force inline !important styles so no CSS can override
            logo.style.setProperty('order', '99', 'important');
            logo.style.setProperty('margin-left', 'auto', 'important');
            navLinks.style.setProperty('order', '1', 'important');
            navLinks.style.setProperty('margin-left', '0', 'important');
            navContent.style.setProperty('flex-direction', 'row', 'important');
            navContent.style.setProperty('justify-content', 'space-between', 'important');
        } else {
            // 1. DOM swap: move logo back to start → LEFT side
            navContent.insertBefore(logo, navLinks);
            // 2. Reset all inline styles
            logo.style.removeProperty('order');
            logo.style.removeProperty('margin-left');
            navLinks.style.removeProperty('order');
            navLinks.style.removeProperty('margin-left');
            navContent.style.removeProperty('flex-direction');
            navContent.style.removeProperty('justify-content');
        }
    }

    if (isRTL) {
        document.documentElement.setAttribute('dir', 'rtl');
        swapNavbarLogo(true);
        updateRTLButtons(true);
    }

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentRTL = document.documentElement.getAttribute('dir') === 'rtl';
            if (currentRTL) {
                document.documentElement.removeAttribute('dir');
                localStorage.setItem('rtl', 'false');
                swapNavbarLogo(false);
                updateRTLButtons(false);
            } else {
                document.documentElement.setAttribute('dir', 'rtl');
                localStorage.setItem('rtl', 'true');
                swapNavbarLogo(true);
                updateRTLButtons(true);
            }
        });
    });

    function updateRTLButtons(rtl) {
        rtlToggles.forEach(btn => {
            btn.textContent = rtl ? 'LTR' : 'RTL';
        });
    }

    // 2. Mobile Menu Toggle - REMOVED (User Request)

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Reading Progress Bar (if exists)
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // 6. Form Validation (Generic)
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // 7. Search Overlay Logic (Placeholder for interactive search)
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchOverlay.querySelector('input').focus();
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') searchOverlay.classList.remove('active');
        });
    }

    // 8. Site-Wide 3D Card Tilt Effect
    function setupCardTilt() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            let isHovered = false;
            let mouseX = 0, mouseY = 0;
            let currentX = 0, currentY = 0;
            let angle = 0;

            card.addEventListener('mousemove', (e) => {
                isHovered = true;
                const rect = card.getBoundingClientRect();
                
                // Mouse position relative to card center (-1 to 1)
                mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                
                // Update Glow Position variables for CSS
                const glowX = (e.clientX - rect.left) / rect.width * 100;
                const glowY = (e.clientY - rect.top) / rect.height * 100;
                card.style.setProperty('--glow-x', `${glowX}%`);
                card.style.setProperty('--glow-y', `${glowY}%`);
            });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                // Reset tilt smoothly in the animation loop
            });

            function animate() {
                // Autonomous subtle idle motion
                angle += 0.015;
                
                // Magnetic lag/interpolation for smoother movement
                currentX += (mouseX - currentX) * 0.1;
                currentY += (mouseY - currentY) * 0.1;

                if (isHovered) {
                    const rotX = -currentY * 15; // Max 15 degree tilt
                    const rotY = currentX * 15;
                    card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
                } else {
                    // Smoothly return to zero
                    const rotX = currentY * 0; 
                    const rotY = currentX * 0;
                    card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                    mouseX = 0; mouseY = 0;
                }
                
                if (isHovered || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
                    requestAnimationFrame(animate);
                } else {
                    // Stop animation loop when idle to save resources
                    card.dataset.animating = 'false';
                }
            }

            // Start animation loop on hover
            card.addEventListener('mouseenter', () => {
                if (card.dataset.animating !== 'true') {
                    card.dataset.animating = 'true';
                    requestAnimationFrame(animate);
                }
            });
        });
    }

    setupCardTilt();
});
