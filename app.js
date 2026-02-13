/* =========================================
   Creative After AI — Application Logic
   ========================================= */

// =========================================
// ICON HELPER (uses Lucide Icons via CDN)
// Browse all icons at: https://lucide.dev/icons
// =========================================
function getIcon(name) {
    return `<i data-lucide="${name || 'sparkles'}"></i>`;
}

// =========================================
// DATA SOURCE (uses script-tag loading)
// =========================================
function getManifest() {
    return window.MODULES_MANIFEST || [];
}

function loadModule(moduleId) {
    return new Promise((resolve) => {
        // Check if already loaded
        if (window.LOADED_MODULE && window.LOADED_MODULE.id === moduleId) {
            resolve(window.LOADED_MODULE);
            return;
        }

        const script = document.createElement('script');
        script.src = `modules-data/module-${moduleId}.js`;
        script.onload = () => resolve(window.LOADED_MODULE || null);
        script.onerror = () => {
            console.error(`Failed to load module: ${moduleId}`);
            resolve(null);
        };
        document.head.appendChild(script);
    });
}

// =========================================
// HOMEPAGE: RENDER CARDS
// =========================================
function renderModuleCards(modules) {
    const grid = document.getElementById('modules-grid');
    if (!grid) return;

    const activeModules = modules.filter(m => !m.comingSoon);
    const hasComingSoon = modules.some(m => m.comingSoon);

    let html = activeModules.map(mod => `
    <a href="module.html?id=${mod.id}" class="module-card reveal" style="background-color: ${mod.color};" data-module-id="${mod.id}">
      <div class="card-icon" style="color: #1a1a1a;">
        ${getIcon(mod.icon)}
      </div>
      <div class="card-content">
        <div class="card-number">${mod.number}.</div>
        <h3 class="card-title">${mod.title}</h3>
        <p class="card-tagline">${mod.tagline}</p>
      </div>
      <div class="card-action">
        <span class="card-btn">
          See Inside
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        <span class="card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </span>
      </div>
    </a>`).join('');

    html += `
    <div class="module-card coming-soon reveal">
      <div class="coming-soon-content">
        <svg width="63" height="31" viewBox="0 0 63 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M61.9192 20.4207C62.1616 20.8417 62.2269 21.3418 62.1006 21.8109C61.9743 22.28 61.6669 22.6798 61.2458 22.9222C60.8248 23.1646 60.3248 23.2299 59.8556 23.1036C59.3865 22.9773 58.9868 22.6699 58.7444 22.2488L52.6506 11.5604C49.0472 14.0866 45.0238 15.9528 40.7678 17.0722L42.6477 28.3456C42.6874 28.5825 42.6801 28.8249 42.626 29.0589C42.572 29.293 42.4724 29.5141 42.3329 29.7096C42.1934 29.9051 42.0168 30.0712 41.8131 30.1985C41.6093 30.3257 41.3825 30.4115 41.1456 30.451C41.0448 30.4664 40.9429 30.4746 40.8409 30.4754C40.4092 30.475 39.9916 30.3218 39.662 30.0429C39.3324 29.7641 39.1122 29.3776 39.0402 28.952L37.1755 17.8126C33.1378 18.4468 29.0258 18.4468 24.988 17.8126L23.1355 28.952C23.0635 29.3781 22.8428 29.765 22.5126 30.0439C22.1824 30.3228 21.764 30.4757 21.3318 30.4754C21.2298 30.4746 21.1279 30.4664 21.0271 30.451C20.7902 30.4112 20.5634 30.325 20.3598 30.1974C20.1562 30.0698 19.9797 29.9034 19.8405 29.7076C19.7013 29.5117 19.602 29.2904 19.5484 29.0562C19.4948 28.822 19.4879 28.5795 19.528 28.3426L21.408 17.0692C17.152 15.9498 13.1286 14.0835 9.52514 11.5574L3.41921 22.2488C3.17678 22.6699 2.77704 22.9773 2.30792 23.1036C1.8388 23.2299 1.33873 23.1646 0.917722 22.9222C0.496712 22.6798 0.189247 22.28 0.062968 21.8109C-0.0633114 21.3418 0.00193877 20.8417 0.244363 20.4207L6.5971 9.30572C4.33706 7.39867 2.26486 5.27954 0.408894 2.97736C0.104247 2.59998 -0.0380105 2.11705 0.0134155 1.63478C0.0648415 1.15252 0.305739 0.710441 0.683113 0.405794C1.06049 0.101147 1.54342 -0.0411108 2.02569 0.0103152C2.50795 0.0617412 2.95003 0.302639 3.25467 0.680013C8.39475 7.04798 17.3922 14.6317 31.0818 14.6317C44.7714 14.6317 53.7688 7.04798 58.9089 0.686108C59.2135 0.308734 59.6556 0.0678362 60.1379 0.0164103C60.6201 -0.0350157 61.1031 0.107242 61.4805 0.411889C61.8578 0.716536 62.0987 1.15861 62.1502 1.64088C62.2016 2.12314 62.0593 2.60608 61.7547 2.98345C59.8987 5.28563 57.8265 7.40476 55.5665 9.31181L61.9192 20.4207Z" fill="rgba(255,255,255,0.3)"/>
        </svg>
        <span class="coming-soon-text">Coming Soon</span>
      </div>
    </div>`;

    grid.innerHTML = html;
    observeRevealElements();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =========================================
// MODULE PAGE: RENDER
// =========================================

// Tab icon mapping — maps tab names to Lucide icon names
const TAB_ICONS = {
    introduction: 'file-text',
    overview: 'file-text',
    techniques: 'lightbulb',
    tools: 'settings',
    examples: 'play-circle',
    prompts: 'message-square',
    task: 'clipboard-check',
    resources: 'book-open',
    process: 'git-branch',
    research: 'search',
    strategy: 'target',
    workflow: 'workflow',
    default: 'circle'
};

function getTabIcon(tabName) {
    return TAB_ICONS[tabName.toLowerCase()] || TAB_ICONS.default;
}

function renderModulePage(module, allModules) {
    const header = document.getElementById('module-header');
    const tabBar = document.getElementById('module-tabs');
    const contentArea = document.getElementById('tab-content-area');
    const footerNav = document.getElementById('module-footer-nav');

    if (!header || !module) return;

    // --- Header ---
    header.style.backgroundColor = module.color;
    header.innerHTML = `
    <a href="index.html#modules" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Back
    </a>
    <div class="module-tag">Module ${module.number}</div>
    <h1 class="module-title">${module.title}</h1>
    <p class="module-subtitle">${module.tagline}</p>
    <div class="module-meta">
      <div class="meta-item">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        ${module.readTime || '10 min read'}
      </div>
      <div class="meta-divider"></div>
      <div class="meta-item">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        ${Object.keys(module.tabs || {}).length} sections
      </div>
    </div>
  `;

    // --- Tabs ---
    const tabNames = Object.keys(module.tabs || {});
    const tabLabels = tabNames.map(name => name.charAt(0).toUpperCase() + name.slice(1));

    tabBar.innerHTML = tabNames.map((name, i) => `
    <button class="tab ${i === 0 ? 'active' : ''}" data-tab="${name}">
      <i data-lucide="${getTabIcon(name)}" class="tab-icon"></i>
      ${tabLabels[i]}
    </button>
  `).join('');

    // --- Content Panels ---
    contentArea.innerHTML = tabNames.map((name, i) => `
    <div class="tab-panel ${i === 0 ? 'active' : ''}" data-panel="${name}">
      ${module.tabs[name] || '<p>Content coming soon...</p>'}
    </div>
  `).join('');

    // --- Footer Navigation ---
    if (footerNav && allModules) {
        const currentIndex = allModules.findIndex(m => m.id === module.id);
        const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
        const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

        footerNav.innerHTML = `
      ${prevModule ? `
        <a class="footer-nav-btn" href="module.html?id=${prevModule.id}">
          <span>←</span>
          <div>
            <span class="footer-nav-label">Previous</span>
            <span class="footer-nav-title">${prevModule.title}</span>
          </div>
        </a>
      ` : '<div></div>'}
      ${nextModule ? `
        <a class="footer-nav-btn next" href="module.html?id=${nextModule.id}">
          <div>
            <span class="footer-nav-label">Next Module</span>
            <span class="footer-nav-title">${nextModule.title}</span>
          </div>
          <span>→</span>
        </a>
      ` : '<div></div>'}
    `;
    }

    // --- Init Lucide icons ---
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- Tab switching ---
    tabBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab');
        if (!btn) return;

        const tabName = btn.dataset.tab;

        tabBar.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        contentArea.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.remove('active');
            if (p.dataset.panel === tabName) {
                p.classList.add('active');
            }
        });
    });
}

// =========================================
// MODULE PAGE: TOGGLE CARDS (techniques/examples)
// =========================================
function toggleCard(card) {
    card.classList.toggle('open');
}

// =========================================
// MODULE PAGE: COPY PROMPT
// =========================================
function copyPrompt(btn) {
    const text = btn.closest('.prompt-card').querySelector('.prompt-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied ✓';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// =========================================
// SCROLL REVEAL
// =========================================
function observeRevealElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// =========================================
// NAVBAR SCROLL EFFECT
// =========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// =========================================
// CUSTOM CURSOR
// =========================================
function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        dot.style.left = dotX - 4 + 'px';
        dot.style.top = dotY - 4 + 'px';
        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .module-card, .technique-card, .prompt-card, .tool-card, .example-card')) {
            dot.classList.add('active');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .module-card, .technique-card, .prompt-card, .tool-card, .example-card')) {
            dot.classList.remove('active');
        }
    });
}

// =========================================
// LOADER
// =========================================
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 600);
        }, 400);
    }
}

// =========================================
// SMOOTH LINK TRANSITIONS
// =========================================
function initPageTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.endsWith('.html') || href.includes('module.html'))) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const transition = document.querySelector('.page-transition');
                if (transition) {
                    transition.classList.add('active');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 400);
                } else {
                    window.location.href = href;
                }
            });
        }
    });
}

// =========================================
// INTERACTIVE PARTICLE BACKGROUND
// =========================================
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    const REVEAL_RADIUS = 180;
    const PARTICLE_COUNT_FACTOR = 0.00025;
    const DOT_SIZE = 2.5;

    function resize() {
        const hero = canvas.parentElement;
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
        createParticles();
    }

    function createParticles() {
        particles = [];
        const count = Math.floor(width * height * PARTICLE_COUNT_FACTOR);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                baseX: 0,
                baseY: 0,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
            });
            particles[i].baseX = particles[i].x;
            particles[i].baseY = particles[i].y;
        }
    }

    const hero = canvas.parentElement;
    hero.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < REVEAL_RADIUS * 1.2) {
                const force = (1 - dist / (REVEAL_RADIUS * 1.2)) * 0.4;
                p.x += dx * force * 0.02;
                p.y += dy * force * 0.02;
            }

            let alpha = 0;
            if (dist < REVEAL_RADIUS) {
                alpha = (1 - dist / REVEAL_RADIUS) * 0.7;
            }

            if (alpha > 0.01) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, DOT_SIZE, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 230, 78, ${alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const d2x = p2.x - mouse.x;
                    const d2y = p2.y - mouse.y;
                    const dist2 = Math.sqrt(d2x * d2x + d2y * d2y);
                    if (dist2 < REVEAL_RADIUS) {
                        const pdx = p.x - p2.x;
                        const pdy = p.y - p2.y;
                        const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
                        if (pDist < 60) {
                            const lineAlpha = (1 - pDist / 60) * alpha * 0.3;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(200, 230, 78, ${lineAlpha})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
}

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const isModulePage = window.location.pathname.includes('module.html') || document.getElementById('module-header');

    if (isModulePage) {
        const params = new URLSearchParams(window.location.search);
        const moduleId = params.get('id');

        if (!moduleId) {
            window.location.href = 'index.html';
            return;
        }

        const manifest = getManifest();
        const module = await loadModule(moduleId);

        if (module) {
            renderModulePage(module, manifest);
            document.title = `${module.title} — Creative after AI`;
        } else {
            window.location.href = 'index.html';
        }
    } else {
        const manifest = getManifest();
        renderModuleCards(manifest);
        initParticles();
    }

    initNavbarScroll();
    initCustomCursor();
    hideLoader();
    observeRevealElements();

    setTimeout(() => initPageTransitions(), 100);
});
