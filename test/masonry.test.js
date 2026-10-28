/**
 * Unit tests for @adminuiux/masonry
 */

'use strict';

const assert = require('assert');
const { AdminUIUXMasonry, initMasonry } = require('../src/index');

console.log('Running @adminuiux/masonry unit tests...\n');

// 1. Verify Exports
assert.strictEqual(typeof AdminUIUXMasonry, 'function', 'AdminUIUXMasonry class must be exported');
assert.strictEqual(typeof initMasonry, 'function', 'initMasonry function must be exported');
assert.strictEqual(typeof AdminUIUXMasonry.openLightbox, 'function', 'AdminUIUXMasonry.openLightbox must be a static function');
assert.strictEqual(typeof AdminUIUXMasonry.closeLightbox, 'function', 'AdminUIUXMasonry.closeLightbox must be a static function');

// 2. Verify Defaults & Static Properties
assert.ok(AdminUIUXMasonry.defaults, 'AdminUIUXMasonry.defaults should be defined');
assert.strictEqual(AdminUIUXMasonry.defaults.columns, 3, 'Default columns should be 3');
assert.strictEqual(AdminUIUXMasonry.defaults.gap, 16, 'Default gap should be 16');
assert.strictEqual(AdminUIUXMasonry.defaults.preview, true, 'Default preview should be true');
assert.strictEqual(AdminUIUXMasonry.defaults.thumbPreview, true, 'Default thumbPreview should be true');

console.log('✔ All exports are correctly defined.');
console.log('🎉 @adminuiux/masonry unit tests passed successfully!\n');

