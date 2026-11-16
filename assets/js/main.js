/**
 * Interactive Web Security Sandbox - Shared JS Engine (main.js)
 * 42 Amman / 42 Irbid Cybersecurity Labs
 * Pure Vanilla JavaScript (Client-side only)
 */

const Sandbox = (function() {
  'use strict';

  // State
  let currentMode = 'vulnerable'; // 'vulnerable' or 'fixed'
  let onModeChangeCallbacks = [];

  function init() {
    setupToggleListeners();
    setupWordCounter();
    log("Security Sandbox initialized. Ready for evaluation.", "info");
  }

  function setupToggleListeners() {
    const btnVuln = document.getElementById('toggle-btn-vuln');
    const btnFixed = document.getElementById('toggle-btn-fixed');
    const wrapper = document.getElementById('mode-toggle-wrapper');

    if (!btnVuln || !btnFixed) return;

    btnVuln.addEventListener('click', () => setMode('vulnerable'));
    btnFixed.addEventListener('click', () => setMode('fixed'));
  }

  function setMode(mode) {
    if (mode !== 'vulnerable' && mode !== 'fixed') return;
    currentMode = mode;

    const btnVuln = document.getElementById('toggle-btn-vuln');
    const btnFixed = document.getElementById('toggle-btn-fixed');
    const wrapper = document.getElementById('mode-toggle-wrapper');
    const statusText = document.getElementById('mode-status-text');

    if (btnVuln && btnFixed) {
      if (mode === 'vulnerable') {
        btnVuln.classList.add('active');
        btnFixed.classList.remove('active');
        if (wrapper) {
          wrapper.className = 'toggle-wrapper mode-vulnerable';
        }
        if (statusText) {
          statusText.innerHTML = '<span style="color: var(--vuln-color);">● Vulnerable Mode Active</span> — Flaws are unmitigated';
        }
      } else {
        btnFixed.classList.add('active');
        btnVuln.classList.remove('active');
        if (wrapper) {
          wrapper.className = 'toggle-wrapper mode-fixed';
        }
        if (statusText) {
          statusText.innerHTML = '<span style="color: var(--fixed-color);">● Fixed Mode Active</span> — Defenses enforced, payloads blocked';
        }
      }
    }

    // Toggle code views if present
    const vulnCodeSection = document.getElementById('code-section-vuln');
    const fixedCodeSection = document.getElementById('code-section-fixed');

    if (vulnCodeSection && fixedCodeSection) {
      if (mode === 'vulnerable') {
        vulnCodeSection.style.display = 'block';
        fixedCodeSection.style.display = 'none';
      } else {
        vulnCodeSection.style.display = 'none';
        fixedCodeSection.style.display = 'block';
      }
    }

    // Reset banners and simulations
    resetSimulationStage();

    log(`Switched to [${mode.toUpperCase()}] mode.`, mode === 'vulnerable' ? 'vuln' : 'fixed');

    // Notify registered lab callbacks
    onModeChangeCallbacks.forEach(cb => cb(currentMode));
  }

  function onModeChange(fn) {
    if (typeof fn === 'function') {
      onModeChangeCallbacks.push(fn);
    }
  }

  function getMode() {
    return currentMode;
  }

  function resetSimulationStage() {
    const bannerVuln = document.getElementById('banner-vuln');
    const bannerFixed = document.getElementById('banner-fixed');
    const simStage = document.getElementById('sim-stage');

    if (bannerVuln) bannerVuln.style.display = 'none';
    if (bannerFixed) bannerFixed.style.display = 'none';
    if (simStage) {
      simStage.classList.remove('state-vuln-triggered', 'state-fixed-blocked');
    }
  }

  function log(message, type = 'info') {
    const logBox = document.getElementById('console-log');
    if (!logBox) return;

    const time = new Date().toTimeString().split(' ')[0];
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    let tagColor = 'log-msg-info';
    let tagText = 'INFO';

    if (type === 'vuln') {
      tagColor = 'log-msg-vuln';
      tagText = 'EXPLOITED';
    } else if (type === 'fixed') {
      tagColor = 'log-msg-fixed';
      tagText = 'BLOCKED';
    } else if (type === 'warn') {
      tagColor = 'log-msg-vuln';
      tagText = 'WARN';
    }

    entry.innerHTML = `
      <span class="log-time">[${time}]</span>
      <span class="${tagColor}">[${tagText}]</span>
      <span>${escapeHtml(message)}</span>
    `;

    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  // Calculate word count of lab descriptive text (excluding code pre tags)
  function setupWordCounter() {
    const wordBadge = document.getElementById('lab-word-counter');
    if (!wordBadge) return;

    const contentSections = document.querySelectorAll('.section-content, .hero-subtitle, .lab-subtitle');
    let totalWords = 0;

    contentSections.forEach(sec => {
      // Clone section and remove any code tags before counting
      const clone = sec.cloneNode(true);
      const codes = clone.querySelectorAll('pre, code');
      codes.forEach(c => c.remove());
      const text = clone.innerText || clone.textContent || '';
      const words = text.trim().split(/\s+/).filter(w => w.length > 0);
      totalWords += words.length;
    });

    wordBadge.textContent = `${totalWords} / 400 words`;
    if (totalWords <= 400) {
      wordBadge.style.color = 'var(--fixed-color)';
    } else {
      wordBadge.style.color = 'var(--vuln-color)';
    }
  }

  return {
    init,
    getMode,
    setMode,
    onModeChange,
    log,
    resetSimulationStage,
    escapeHtml
  };
})();

document.addEventListener('DOMContentLoaded', Sandbox.init);
