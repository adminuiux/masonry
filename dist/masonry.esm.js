/**
 * @adminuiux/masonry
 * AdminUIUX - Responsive Masonry Layout & Fullscreen Lightbox Gallery Plugin
 *
 * Lightweight, zero-dependency masonry layout engine with auto-aligning aspect ratios,
 * column spanning, and built-in interactive fullscreen photo slider/lightbox with touch swipe.
 * Works seamlessly in Browser (direct <script> / CDN), CommonJS, and ES Modules.
 *
 * @version 1.0.0
 * @author AdminUIUX
 * @license MIT
 */

if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        const exportsObj = factory();
        global.AdminUIUXMasonry = exportsObj.AdminUIUXMasonry;
        global.initMasonry = exportsObj.initMasonry;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    // Inject required styles once dynamically without requiring external CSS files
    function ensureLightboxStyles() {
        if (typeof document === 'undefined') return;
        if (document.getElementById('adminuiux-masonry-styles')) return;

        const style = document.createElement('style');
        style.id = 'adminuiux-masonry-styles';
        style.textContent = `
            .masonry-container,
            .adminuiux-masonry {
                position: relative;
                width: 100%;
                transition: height 0.3s ease;
            }
            .masonry-container .masonry-item,
            .masonry-container .adminuiux-masonry-item,
            .adminuiux-masonry .adminuiux-masonry-item,
            .adminuiux-masonry .masonry-item {
                position: absolute;
                box-sizing: border-box;
                transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease, width 0.3s ease;
            }
            .masonry-container[data-preview="true"] .masonry-item,
            .adminuiux-masonry[data-preview="true"] .adminuiux-masonry-item {
                cursor: pointer;
            }

            /* Lightbox Overlay */
            .adminuiux-lightbox-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 1090;
                background: transparent !important;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.28s ease, visibility 0.28s ease;
                user-select: none;
            }
            .adminuiux-lightbox-modal.show {
                opacity: 1;
                visibility: visible;
            }

            /* Animated Backdrop */
            .adminuiux-lightbox-modal .backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(10, 15, 26, 0.85);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                opacity: 0;
                transition: opacity 0.32s ease;
                z-index: 1;
                pointer-events: none;
            }
            .adminuiux-lightbox-modal.show .backdrop {
                opacity: 1;
            }

            .adminuiux-lightbox-topbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 1.5rem;
                color: #ffffff;
                z-index: 3;
                flex-shrink: 0;
                background: transparent !important;
                position: relative;
            }
            .adminuiux-lightbox-stage {
                position: relative;
                flex: 1 1 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: visible;
                padding: 0.5rem 1rem;
                max-height: 670px;
                background: transparent !important;
                z-index: 2;
                touch-action: none;
                user-select: none;
                -webkit-user-select: none;
            }
            .adminuiux-lightbox-img {
                max-width: 100%;
                max-height: calc(100vh - 220px);
                object-fit: contain;
                border-radius: var(--bs-border-radius, 0.75rem);
                box-shadow: 0 20px 40px rgba(0,0,0,0.6);
                transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease;
                touch-action: none;
                user-select: none;
                -webkit-user-select: none;
                -webkit-user-drag: none;
                -webkit-touch-callout: none;
                cursor: grab;
            }
            .adminuiux-lightbox-img:active {
                cursor: grabbing;
            }
            .adminuiux-lightbox-btn {
                background: rgba(255, 255, 255, 0.12);
                border: 1px solid rgba(255, 255, 255, 0.18);
                color: #ffffff;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 1.1rem;
            }
            .adminuiux-lightbox-btn:hover {
                background: rgba(255, 255, 255, 0.28);
                color: #ffffff;
            }
            .adminuiux-lightbox-btn.active {
                background: var(--adminuiux-primary, #3b82f6);
                border-color: var(--adminuiux-primary, #3b82f6);
            }
            .adminuiux-lightbox-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 5;
            }
            .adminuiux-lightbox-nav.prev { left: 1.5rem; }
            .adminuiux-lightbox-nav.next { right: 1.5rem; }
            .adminuiux-lightbox-bottom {
                flex-shrink: 0;
                padding: 0.75rem 1.5rem 1rem;
                color: #ffffff;
                z-index: 2;
                position: relative;
                background: transparent !important;
                margin-top: auto;
            }
            .adminuiux-lightbox-thumbs {
                display: flex;
                gap: 0.5rem;
                overflow-x: auto;
                padding: 0.5rem 0;
                scrollbar-width: thin;
                scrollbar-color: rgba(255,255,255,0.3) transparent;
                background: transparent !important;
            }
            .adminuiux-lightbox-thumbs.d-none {
                display: none !important;
            }
            .adminuiux-lightbox-thumbs::-webkit-scrollbar {
                height: 4px;
            }
            .adminuiux-lightbox-thumbs::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 4px;
            }
            .adminuiux-lightbox-thumb {
                width: 64px;
                height: 48px;
                border-radius: 0.5rem;
                object-fit: cover;
                cursor: pointer;
                opacity: 0.45;
                border: 2px solid transparent;
                transition: all 0.2s ease;
                flex-shrink: 0;
                background: transparent;
            }
            .adminuiux-lightbox-thumb.active {
                opacity: 1;
                border-color: var(--adminuiux-primary, #3b82f6);
                transform: scale(1.05);
            }
            .adminuiux-lightbox-thumb:hover {
                opacity: 0.85;
            }
            .adminuiux-lightbox-badge-primary {
                background-color: var(--adminuiux-primary, #3b82f6);
                color: #ffffff;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Lightbox Singleton Manager
     */
    const Lightbox = {
        element: null,
        imgEl: null,
        counterEl: null,
        titleEl: null,
        categoryEl: null,
        descEl: null,
        thumbsEl: null,
        items: [],
        currentIndex: 0,
        isZoomed: false,
        thumbPreview: true,

        init(options = {}) {
            if (this.element || typeof document === 'undefined') return;
            ensureLightboxStyles();

            // 1. Look for existing on-page lightbox element (enables full HTML customization)
            let modal = null;
            if (options.lightboxElement) {
                modal = options.lightboxElement;
            } else if (options.lightboxSelector) {
                modal = document.querySelector(options.lightboxSelector);
            } else {
                modal = document.getElementById('adminuiuxLightboxModal') || document.querySelector('.adminuiux-lightbox-modal');
            }

            // 2. If not already present in the DOM, dynamically inject the default structure
            if (!modal) {
                modal = document.createElement('div');
                modal.className = 'adminuiux-lightbox-modal';
                modal.id = 'adminuiuxLightboxModal';
                modal.innerHTML = `
                <div class="backdrop"></div>
                <div class="adminuiux-lightbox-topbar">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge adminuiux-lightbox-badge-primary rounded-pill px-3 py-1 font-monospace" id="adminuiuxLbCounter">1 / 1</span>
                        <span class="text-white-50 small ms-2 d-none d-sm-inline" id="adminuiuxLbCategory">Gallery</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="adminuiux-lightbox-btn adminuiux-lightbox-zoom" id="adminuiuxLbZoom" title="Toggle Zoom" aria-label="Zoom">
                            <i class="bi bi-zoom-in"></i>
                        </button>
                        <a href="#" class="adminuiux-lightbox-btn adminuiux-lightbox-download text-decoration-none" id="adminuiuxLbDownload" download title="Download Photo" aria-label="Download">
                            <i class="bi bi-download"></i>
                        </a>
                        <button type="button" class="adminuiux-lightbox-btn adminuiux-lightbox-fullscreen" id="adminuiuxLbFullscreen" title="Toggle Fullscreen" aria-label="Fullscreen">
                            <i class="bi bi-fullscreen"></i>
                        </button>
                        <button type="button" class="adminuiux-lightbox-btn adminuiux-lightbox-close" id="adminuiuxLbClose" title="Close Lightbox" aria-label="Close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>

                <div class="adminuiux-lightbox-stage" id="adminuiuxLbStage">
                    <button type="button" class="adminuiux-lightbox-btn adminuiux-lightbox-nav prev" id="adminuiuxLbPrev" aria-label="Previous image">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <img src="" alt="" class="adminuiux-lightbox-img" id="adminuiuxLbImage">
                    <button type="button" class="adminuiux-lightbox-btn adminuiux-lightbox-nav next" id="adminuiuxLbNext" aria-label="Next image">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>

                <div class="adminuiux-lightbox-bottom">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="text-white mb-0 fw-semibold" id="adminuiuxLbTitle">Image Preview</h6>
                            <p class="text-white-50 small mb-0" id="adminuiuxLbDesc"></p>
                        </div>
                    </div>
                    <div class="adminuiux-lightbox-thumbs" id="adminuiuxLbThumbs"></div>
                </div>
            `;
                document.body.appendChild(modal);
            }

            this.element = modal;
            this.imgEl = modal.querySelector('#adminuiuxLbImage, .adminuiux-lightbox-img');
            this.counterEl = modal.querySelector('#adminuiuxLbCounter, .adminuiux-lightbox-counter');
            this.titleEl = modal.querySelector('#adminuiuxLbTitle, .adminuiux-lightbox-title');
            this.categoryEl = modal.querySelector('#adminuiuxLbCategory, .adminuiux-lightbox-category');
            this.descEl = modal.querySelector('#adminuiuxLbDesc, .adminuiux-lightbox-desc');
            this.thumbsEl = modal.querySelector('#adminuiuxLbThumbs, .adminuiux-lightbox-thumbs');

            // Wire controls (with safe null-checks for customized on-page markup)
            const closeBtn = modal.querySelector('#adminuiuxLbClose, .adminuiux-lightbox-close');
            if (closeBtn) closeBtn.addEventListener('click', () => this.close());

            const prevBtn = modal.querySelector('#adminuiuxLbPrev, .adminuiux-lightbox-nav.prev');
            if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });

            const nextBtn = modal.querySelector('#adminuiuxLbNext, .adminuiux-lightbox-nav.next');
            if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

            const zoomBtn = modal.querySelector('#adminuiuxLbZoom, .adminuiux-lightbox-zoom');
            if (zoomBtn) {
                zoomBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleZoom();
                });
            }

            const fsBtn = modal.querySelector('#adminuiuxLbFullscreen, .adminuiux-lightbox-fullscreen');
            if (fsBtn) {
                fsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!document.fullscreenElement) {
                        modal.requestFullscreen().catch(() => { });
                    } else {
                        document.exitFullscreen().catch(() => { });
                    }
                });
            }

            // Swipe tracking & synthetic click suppression
            let justSwiped = false;
            let swipeTimer = null;
            const markSwiped = () => {
                justSwiped = true;
                if (swipeTimer) clearTimeout(swipeTimer);
                swipeTimer = setTimeout(() => {
                    justSwiped = false;
                }, 450);
            };

            // Close when clicking directly on backdrop/stage outside of image or controls
            // Use capture phase to intercept and discard any synthetic clicks produced by swipe/drag release
            modal.addEventListener('click', (e) => {
                if (justSwiped) {
                    justSwiped = false;
                    e.stopPropagation();
                    return;
                }
                if (e.target === modal || e.target.id === 'adminuiuxLbStage' || e.target.classList.contains('backdrop')) {
                    this.close();
                }
            }, true);

            // Keyboard navigation
            window.addEventListener('keydown', (e) => {
                if (!this.element || !this.element.classList.contains('show')) return;
                if (e.key === 'Escape') this.close();
                else if (e.key === 'ArrowLeft') this.prev();
                else if (e.key === 'ArrowRight') this.next();
            });

            // High-reliability gesture swipe detection (Pointer Events with Touch fallback)
            let isDown = false;
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let startTime = 0;

            const handleGestureStart = (clientX, clientY, target) => {
                if (target && target.closest && target.closest('.adminuiux-lightbox-btn')) {
                    return false;
                }
                isDown = true;
                isDragging = false;
                startX = clientX;
                startY = clientY;
                currentX = clientX;
                currentY = clientY;
                startTime = Date.now();
                return true;
            };

            const handleGestureMove = (clientX, clientY) => {
                if (!isDown) return;
                currentX = clientX;
                currentY = clientY;
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;

                if (Math.hypot(deltaX, deltaY) > 8) {
                    isDragging = true;
                    markSwiped();
                }
            };

            const handleGestureEnd = () => {
                if (!isDown) return;
                isDown = false;
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;
                const distance = Math.hypot(deltaX, deltaY);
                const elapsed = Date.now() - startTime;

                if (distance > 8 || isDragging) {
                    markSwiped();
                }

                // Threshold: at least 35px horizontal travel, predominantly horizontal, within 800ms
                if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1 && elapsed < 800) {
                    markSwiped();
                    if (deltaX < 0) {
                        this.next(); // swipe left -> next slide
                    } else {
                        this.prev(); // swipe right -> previous slide
                    }
                }
                isDragging = false;
            };

            const stage = modal.querySelector('#adminuiuxLbStage, .adminuiux-lightbox-stage') || modal;
            if (window.PointerEvent) {
                stage.addEventListener('pointerdown', (e) => {
                    if (e.button !== undefined && e.button !== 0) return;
                    if (handleGestureStart(e.clientX, e.clientY, e.target)) {
                        try {
                            stage.setPointerCapture(e.pointerId);
                        } catch (err) { }
                    }
                });
                stage.addEventListener('pointermove', (e) => {
                    handleGestureMove(e.clientX, e.clientY);
                });
                stage.addEventListener('pointerup', (e) => {
                    handleGestureEnd();
                    try {
                        stage.releasePointerCapture(e.pointerId);
                    } catch (err) { }
                });
                stage.addEventListener('pointercancel', (e) => {
                    isDown = false;
                    isDragging = false;
                    try {
                        stage.releasePointerCapture(e.pointerId);
                    } catch (err) { }
                });
            } else {
                stage.addEventListener('touchstart', (e) => {
                    if (!e.touches || e.touches.length !== 1) return;
                    handleGestureStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
                }, { passive: true });
                stage.addEventListener('touchmove', (e) => {
                    if (!e.touches || e.touches.length !== 1) return;
                    handleGestureMove(e.touches[0].clientX, e.touches[0].clientY);
                }, { passive: true });
                stage.addEventListener('touchend', () => {
                    handleGestureEnd();
                }, { passive: true });
                stage.addEventListener('touchcancel', () => {
                    isDown = false;
                    isDragging = false;
                }, { passive: true });
            }
        },

        open(items, startIndex = 0, options = {}) {
            this.init(options);
            if (!items || !items.length) return;
            this.items = items;
            this.currentIndex = Math.max(0, Math.min(startIndex, items.length - 1));
            this.isZoomed = false;

            // Handle data-thumb-preview (default true, can be false)
            const showThumbs = options.thumbPreview !== undefined ? options.thumbPreview : true;
            this.thumbPreview = showThumbs;

            if (this.thumbsEl) {
                if (showThumbs) {
                    this.thumbsEl.classList.remove('d-none');
                    this.thumbsEl.innerHTML = '';
                    items.forEach((item, idx) => {
                        const thumb = document.createElement('img');
                        thumb.src = item.thumb || item.src;
                        thumb.alt = item.title || `Thumb ${idx + 1}`;
                        thumb.className = `adminuiux-lightbox-thumb ${idx === this.currentIndex ? 'active' : ''}`;
                        thumb.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.goTo(idx);
                        });
                        this.thumbsEl.appendChild(thumb);
                    });
                } else {
                    this.thumbsEl.classList.add('d-none');
                    this.thumbsEl.innerHTML = '';
                }
            }

            this.showCurrent(0);
            if (this.element) {
                this.element.classList.add('show');
            }
            document.body.style.overflow = 'hidden';
        },

        showCurrent(direction = 0) {
            if (!this.items.length) return;
            const item = this.items[this.currentIndex];

            if (this.isZoomed) {
                this.toggleZoom();
            }

            if (this.titleEl) this.titleEl.textContent = item.title || 'Untitled';
            if (this.categoryEl) this.categoryEl.textContent = item.category || 'Gallery';
            if (this.descEl) this.descEl.textContent = item.description || '';
            if (this.counterEl) {
                this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.items.length).padStart(2, '0')}`;
            }

            const downloadBtn = this.element ? this.element.querySelector('#adminuiuxLbDownload, .adminuiux-lightbox-download') : null;
            if (downloadBtn) {
                downloadBtn.href = item.src;
            }

            if (this.imgEl) {
                if (direction !== 0) {
                    // Directional slide transition
                    const exitX = direction > 0 ? '-35px' : '35px';
                    const enterX = direction > 0 ? '35px' : '-35px';

                    this.imgEl.style.transition = 'transform 0.16s ease-out, opacity 0.16s ease-out';
                    this.imgEl.style.opacity = '0';
                    this.imgEl.style.transform = `translateX(${exitX}) scale(0.96)`;

                    setTimeout(() => {
                        this.imgEl.src = item.src;
                        this.imgEl.alt = item.title || '';

                        // Reset position without transition for entry
                        this.imgEl.style.transition = 'none';
                        this.imgEl.style.opacity = '0';
                        this.imgEl.style.transform = `translateX(${enterX}) scale(0.96)`;

                        // Force browser reflow
                        void this.imgEl.offsetWidth;

                        // Animate into view
                        this.imgEl.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease';
                        this.imgEl.style.opacity = '1';
                        this.imgEl.style.transform = 'translateX(0) scale(1)';
                    }, 160);
                } else {
                    this.imgEl.style.opacity = '0';
                    this.imgEl.style.transform = 'scale(0.96)';

                    setTimeout(() => {
                        this.imgEl.src = item.src;
                        this.imgEl.alt = item.title || '';
                        this.imgEl.style.opacity = '1';
                        this.imgEl.style.transform = 'scale(1)';
                    }, 120);
                }
            }

            // Update active thumbnail
            if (this.thumbsEl && this.thumbPreview) {
                const thumbs = this.thumbsEl.querySelectorAll('.adminuiux-lightbox-thumb');
                thumbs.forEach((t, i) => {
                    if (i === this.currentIndex) {
                        t.classList.add('active');
                        this.thumbsEl.scrollTo({
                            left: t.offsetLeft - (this.thumbsEl.clientWidth / 2) + (t.clientWidth / 2),
                            behavior: 'smooth'
                        });
                    } else {
                        t.classList.remove('active');
                    }
                });
            }
        },

        next() {
            if (this.currentIndex < this.items.length - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0; // loop
            }
            this.showCurrent(1);
        },

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.items.length - 1; // loop
            }
            this.showCurrent(-1);
        },

        goTo(index) {
            if (index >= 0 && index < this.items.length && index !== this.currentIndex) {
                const direction = index > this.currentIndex ? 1 : -1;
                this.currentIndex = index;
                this.showCurrent(direction);
            }
        },

        toggleZoom() {
            this.isZoomed = !this.isZoomed;
            const zoomBtn = this.element ? this.element.querySelector('#adminuiuxLbZoom, .adminuiux-lightbox-zoom') : null;
            if (this.imgEl) {
                if (this.isZoomed) {
                    this.imgEl.style.transform = 'scale(1.4)';
                    this.imgEl.style.cursor = 'zoom-out';
                } else {
                    this.imgEl.style.transform = 'scale(1)';
                    this.imgEl.style.cursor = 'grab';
                }
            }
            if (zoomBtn) {
                if (this.isZoomed) zoomBtn.classList.add('active');
                else zoomBtn.classList.remove('active');
            }
        },

        close() {
            if (!this.element) return;
            this.element.classList.remove('show');
            document.body.style.overflow = '';
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        }
    };

    /**
     * AdminUIUXMasonry Class
     */
    class AdminUIUXMasonry {
        constructor(container, options = {}) {
            this.container = typeof container === 'string' ? document.querySelector(container) : container;
            if (!this.container) return;

            ensureLightboxStyles();

            // Options parsing from data attributes or config object
            const ds = this.container.dataset || {};
            let responsiveMap = null;
            if (options.responsive) {
                responsiveMap = options.responsive;
            } else if (ds.responsive) {
                try {
                    responsiveMap = typeof ds.responsive === 'string' ? JSON.parse(ds.responsive) : ds.responsive;
                } catch (e) { }
            }

            // Determine default item selector: prefer .adminuiux-masonry-item if present, else .masonry-item
            let defaultItemSelector = '.adminuiux-masonry-item, .masonry-item';

            // Support singular and plural data attributes: data-columns, data-column, data-cols, data-col
            const parsedCols = parseInt(
                options.columns || options.column || options.cols ||
                ds.columns || ds.column || ds.cols || ds.col || 3,
                10
            );

            const hasExplicitBreakpoints = Boolean(
                options.colsXs || ds.colsXs ||
                options.colsSm || ds.colsSm ||
                options.colsMd || ds.colsMd ||
                options.colsLg || ds.colsLg ||
                options.colsXl || ds.colsXl
            );

            this.options = {
                columns: parsedCols,
                gap: parseInt(options.gap || ds.gap || 16, 10),
                preview: options.preview !== undefined ? options.preview : (ds.preview === 'true' || ds.preview === ''),
                thumbPreview: options.thumbPreview !== undefined ? options.thumbPreview : (ds.thumbPreview !== 'false'),
                itemSelector: options.itemSelector || ds.itemSelector || defaultItemSelector,
                responsive: responsiveMap,
                hasExplicitBreakpoints: hasExplicitBreakpoints,
                colsXs: parseInt(options.colsXs || ds.colsXs || 1, 10),
                colsSm: parseInt(options.colsSm || ds.colsSm || Math.min(2, parsedCols), 10),
                colsMd: parseInt(options.colsMd || ds.colsMd || Math.min(2, parsedCols), 10),
                colsLg: parseInt(options.colsLg || ds.colsLg || parsedCols, 10),
                colsXl: parseInt(options.colsXl || ds.colsXl || parsedCols, 10),
                ...options
            };

            this.items = [];
            this.resizeHandler = this.debounce(() => this.layout(), 120);

            this.init();
        }

        init() {
            this.container.style.position = 'relative';
            this.container.classList.add('masonry-container');
            this.layout();

            // Observe images to recalculate once loaded
            const imgs = this.container.querySelectorAll('img');
            imgs.forEach(img => {
                if (!img.complete) {
                    img.addEventListener('load', () => this.layout());
                    img.addEventListener('error', () => this.layout());
                }
            });

            // Delayed passes for webfont and image dimension stabilization
            setTimeout(() => this.layout(), 120);
            setTimeout(() => this.layout(), 400);

            // Window resize listener
            if (typeof window !== 'undefined') {
                window.addEventListener('resize', this.resizeHandler);
            }

            // Setup ResizeObserver if supported
            if (typeof ResizeObserver !== 'undefined') {
                this.ro = new ResizeObserver(() => this.layout());
                this.ro.observe(this.container);
            }

            // Setup Lightbox if preview is true
            if (this.options.preview) {
                this.setupLightbox();
            }
        }

        getResponsiveColumns(containerWidth) {
            const viewportWidth = (typeof window !== 'undefined' && window.innerWidth) ? window.innerWidth : containerWidth;

            // 1. Explicit responsive map (e.g. data-responsive='{"768": 2, "1024": 3}')
            if (this.options.responsive && typeof this.options.responsive === 'object') {
                const bps = Object.keys(this.options.responsive).map(Number).sort((a, b) => a - b);
                const testWidth = viewportWidth;

                if (testWidth < bps[0]) {
                    const firstVal = parseInt(this.options.responsive[bps[0]], 10);
                    return (firstVal > 1 && testWidth < 400 && containerWidth < 300) ? 1 : firstVal;
                }
                for (let i = 0; i < bps.length; i++) {
                    const bp = bps[i];
                    if (testWidth < bp) {
                        return parseInt(this.options.responsive[bp], 10);
                    }
                }
                return this.options.columns || 3;
            }

            // 2. Explicit breakpoint options (e.g. data-cols-xs="1", data-cols-md="3")
            if (this.options.hasExplicitBreakpoints) {
                if (viewportWidth < 576) return this.options.colsXs;
                if (viewportWidth < 768) return this.options.colsSm;
                if (viewportWidth < 992) return this.options.colsMd;
                if (viewportWidth < 1200) return this.options.colsLg;
                return this.options.colsXl;
            }

            // 3. Default: Honor data-columns / data-column!
            // When parent is smaller (sidebar, card, nested column), do NOT collapse to 1 column
            // unless container is genuinely too small to fit the columns (e.g. < 45px per column).
            const requested = this.options.columns || 3;
            const gap = this.options.gap || 0;
            const minColWidth = 45;

            // On mobile phones (< 576px screen width), if container is full mobile width, clamp to at most 2
            if (viewportWidth < 576 && containerWidth < 340 && requested > 2) {
                return 2;
            }

            let safeCols = requested;
            while (safeCols > 1 && Math.floor((containerWidth - (safeCols - 1) * gap) / safeCols) < minColWidth) {
                safeCols--;
            }
            return Math.max(1, safeCols);
        }

        layout() {
            if (!this.container) return;

            const items = Array.from(this.container.querySelectorAll(this.options.itemSelector));
            const containerWidth = this.container.clientWidth;
            if (!containerWidth) return;

            const cols = Math.max(1, this.getResponsiveColumns(containerWidth));
            const gap = this.options.gap;
            const colWidth = Math.floor((containerWidth - (cols - 1) * gap) / cols);

            const colHeights = new Array(cols).fill(0);

            items.forEach((item) => {
                // If item is filtered out / hidden, bypass
                if (item.classList.contains('d-none') || item.style.display === 'none') {
                    return;
                }

                item.style.position = 'absolute';
                item.style.boxSizing = 'border-box';

                // Determine column span
                let span = parseInt(item.getAttribute('data-span') || 1, 10);
                if (span > cols) span = cols;

                let targetCol = 0;
                let targetTop = 0;

                if (span > 1) {
                    // Find adjacent columns with minimum combined top height
                    let minCombined = Infinity;
                    for (let c = 0; c <= cols - span; c++) {
                        const currentTop = Math.max(...colHeights.slice(c, c + span));
                        if (currentTop < minCombined) {
                            minCombined = currentTop;
                            targetCol = c;
                            targetTop = currentTop;
                        }
                    }
                } else {
                    // Place in the shortest column
                    targetTop = Math.min(...colHeights);
                    targetCol = colHeights.indexOf(targetTop);
                }

                const targetLeft = targetCol * (colWidth + gap);
                const actualWidth = span * colWidth + (span - 1) * gap;

                item.style.width = `${actualWidth}px`;
                item.style.left = `${targetLeft}px`;
                item.style.top = `${targetTop}px`;

                // Calculate item height using aspect-ratio if given or natural offsetHeight
                let itemHeight = 0;
                const aspectAttr = item.getAttribute('data-aspect-ratio');
                const img = item.querySelector('img');

                if (aspectAttr && aspectAttr.includes('/')) {
                    const [wRatio, hRatio] = aspectAttr.split('/').map(Number);
                    if (wRatio && hRatio) {
                        const calcHeight = Math.round((actualWidth / wRatio) * hRatio);
                        item.style.height = `${calcHeight}px`;
                        if (img) {
                            img.style.height = '100%';
                            img.style.width = '100%';
                            img.style.objectFit = 'cover';
                        }
                        itemHeight = calcHeight;
                    }
                } else {
                    item.style.height = ''; // Content determines natural height
                    itemHeight = item.offsetHeight;
                    if ((!itemHeight || itemHeight < 30) && img) {
                        if (img.naturalWidth && img.naturalHeight) {
                            itemHeight = Math.round((actualWidth / img.naturalWidth) * img.naturalHeight);
                        } else {
                            itemHeight = Math.round(actualWidth * 0.75);
                        }
                    }
                }

                // Update column heights
                for (let c = targetCol; c < targetCol + span; c++) {
                    colHeights[c] = targetTop + itemHeight + gap;
                }
            });

            const totalHeight = Math.max(...colHeights, 0);
            this.container.style.height = `${Math.max(0, totalHeight - (totalHeight > 0 ? gap : 0))}px`;
        }

        setupLightbox() {
            this.container.addEventListener('click', (e) => {
                // Ignore clicks on buttons/links with specific data attributes
                if (e.target.closest('button:not([data-open-lightbox])') || e.target.closest('a:not([data-open-lightbox])')) {
                    return;
                }

                const item = e.target.closest(this.options.itemSelector);
                if (!item) return;

                const visibleItems = Array.from(this.container.querySelectorAll(this.options.itemSelector)).filter(el => {
                    return !el.classList.contains('d-none') && el.style.display !== 'none';
                });

                const galleryData = visibleItems.map(el => {
                    const img = el.querySelector('img');
                    return {
                        src: el.getAttribute('data-src') || (img ? img.src : ''),
                        thumb: (img ? img.src : '') || el.getAttribute('data-src'),
                        title: el.getAttribute('data-caption') || el.getAttribute('data-title') || (img ? img.alt : 'Gallery Photo'),
                        category: el.getAttribute('data-category') || (el.querySelector('.badge') ? el.querySelector('.badge').textContent.trim() : ''),
                        description: el.getAttribute('data-description') || (el.querySelector('p') ? el.querySelector('p').textContent.trim() : '')
                    };
                });

                const clickedIndex = visibleItems.indexOf(item);
                if (clickedIndex !== -1 && galleryData.length) {
                    const itemThumbPreview = item.getAttribute('data-thumb-preview');
                    const thumbPreview = itemThumbPreview !== null ? itemThumbPreview !== 'false' : this.options.thumbPreview;
                    const lightboxSelector = item.getAttribute('data-lightbox-target') || this.options.lightboxSelector;
                    Lightbox.open(galleryData, clickedIndex, { thumbPreview, lightboxSelector });
                }
            });
        }

        debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        setColumns(cols) {
            this.options.columns = parseInt(cols, 10);
            this.options.responsive = null;
            this.options.hasExplicitBreakpoints = false;
            this.layout();
        }

        addItem(el) {
            if (typeof el === 'string') {
                const temp = document.createElement('div');
                temp.innerHTML = el.trim();
                el = temp.firstElementChild;
            }
            if (!el || !this.container) return null;
            this.container.appendChild(el);
            const imgs = el.querySelectorAll('img');
            imgs.forEach(img => {
                if (!img.complete) {
                    img.addEventListener('load', () => this.layout());
                    img.addEventListener('error', () => this.layout());
                }
            });
            this.layout();
            return el;
        }

        refresh() {
            this.layout();
        }

        destroy() {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', this.resizeHandler);
            }
            if (this.ro) this.ro.disconnect();
        }
    }

    // Static helper to open lightbox on any arbitrary list of items
    AdminUIUXMasonry.openLightbox = function (items, index = 0, options = {}) {
        Lightbox.open(items, index, options);
    };

    AdminUIUXMasonry.closeLightbox = function () {
        Lightbox.close();
    };

    AdminUIUXMasonry.defaults = {
        columns: 3,
        gap: 16,
        preview: true,
        thumbPreview: true,
        itemSelector: '.masonry-item',
        colsXs: 1,
        colsSm: 2,
        colsMd: 2,
        colsLg: 3,
        colsXl: 3
    };

    function initMasonry(root) {
        const doc = root || (typeof document !== 'undefined' ? document : null);
        if (!doc) return [];

        const containers = doc.querySelectorAll('.adminuiux-masonry, [data-adminuiux-masonry], .masonry-container, [data-masonry]');
        const instances = [];

        containers.forEach(container => {
            if (container._adminuiuxMasonry) {
                container._adminuiuxMasonry.layout();
                instances.push(container._adminuiuxMasonry);
            } else {
                const instance = new AdminUIUXMasonry(container);
                container._adminuiuxMasonry = instance;
                instances.push(instance);
            }
        });

        // Tab change listener (Bootstrap tabs)
        if (!doc._hasAdminUIUXMasonryTabListener && typeof document !== 'undefined') {
            doc._hasAdminUIUXMasonryTabListener = true;
            document.addEventListener('shown.bs.tab', () => {
                setTimeout(() => {
                    instances.forEach(inst => inst.layout());
                }, 50);
            });
        }

        // Also wire any element with [data-gallery-lightbox]
        const standaloneLightboxTriggers = doc.querySelectorAll('[data-gallery-lightbox]');
        standaloneLightboxTriggers.forEach(trigger => {
            if (trigger._hasLightboxBound) return;
            trigger._hasLightboxBound = true;
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const galleryName = trigger.getAttribute('data-gallery-lightbox');
                const groupItems = Array.from(doc.querySelectorAll(`[data-gallery-lightbox="${galleryName}"]`));
                const items = groupItems.map(itemEl => {
                    const img = itemEl.querySelector('img');
                    return {
                        src: itemEl.getAttribute('data-src') || (img ? img.src : ''),
                        thumb: (img ? img.src : '') || itemEl.getAttribute('data-src'),
                        title: itemEl.getAttribute('data-caption') || itemEl.getAttribute('data-title') || (img ? img.alt : 'Photo'),
                        category: itemEl.getAttribute('data-category') || '',
                        description: itemEl.getAttribute('data-description') || ''
                    };
                });
                const idx = groupItems.indexOf(trigger);
                const thumbPreviewAttr = trigger.getAttribute('data-thumb-preview');
                const thumbPreview = thumbPreviewAttr !== null ? thumbPreviewAttr !== 'false' : true;
                const lightboxSelector = trigger.getAttribute('data-lightbox-target');
                AdminUIUXMasonry.openLightbox(items, Math.max(0, idx), { thumbPreview, lightboxSelector });
            });
        });

        return instances;
    }

    // Auto-initialize when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => initMasonry());
        } else {
            initMasonry();
        }
    }

export {
    AdminUIUXMasonry,
    initMasonry
};

export default AdminUIUXMasonry;
