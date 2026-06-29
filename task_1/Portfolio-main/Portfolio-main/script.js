/* ╔══════════════════════════════════════════════════════════╗
   ║  Aryan Rane — Portfolio Scripts                          ║
   ╚══════════════════════════════════════════════════════════╝ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Mumbai time in nav ───
    const timeEl = document.getElementById('nav-time');
    const updateTime = () => {
        if (!timeEl) return;
        const t = new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        });
        timeEl.textContent = `Mumbai · ${t}`;
    };
    updateTime();
    setInterval(updateTime, 30000);

    // ─── Footer year ───
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ─── Mobile menu toggle ───
    const menuBtn  = document.getElementById('navMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        const openMenu = () => {
            menuBtn.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        const closeMenu = () => {
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            isOpen ? closeMenu() : openMenu();
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // ─── Header shadow on scroll ───
    const header = document.getElementById('main-header');
    const onScroll = () => {
        if (!header) return;
        header.style.boxShadow = window.scrollY > 8
            ? '0 1px 0 rgba(0,0,0,0.04)'
            : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ─── Reveal-on-scroll ───
    const revealEls = document.querySelectorAll(
        '.about-body p, .skill-card, .work-list li, .stat, .contact-link, .currently-item'
    );
    revealEls.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition =
            'opacity 0.8s cubic-bezier(0.2, 0.7, 0.2, 1), ' +
            'transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1)';
    });

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, i * 60);
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));

    // ─── Infinite Ticker ───
    (() => {
        const ITEMS = [
            'Full Stack Dev',
            'Decode Labs Intern',
            'Data Science',
            'Product Design',
            'AI Tooling',
            'Open to Work',
            'Systems Thinking',
            'TypeScript',
            'React',
            'Mumbai, IN',
        ];
        const SEP        = '✦';
        const SPEED      = 90;
        const SMOOTH_TAU = 0.25;

        const ticker = document.getElementById('ticker');
        const track  = document.getElementById('tickerTrack');
        if (!ticker || !track) return;

        const buildList = (ariaHidden) => {
            const ul = document.createElement('ul');
            ul.className = 'ticker__list';
            if (ariaHidden) ul.setAttribute('aria-hidden', 'true');
            ITEMS.forEach((label) => {
                const li = document.createElement('li');
                li.className = 'ticker__item';
                li.textContent = label;
                ul.appendChild(li);
                const sep = document.createElement('span');
                sep.className = 'ticker__sep';
                sep.textContent = SEP;
                sep.setAttribute('aria-hidden', 'true');
                ul.appendChild(sep);
            });
            return ul;
        };

        const firstList = buildList(false);
        track.appendChild(firstList);
        track.appendChild(buildList(true));

        let seqWidth = 0;
        let offset   = 0;
        let velocity = SPEED;
        let target   = SPEED;
        let lastTs   = null;

        const ensureCopies = () => {
            seqWidth = firstList.getBoundingClientRect().width;
            if (seqWidth === 0) return;
            const needed = Math.ceil(ticker.clientWidth / seqWidth) + 2;
            while (track.children.length < needed) track.appendChild(buildList(true));
        };

        const animate = (ts) => {
            if (lastTs === null) lastTs = ts;
            const dt   = Math.min((ts - lastTs) / 1000, 0.1);
            lastTs = ts;
            const ease = 1 - Math.exp(-dt / SMOOTH_TAU);
            velocity  += (target - velocity) * ease;
            if (seqWidth > 0) {
                offset = ((offset + velocity * dt) % seqWidth + seqWidth) % seqWidth;
                track.style.transform = `translate3d(${-offset}px, 0, 0)`;
            }
            requestAnimationFrame(animate);
        };

        ticker.addEventListener('mouseenter', () => { target = 0; });
        ticker.addEventListener('mouseleave', () => { target = SPEED; });

        if (window.ResizeObserver) new ResizeObserver(ensureCopies).observe(ticker);

        requestAnimationFrame(() => {
            ensureCopies();
            requestAnimationFrame(animate);
        });
    })();

    // ─── Typewriter rotating word ───
    (() => {
        const el = document.getElementById('rotatingWord');
        if (!el) return;

        const words = ['quiet', 'precise', 'honest', 'focused', 'lasting', 'human'];
        let wordIdx  = 0;
        let charIdx  = 0;
        let deleting = false;

        const TYPE_SPEED   = 90;
        const DELETE_SPEED = 55;
        const HOLD_MS      = 1800;

        const tick = () => {
            const word = words[wordIdx];
            if (!deleting) {
                charIdx++;
                el.textContent = word.slice(0, charIdx);
                if (charIdx === word.length) {
                    deleting = true;
                    setTimeout(tick, HOLD_MS);
                    return;
                }
                setTimeout(tick, TYPE_SPEED);
            } else {
                charIdx--;
                el.textContent = word.slice(0, charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    wordIdx  = (wordIdx + 1) % words.length;
                    setTimeout(tick, TYPE_SPEED);
                    return;
                }
                setTimeout(tick, DELETE_SPEED);
            }
        };

        setTimeout(tick, 1200);
    })();

    // ─── Active nav link highlight on scroll ───
    (() => {
        const sections = document.querySelectorAll('section[id], div[id="top"]');
        const navLinks = document.querySelectorAll('.nav-links a');
        if (!navLinks.length) return;

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.id === 'top' ? 'top' : entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href').replace('#', '');
                        link.style.color = (href === id || (id === 'top' && href === 'top'))
                            ? 'var(--white)'
                            : '';
                    });
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );

        sections.forEach(s => sectionObserver.observe(s));
    })();

});
