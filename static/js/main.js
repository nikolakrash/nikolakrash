document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileMenuBreakpoint = window.matchMedia('(max-width: 991px)');

    function setMobileMenuState(isOpen) {
        if (!navbarCollapse || !navbarToggler) return;
        navbarCollapse.classList.toggle('show', isOpen);
        navbarToggler.setAttribute('aria-expanded', String(isOpen));
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            e.preventDefault();
            const headerOffset = 80;
            const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });

            setMobileMenuState(false);
        });
    });

    if (navbarToggler && navbarCollapse) {
        setMobileMenuState(false);

        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = !navbarCollapse.classList.contains('show');
            setMobileMenuState(isOpen);
        });

        document.addEventListener('click', function(e) {
            if (!mobileMenuBreakpoint.matches) return;
            if (navbarCollapse.contains(e.target) || navbarToggler.contains(e.target)) return;
            setMobileMenuState(false);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                setMobileMenuState(false);
            }
        });

        mobileMenuBreakpoint.addEventListener('change', function(event) {
            if (!event.matches) {
                setMobileMenuState(false);
            }
        });
    }

    let ticking = false;
    const updateNavbarState = () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        ticking = false;
    };

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbarState);
            ticking = true;
        }
    }, { passive: true });
    updateNavbarState();

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.advantage-item').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    const featuresObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target;
            const title = section.querySelector('.section-title');
            const subtitle = section.querySelector('.section-subtitle');
            const cards = section.querySelectorAll('.feature-card');

            if (title && !title.classList.contains('animated')) {
                title.classList.add('animated');
            }
            if (subtitle && !subtitle.classList.contains('animated')) {
                subtitle.classList.add('animated');
            }
            cards.forEach((card, index) => {
                if (card.classList.contains('animated')) return;
                card.classList.add('animated');
                card.style.animationDelay = `${0.4 + (index * 0.1)}s`;
            });

            featuresObserver.unobserve(section);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
        featuresObserver.observe(featuresSection);
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(target * progress);
            element.textContent = value + (target >= 1000 ? '+' : '');
            if (progress < 1) {
                window.requestAnimationFrame(tick);
            } else {
                element.textContent = target + (target >= 1000 ? '+' : '');
            }
        }

        window.requestAnimationFrame(tick);
    }

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.target.classList.contains('animated')) return;
            entry.target.classList.add('animated');
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-number').forEach((stat) => {
        statsObserver.observe(stat);
    });

    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo && window.innerWidth >= 992 && !reducedMotion) {
        const loadHeroVideo = () => {
            if (heroVideo.dataset.loaded === 'true') return;
            const source = document.createElement('source');
            source.src = heroVideo.dataset.src;
            source.type = 'video/mp4';
            heroVideo.appendChild(source);
            heroVideo.dataset.loaded = 'true';
            heroVideo.load();
            heroVideo.play().catch(() => {});
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadHeroVideo, { timeout: 2500 });
        } else {
            window.setTimeout(loadHeroVideo, 1800);
        }
    }

    const spotlight = document.querySelector('.spotlight-effect');
    if (spotlight && window.innerWidth >= 992 && !reducedMotion) {
        let spotlightFrame = null;
        document.addEventListener('mousemove', function(e) {
            if (spotlightFrame) return;
            spotlightFrame = window.requestAnimationFrame(() => {
                spotlight.style.opacity = '1';
                spotlight.style.left = e.clientX + 'px';
                spotlight.style.top = e.clientY + 'px';
                spotlightFrame = null;
            });
        }, { passive: true });

        document.addEventListener('mouseleave', function() {
            spotlight.style.opacity = '0';
        });
    }

    const loadMetrika = () => {
        if (window.__tbMetrikaLoaded) return;
        window.__tbMetrikaLoaded = true;

        window.ym = window.ym || function() {
            (window.ym.a = window.ym.a || []).push(arguments);
        };
        window.ym.l = 1 * new Date();

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js?id=106787616';
        document.head.appendChild(script);

        const pixel = document.createElement('img');
        pixel.src = 'https://mc.yandex.ru/pixel/1849719515133889046?rnd=' + Math.floor(Math.random() * 1000000000);
        pixel.style.position = 'absolute';
        pixel.style.left = '-9999px';
        pixel.style.width = '1px';
        pixel.style.height = '1px';
        pixel.style.opacity = '0';
        pixel.alt = '';
        pixel.setAttribute('aria-hidden', 'true');
        document.body.appendChild(pixel);

        window.ym(106787616, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: 'dataLayer',
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true
        });
    };

    const metrikaTrigger = () => {
        loadMetrika();
        window.removeEventListener('pointerdown', metrikaTrigger);
        window.removeEventListener('keydown', metrikaTrigger);
        window.removeEventListener('scroll', metrikaTrigger);
    };

    window.addEventListener('pointerdown', metrikaTrigger, { passive: true, once: true });
    window.addEventListener('keydown', metrikaTrigger, { once: true });
    window.addEventListener('scroll', metrikaTrigger, { passive: true, once: true });
    window.setTimeout(loadMetrika, 8000);
});
