// Utilities
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

// Year in footer
(() => {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Mobile nav toggle
(() => {
    const toggleBtn = $('#navToggle');
    const list = $('#navList');
    if (!toggleBtn || !list) return;

    const toggle = () => {
        const isOpen = list.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
    };
    toggleBtn.addEventListener('click', toggle);

    // Close on link click (mobile)
    $$('.nav-link', list).forEach((a) => a.addEventListener('click', () => {
        list.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }));
})();

// Smooth-scroll offset handling for sticky header
(() => {
    const header = $('#header');
    const links = $$('.nav-link');
    if (!header || !links.length) return;
    const headerOffset = () => header.getBoundingClientRect().height;

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = $(href);
            if (!target) return;
            e.preventDefault();
            const y = target.getBoundingClientRect().top + window.scrollY - (headerOffset() - 4);
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });
})();

// Scroll-to-top button
(() => {
    const btn = $('#scrollTop');
    if (!btn) return;
    const onScroll = () => {
        if (window.scrollY > 400) btn.classList.add('visible');
        else btn.classList.remove('visible');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
})();

// Reveal on scroll (IntersectionObserver)
(() => {
    const elements = $$('.reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elements.forEach((el) => observer.observe(el));
})();

// Animate skills grid when in view
(() => {
    const skillsSection = $('#skills');
    if (!skillsSection) return;
    const grid = skillsSection.querySelector('.skills-grid');
    if (!grid) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                grid.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    obs.observe(skillsSection);
})();

// Animate projects grid when in view
(() => {
    const projectsSection = $('#projects');
    if (!projectsSection) return;
    const grid = projectsSection.querySelector('.projects-grid');
    if (!grid) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                grid.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    obs.observe(projectsSection);
})();

// Dynamic projects rendering
(() => {
    const grid = $('#projectsGrid');
    if (!grid) return;

    /**
     * Add or edit projects here. Provide image, title, stack, description, and optional links.
     */
    const projectsData = [
        {
            image: 'assets/Screenshot 2025-10-31 020141.png',
            imageAlt: 'Online Food Delivery System screenshot',
            title: 'Online Food Delivery System',
            stack: 'Java, JSP, Servlets, JDBC, MySQL',
            description: 'Users browse menus, order food, and track orders with auth and admin tools.',
            links: [{ label: 'View Repo', href: '#', primary: false }],
        },
        {
            image: 'assets/image.png',
            imageAlt: 'Vehicle Service System screenshot',
            title: 'Vehicle Service System',
            stack: 'HTML, CSS, JS, MySQL',
            description: 'Booking and managing vehicle services with scheduling and service history.',
            links: [{ label: 'View Repo', href: '#', primary: false }],
        },
        {
            image: 'assets/todo.png',
            imageAlt: 'Todo Summary Assistant screenshot',
            title: 'Todo Summary Assistant',
            stack: 'JavaScript + API Integration',
            description: 'Summarizes todo lists via API for quick overviews and status insights.',
            links: [{ label: 'View Demo', href: '#', primary: true }],
        },
        {
            image: 'assets/Screenshot 2025-10-30 232239.png',
            imageAlt: 'Earthquake Equalizer screenshot',
            title: 'Earthquake Equalizer',
            stack: 'React, Tailwind CSS, JavaScript',
            description: 'Real-time seismic data visualizer with responsive UI and interactive charts.',
            links: [
                { label: 'View Repo', href: '#', primary: false },
                { label: 'Live Preview', href: 'https://amitpatel-er-01.github.io/earthquake-visualizer-react-tailwind/', primary: true }
            ],
        },

    ];

    const createProjectCard = (p) => {
        const article = document.createElement('article');
        article.className = 'project-card';

        const imgWrap = document.createElement('div');
        imgWrap.className = 'project-image-wrap';
        const img = document.createElement('img');
        img.className = 'project-image';
        // URL-encode to support filenames with spaces
        img.src = encodeURI(p.image);
        img.alt = p.imageAlt || p.title;
        img.loading = 'lazy';
        imgWrap.appendChild(img);

        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = p.title;

        const stack = document.createElement('p');
        stack.className = 'project-stack';
        stack.textContent = p.stack;

        const desc = document.createElement('p');
        desc.className = 'project-desc';
        desc.textContent = p.description;

        const actions = document.createElement('div');
        actions.className = 'project-actions';
        (p.links || []).forEach((link) => {
            const a = document.createElement('a');
            a.className = `btn btn-small ${link.primary ? 'btn-primary' : ''}`.trim();
            a.href = link.href || '#';
            a.textContent = link.label || 'View';
            if (a.href && a.href !== '#') {
                a.target = '_blank'; a.rel = 'noopener';
            } else {
                a.setAttribute('aria-disabled', 'true');
            }
            actions.appendChild(a);
        });

        article.append(imgWrap, title, stack, desc, actions);
        return article;
    };

    const fragment = document.createDocumentFragment();
    projectsData.forEach((p) => fragment.appendChild(createProjectCard(p)));
    grid.appendChild(fragment);
})();

// EmailJS contact form submission
(() => {
    const form = $('#contactForm');
    const statusEl = $('#formStatus');
    const sendBtn = $('#sendBtn');
    if (!form || !statusEl || !sendBtn) return;

    // Initialize EmailJS with your Public Key
    // Replace 'YOUR_PUBLIC_KEY' with your actual public key from EmailJS dashboard
    if (window.emailjs) {
        emailjs.init('YOUR_PUBLIC_KEY');
    }

    const setStatus = (msg, type = 'info') => {
        statusEl.textContent = msg;
        statusEl.style.color = type === 'error' ? '#fca5a5' : type === 'success' ? '#86efac' : '';
    };

    const disableForm = (disabled) => {
        Array.from(form.elements).forEach((el) => (el.disabled = disabled));
        sendBtn.textContent = disabled ? 'Sending…' : 'Send Message';
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = $('#name').value.trim();
        const email = $('#email').value.trim();
        const message = $('#message').value.trim();
        if (!name || !email || !message) {
            setStatus('Please fill out all fields.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('Please enter a valid email.', 'error');
            return;
        }

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
        };

        // Configure your EmailJS credentials here
        const serviceId = 'service_pn8e98l';
        const templateId = 'template_otwkkhq';
        const publicKey = 'nI0-Qjjof_mVe3Gln';

        // Helpful guard: if placeholders are not replaced, show guidance instead of failing silently
        const looksUnconfigured = [serviceId, templateId, publicKey].some((v) => typeof v === 'string' && v.startsWith('YOUR_'));

        try {
            disableForm(true);
            setStatus('Sending…');

            if (looksUnconfigured) {
                throw new Error('EmailJS not configured. Replace YOUR_* values in script.js');
            }

            // Send via EmailJS
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            setStatus('Message sent successfully! I will get back to you soon.', 'success');
            form.reset();
        } catch (err) {
            console.error(err);
            if (looksUnconfigured) {
                setStatus('Contact form not configured. Add your EmailJS keys in script.js.', 'error');
            } else if (typeof err === 'object' && err && err.text) {
                setStatus(String(err.text), 'error');
            } else {
                setStatus('Something went wrong. Please try again later.', 'error');
            }
        } finally {
            disableForm(false);
        }
    });
})();


