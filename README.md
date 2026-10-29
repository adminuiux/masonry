# @adminuiux/masonry

<p align="center">
  <img src="masonry.png" alt="AdminUIUX Masonry & Fullscreen Lightbox Gallery JS" width="100%">
</p>

> Production-ready, zero-dependency responsive masonry layout engine and fullscreen lightbox photo slider for Bootstrap 5 and vanilla JavaScript with touch-swipe navigation, multi-column spanning, aspect ratio auto-alignment, and thumbnail preview controls.

[![npm version](https://img.shields.io/npm/v/@adminuiux/masonry.svg)](https://www.npmjs.com/package/@adminuiux/masonry)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)
[![Bundle Size](https://img.shields.io/badge/size-%3C7KB%20minified-brightgreen.svg)](dist/masonry.min.js)

🔗 **Live Demo & Interactive Preview:** [https://adminuiux.com/plugin-preview/masonry-plugin-preview.html](https://adminuiux.com/plugin-preview/masonry-plugin-preview.html)

---

## 🌟 Features

- **Zero External Dependencies**: Pure vanilla JavaScript without jQuery, Isotope, or PhotoSwipe.
- **Shortest-Column Bin-Packing**: Computes column layout with minimal gaps, nested parent container awareness, and smooth transitions.
- **Auto-aligning Aspect Ratios**: Set `data-aspect-ratio="16/9"` or `"4/3"` or `"1/1"` on items to precompute heights with pixel precision.
- **Multi-Column Spanning**: Feature large editorial items with `data-span="2"` that intelligently span across adjacent columns.
- **Built-in Interactive Lightbox**: Seamless fullscreen photo slider with animated `.backdrop`, keyboard controls (`ArrowLeft`, `ArrowRight`, `Escape`), and image download.
- **Touch-Swipe Detection**: High-precision mobile swipe gesture support for fluid photo browsing.
- **Thumbnail Preview Controls**: Configurable thumbnail preview strip with `data-thumb-preview="true|false"`.
- **Dynamic JavaScript API**: Live column switching (`setColumns`), dynamic item insertion (`addItem`), and manual recalculation (`layout` / `refresh`).
- **Bootstrap 5 Tabs Integration**: Automatically detects tab switching (`shown.bs.tab`) and recalculates layout without zero-height collapsing.
- **CSS Variable Color Integration**: Integrates directly with `--adminuiux-primary` and Bootstrap 5 theme tokens.
- **Universal Distribution**: UMD, ESM, CommonJS, and Browser `<script>` tags.

---

## 📦 Installation

### Via npm

```bash
npm install @adminuiux/masonry
```

### Via jsDelivr CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@adminuiux/masonry@1.0.0/dist/masonry.min.js"></script>
```

Or from local project assets:

```html
<script src="../../assets/js/plugins-custom/masonry/dist/masonry.min.js"></script>
```

---

## 🚀 Quick Usage

### 1. HTML Declarative Markup

```html
<div class="masonry-container" data-columns="3" data-gap="16" data-preview="true" data-thumb-preview="true">
    <!-- Featured 2-column span item -->
    <div class="masonry-item rounded-4 overflow-hidden" data-span="2" data-aspect-ratio="16/9" data-caption="Nordic Glacial Lake" data-category="Nature">
        <img src="path/to/image1.jpg" alt="Nordic Glacial Lake" class="w-100 h-100 object-fit-cover">
    </div>

    <!-- Regular items -->
    <div class="masonry-item rounded-4 overflow-hidden" data-aspect-ratio="3/4" data-caption="Modern Glass Villa" data-category="Architecture">
        <img src="path/to/image2.jpg" alt="Modern Glass Villa" class="w-100 h-100 object-fit-cover">
    </div>

    <div class="masonry-item rounded-4 overflow-hidden" data-aspect-ratio="1/1" data-caption="Studio Portrait" data-category="People">
        <img src="path/to/image3.jpg" alt="Studio Portrait" class="w-100 h-100 object-fit-cover">
    </div>
</div>
```

### 2. Standalone Lightbox Group

Any collection of elements can trigger the fullscreen photo slider without using the masonry layout:

```html
<div data-gallery-lightbox="myProductGallery" data-caption="Executive Chronograph" data-category="Watches" data-thumb-preview="true">
    <img src="watch-1.jpg" alt="Executive Chronograph">
</div>
<div data-gallery-lightbox="myProductGallery" data-caption="Titanium Case Detail" data-category="Watches">
    <img src="watch-2.jpg" alt="Titanium Case Detail">
</div>
```

---

## ⚙️ Configuration & Data Attributes

The plugin automatically initializes any container with `.adminuiux-masonry`, `[data-adminuiux-masonry]`, `.masonry-container`, or `[data-masonry]`.

| Attribute | Target | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `data-columns` / `data-column` | Container | `number` | `3` | Number of columns. Also accepts aliases `data-cols` and `data-col`. |
| `data-gap` | Container | `number` | `16` | Gap between masonry items in pixels. |
| `data-responsive` | Container | `JSON string` | `null` | Responsive breakpoint map, e.g. `'{"576": 2, "992": 4}'`. |
| `data-preview` | Container | `boolean` | `true` | Enables interactive fullscreen photo slider on click. |
| `data-thumb-preview` | Container / Item | `boolean` | `true` | Show or hide the bottom thumbnail rail in preview. |
| `data-item-selector` | Container | `string` | auto | Item selector (`.adminuiux-masonry-item, .masonry-item`). |
| `data-cols-xs` | Container | `number` | `1` | Column count on screens `< 576px`. |
| `data-cols-sm` | Container | `number` | `2` | Column count on screens `576px – 767px`. |
| `data-cols-md` | Container | `number` | `2` | Column count on screens `768px – 991px`. |
| `data-cols-lg` | Container | `number` | `3` | Column count on screens `992px – 1199px`. |
| `data-cols-xl` | Container | `number` | `3` | Column count on screens `>= 1200px`. |
| `data-aspect-ratio` | Item | `string` | `auto` | Aspect ratio hint (`"16/9"`, `"4/3"`, `"1/1"`, `"3/4"`). Precomputes item height. |
| `data-span` | Item | `number` | `1` | Column span count (e.g. `2` to span across two columns). |
| `data-caption` | Item | `string` | `alt text` | Slide title displayed in the lightbox. |
| `data-category` | Item | `string` | `""` | Category badge text in the lightbox. |
| `data-description` | Item | `string` | `""` | Detailed description text in the lightbox. |
| `data-src` | Item | `string` | `img.src` | High-resolution image source for lightbox inspection. |
| `data-gallery-lightbox`| Standalone Element| `string` | `""` | Group name for standalone elements to open in lightbox. |

---

## 💻 JavaScript API

```javascript
// Initialize programmatic instance
const container = document.querySelector('.adminuiux-masonry');
const masonry = new AdminUIUXMasonry(container, {
    columns: 3,
    gap: 20,
    preview: true,
    thumbPreview: true,
    responsive: {
        576: 2,
        992: 3,
        1200: 4
    }
});

// Change column count dynamically (e.g., from interactive buttons)
masonry.setColumns(4);

// Dynamically add a new card element or HTML string
masonry.addItem(`
    <div class="adminuiux-masonry-item card border-0 shadow-sm" data-caption="Dynamic Card">
        <img src="path/to/img.jpg" class="card-img-top">
        <div class="card-body p-3"><h6>New Story</h6></div>
    </div>
`);

// Force relayout after dynamic DOM updates
masonry.layout(); // or masonry.refresh();

// Destroy instance and disconnect observers / event listeners
masonry.destroy();

// Open lightbox programmatically for any custom photo list
AdminUIUXMasonry.openLightbox([
    {
        src: 'photo1.jpg',
        thumb: 'thumb1.jpg',
        title: 'Alpine Peak',
        category: 'Travel',
        description: 'High altitude glacial summit.'
    },
    {
        src: 'photo2.jpg',
        thumb: 'thumb2.jpg',
        title: 'Coastal Waves',
        category: 'Ocean',
        description: 'Sunset long exposure over tidal reef.'
    }
], 0, { thumbPreview: true });

// Close active lightbox programmatically
AdminUIUXMasonry.closeLightbox();
```

---

## 🎨 Customizing the Lightbox HTML on Page

By default, `@adminuiux/masonry` automatically injects the built-in lightbox into the `<body>` on demand.

If you need a fully customized frontend layout (custom buttons, extra actions like "Share" or "Add to Cart", sidebar drawer, modified controls, or custom classes), simply place `#adminuiuxLightboxModal` (or any custom container with `data-lightbox-target`) directly on your page or template partial:

```html
<div class="adminuiux-lightbox-modal" id="adminuiuxLightboxModal">
    <div class="backdrop"></div>
    <div class="adminuiux-lightbox-topbar">
        <div class="d-flex align-items-center gap-2">
            <span class="badge adminuiux-lightbox-badge-primary rounded-pill px-3 py-1 font-monospace" id="adminuiuxLbCounter">1 / 1</span>
            <span class="text-white-50 small ms-2 d-none d-sm-inline" id="adminuiuxLbCategory">Gallery</span>
        </div>
        <div class="d-flex align-items-center gap-2">
            <!-- Custom Action Buttons can be added freely here -->
            <button type="button" class="adminuiux-lightbox-btn" id="adminuiuxLbZoom" title="Toggle Zoom"><i class="bi bi-zoom-in"></i></button>
            <a href="#" class="adminuiux-lightbox-btn text-decoration-none" id="adminuiuxLbDownload" download title="Download"><i class="bi bi-download"></i></a>
            <button type="button" class="adminuiux-lightbox-btn" id="adminuiuxLbFullscreen" title="Fullscreen"><i class="bi bi-fullscreen"></i></button>
            <button type="button" class="adminuiux-lightbox-btn" id="adminuiuxLbClose" title="Close"><i class="bi bi-x-lg"></i></button>
        </div>
    </div>

    <div class="adminuiux-lightbox-stage" id="adminuiuxLbStage">
        <button type="button" class="adminuiux-lightbox-btn adminuiux-lightbox-nav prev" id="adminuiuxLbPrev"><i class="bi bi-chevron-left"></i></button>
        <img src="" alt="" class="adminuiux-lightbox-img" id="adminuiuxLbImage">
        <button type="button" class="adminuiux-lightbox-btn adminuiux-lightbox-nav next" id="adminuiuxLbNext"><i class="bi bi-chevron-right"></i></button>
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
</div>
```

The plugin automatically detects the existing DOM element and binds all gestures (touch-swipe, pointer drag, backdrop click dismissal, zoom, fullscreen, and thumbnails) to your customized markup without duplicating elements.

---

## 📄 License

MIT © [AdminUIUX](https://adminuiux.com)

