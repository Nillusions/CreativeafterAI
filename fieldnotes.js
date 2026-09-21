/**
 * Creative after AI — Fieldnotes Logic
 * Powers the homepage latest 4 blogs, the fieldnotes archive, and the long-form reader.
 */

const FIELDNOTES_WORKER_URL = 'https://notion-tools-proxy.alenthomas2898.workers.dev/api/fieldnotes';

// Helper to get fallback/seed articles
function getLocalFieldnotes() {
    return window.FIELDNOTES_DATA || [];
}

// Fetch all articles (tries Notion Cloudflare Worker first, falls back immediately to local data)
async function fetchAllFieldnotes() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s quick timeout

        const res = await fetch(FIELDNOTES_WORKER_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            if (data.articles && data.articles.length > 0) {
                // Merge worker articles with local articles to guarantee full rich content
                const local = getLocalFieldnotes();
                const merged = data.articles.map(remote => {
                    const match = local.find(l => l.slug === remote.slug || l.id === remote.id);
                    return match ? { ...match, ...remote } : remote;
                });
                return merged;
            }
        }
    } catch (e) {
        // Fallback gracefully without console error spam
    }
    return getLocalFieldnotes();
}

// =========================================
// HOMEPAGE: RENDER LATEST 4 FIELDNOTES
// =========================================
async function initHomepageFieldnotes() {
    const grid = document.getElementById('latest-fieldnotes-grid');
    if (!grid) return;

    const articles = await fetchAllFieldnotes();
    const latestFour = articles.slice(0, 4);

    if (latestFour.length === 0) {
        grid.innerHTML = '<div class="loader-text" style="grid-column: 1/-1; text-align: center;">No fieldnotes available yet.</div>';
        return;
    }

    grid.innerHTML = latestFour.map((note) => `
        <a href="fieldnote.html?id=${note.slug || note.id}" class="fieldnote-card reveal">
            <div class="fieldnote-card-media">
                <img src="${note.coverImage || 'fieldnotes-data/images/director-mindset.jpg'}" alt="${note.title}" loading="lazy" class="fieldnote-card-img">
                <span class="fieldnote-category-tag" style="--tag-color: ${note.color || '#C8E64E'};">${note.category || 'Article'}</span>
            </div>
            <div class="fieldnote-card-body">
                <div class="fieldnote-card-meta">
                    <span>${note.date || 'Recent'}</span>
                    <span class="meta-dot">·</span>
                    <span>${note.readTime || '5 min read'}</span>
                </div>
                <h3 class="fieldnote-card-title">${note.title}</h3>
                <p class="fieldnote-card-excerpt">${note.excerpt || ''}</p>
                <div class="fieldnote-card-footer">
                    <span class="fieldnote-read-link">
                        Read Note
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                </div>
            </div>
        </a>
    `).join('');

    if (typeof observeRevealElements === 'function') observeRevealElements();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =========================================
// ARCHIVE PAGE: LISTING & FILTERING
// =========================================
let allArticlesList = [];
let activeCategory = 'all';

async function initFieldnotesArchive() {
    const grid = document.getElementById('fieldnotes-archive-grid');
    if (!grid) return;

    allArticlesList = await fetchAllFieldnotes();
    setupCategoryPills();
    setupSearchInput();
    renderArchiveGrid();
}

function setupCategoryPills() {
    const container = document.getElementById('fieldnotes-categories');
    if (!container) return;

    // Extract unique categories
    const categories = ['all', ...new Set(allArticlesList.map(a => a.category).filter(Boolean))];

    container.innerHTML = categories.map(cat => `
        <button class="category-pill ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
    `).join('');

    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-pill');
        if (!btn) return;
        activeCategory = btn.dataset.category;
        container.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderArchiveGrid();
    });
}

function setupSearchInput() {
    const search = document.getElementById('fieldnotes-search-input');
    if (!search) return;

    search.addEventListener('input', () => {
        renderArchiveGrid();
    });
}

function renderArchiveGrid() {
    const grid = document.getElementById('fieldnotes-archive-grid');
    const search = document.getElementById('fieldnotes-search-input');
    const term = search ? search.value.trim().toLowerCase() : '';

    let filtered = allArticlesList.filter(note => {
        const matchesCategory = activeCategory === 'all' || (note.category && note.category.toLowerCase() === activeCategory.toLowerCase());
        if (!matchesCategory) return false;

        if (!term) return true;
        const titleMatch = (note.title || '').toLowerCase().includes(term);
        const excerptMatch = (note.excerpt || '').toLowerCase().includes(term);
        const tagMatch = (note.tags || []).some(t => t.toLowerCase().includes(term));
        return titleMatch || excerptMatch || tagMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="fieldnotes-empty-state">
                <div class="empty-icon"><i data-lucide="search-x"></i></div>
                <h3>No fieldnotes found</h3>
                <p>Try searching for a different keyword or resetting your category filter.</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    grid.innerHTML = filtered.map((note) => `
        <article class="fieldnote-card archive-card reveal">
            <a href="fieldnote.html?id=${note.slug || note.id}" class="fieldnote-card-link-overlay"></a>
            <div class="fieldnote-card-media">
                <img src="${note.coverImage || 'fieldnotes-data/images/director-mindset.jpg'}" alt="${note.title}" loading="lazy" class="fieldnote-card-img">
                <span class="fieldnote-category-tag" style="--tag-color: ${note.color || '#C8E64E'};">${note.category || 'Article'}</span>
            </div>
            <div class="fieldnote-card-body">
                <div class="fieldnote-card-meta">
                    <span>${note.date || 'Recent'}</span>
                    <span class="meta-dot">·</span>
                    <span>${note.readTime || '5 min read'}</span>
                </div>
                <h2 class="fieldnote-card-title">${note.title}</h2>
                <p class="fieldnote-card-excerpt">${note.excerpt || ''}</p>
                <div class="fieldnote-tags-list">
                    ${(note.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
                </div>
                <div class="fieldnote-card-footer">
                    <span class="fieldnote-read-link">
                        Read Full Note
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                </div>
            </div>
        </article>
    `).join('');

    if (typeof observeRevealElements === 'function') observeRevealElements();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =========================================
// SINGLE ARTICLE READER: RENDER & INTERACTIONS
// =========================================
async function initArticleReader() {
    const articleContainer = document.getElementById('fieldnote-article-container');
    if (!articleContainer) return;

    const params = new URLSearchParams(window.location.search);
    const idOrSlug = params.get('id') || params.get('slug');

    const articles = await fetchAllFieldnotes();
    const article = articles.find(a => (a.slug === idOrSlug || a.id === idOrSlug)) || articles[0];

    if (!article) {
        window.location.href = 'fieldnotes.html';
        return;
    }

    // Set page title
    document.title = `${article.title} — Fieldnotes | Creative after AI`;

    // Render Article Header
    const headerEl = document.getElementById('article-header');
    if (headerEl) {
        headerEl.innerHTML = `
            <a href="fieldnotes.html" class="reader-back-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back to Fieldnotes
            </a>
            <div class="article-meta-badge-row">
                <span class="reader-category-badge" style="background-color: ${article.color || '#C8E64E'};">${article.category || 'Dispatches'}</span>
                <span class="reader-meta-item">${article.date || 'Recent'}</span>
                <span class="reader-meta-divider"></span>
                <span class="reader-meta-item">${article.readTime || '5 min read'}</span>
            </div>
            <h1 class="reader-article-title">${article.title}</h1>
            ${article.subtitle ? `<p class="reader-article-subtitle">${article.subtitle}</p>` : ''}
            
            <div class="reader-author-bar">
                <div class="author-info">
                    <img src="${article.author?.avatar || 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%23C8E64E\'/><text x=\'50%\' y=\'58%\' font-size=\'42\' font-weight=\'bold\' text-anchor=\'middle\' fill=\'%230e0e0e\'>AT</text></svg>'}" alt="${article.author?.name || 'Alen'}" class="author-avatar">
                    <div>
                        <div class="author-name">${article.author?.name || 'Alen Thomas'}</div>
                        <div class="author-role">${article.author?.role || 'Creative after AI'}</div>
                    </div>
                </div>
                <div class="reader-actions">
                    <button class="share-btn" onclick="copyCurrentArticleUrl(this)" title="Copy link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        <span>Share</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Render Cover Image
    const coverEl = document.getElementById('article-cover');
    if (coverEl && article.coverImage) {
        coverEl.innerHTML = `<img src="${article.coverImage}" alt="${article.title}" class="reader-hero-img">`;
    }

    // Render Body Content
    const bodyEl = document.getElementById('article-body');
    if (bodyEl) {
        bodyEl.innerHTML = article.content || `<p>${article.excerpt || 'Full text loading...'}</p>`;
    }

    // Render Next / Prev Footer Navigation
    const navEl = document.getElementById('article-footer-nav');
    if (navEl) {
        const currentIndex = articles.findIndex(a => (a.slug === article.slug || a.id === article.id));
        const prevNote = currentIndex > 0 ? articles[currentIndex - 1] : null;
        const nextNote = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

        navEl.innerHTML = `
            ${prevNote ? `
                <a href="fieldnote.html?id=${prevNote.slug || prevNote.id}" class="footer-note-link prev">
                    <span class="direction-label">← Previous Fieldnote</span>
                    <span class="note-nav-title">${prevNote.title}</span>
                </a>
            ` : '<div class="footer-note-link-placeholder"></div>'}
            ${nextNote ? `
                <a href="fieldnote.html?id=${nextNote.slug || nextNote.id}" class="footer-note-link next">
                    <span class="direction-label">Next Fieldnote →</span>
                    <span class="note-nav-title">${nextNote.title}</span>
                </a>
            ` : '<div class="footer-note-link-placeholder"></div>'}
        `;
    }

    // Initialize Scroll Reading Progress Indicator
    initReadingProgressBar();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Reading progress bar updater
function initReadingProgressBar() {
    const bar = document.getElementById('reading-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const progress = (window.scrollY / docHeight) * 100;
            bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    }, { passive: true });
}

// Copy prompt snippet helper
function copyPromptCard(btn) {
    const card = btn.closest('.prompt-box');
    const content = card ? card.querySelector('.prompt-content').innerText.trim() : '';
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied ✓';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('copied');
        }, 2000);
    });
}

// Copy share link helper with toast
function copyCurrentArticleUrl(btn) {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>Copied!</span>`;
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.classList.remove('copied');
        }, 2000);
    });
}

// Auto-run appropriate initializer on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('latest-fieldnotes-grid')) {
        initHomepageFieldnotes();
    }
    if (document.getElementById('fieldnotes-archive-grid')) {
        initFieldnotesArchive();
    }
    if (document.getElementById('fieldnote-article-container')) {
        initArticleReader();
    }
});
