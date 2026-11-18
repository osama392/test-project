<<<<<<< HEAD
/**
 * Lab 1: Clickjacking (UI Redressing)
 * Interactive logic & payload controller
 */

let currentPayload = {
  name: "Transfer $500",
  targetText: "Authorize Transfer $500 to attacker@evil.test",
  btnText: "Transfer $500 Now"
};

function loadPayload(type) {
  const hiddenBtn = document.getElementById('hiddenActionBtn');
  if (type === 'transfer') {
    currentPayload = {
      name: "Transfer $500",
      targetText: "Transfer $500 to attacker account",
      btnText: "Transfer $500 Now"
    };
  } else if (type === 'delete') {
    currentPayload = {
      name: "Delete Security Account",
      targetText: "Permanently delete user profile data",
      btnText: "Delete Account Now"
    };
  } else if (type === 'subscribe') {
    currentPayload = {
      name: "Authorize Premium Bill",
      targetText: "Auto-debit $99/month subscription fee",
      btnText: "Authorize Billing Now"
    };
  }

  if (hiddenBtn) {
    hiddenBtn.textContent = currentPayload.btnText;
  }
  Sandbox.resetSimulationStage();
  Sandbox.log(`Payload loaded: [${currentPayload.name}]`, "info");
}

function updateOpacity(val) {
  const layer = document.getElementById('maliciousLayer');
  const valLabel = document.getElementById('opacityVal');
  const op = val / 100;
  if (layer) layer.style.opacity = op;
  if (valLabel) {
    valLabel.textContent = `${val}% ${val == 0 ? '(Stealth)' : val == 100 ? '(Fully Visible)' : ''}`;
  }
}

function triggerMaliciousAction() {
  const mode = Sandbox.getMode();
  const bannerVuln = document.getElementById('banner-vuln');
  const bannerFixed = document.getElementById('banner-fixed');
  const simStage = document.getElementById('sim-stage');

  if (mode === 'vulnerable') {
    if (simStage) simStage.className = 'sim-stage state-vuln-triggered';
    if (bannerVuln) bannerVuln.style.display = 'flex';
    if (bannerFixed) bannerFixed.style.display = 'none';
    Sandbox.log(`CLICKJACK EXPLOITED: Target action executed -> [${currentPayload.targetText}]`, "vuln");
  } else {
    if (simStage) simStage.className = 'sim-stage state-fixed-blocked';
    if (bannerFixed) bannerFixed.style.display = 'flex';
    if (bannerVuln) bannerVuln.style.display = 'none';
    Sandbox.log(`ATTACK PREVENTED: Frame-busting / CSP blocked clickjacking attempt on [${currentPayload.name}].`, "fixed");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const decoyBtn = document.getElementById('decoyBtn');
  if (decoyBtn) {
    decoyBtn.addEventListener('click', function(e) {
      const mode = Sandbox.getMode();
      if (mode === 'vulnerable') {
        triggerMaliciousAction();
      } else {
        Sandbox.log("Benign interaction on safe decoy button processed without incident.", "fixed");
        Sandbox.resetSimulationStage();
      }
    });
  }

  // Update overlay visibility on mode toggle
  Sandbox.onModeChange(function(newMode) {
    const blockedOverlay = document.getElementById('blockedOverlay');
    const maliciousLayer = document.getElementById('maliciousLayer');
    if (blockedOverlay && maliciousLayer) {
      if (newMode === 'fixed') {
        blockedOverlay.style.display = 'flex';
        maliciousLayer.style.display = 'none';
      } else {
        blockedOverlay.style.display = 'none';
        maliciousLayer.style.display = 'flex';
      }
    }
  });
=======
/* ============================================================
   Lab 1 — Clickjacking — Interactive Demo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const toggle       = document.getElementById('cj-toggle');
  const vulnLabel    = document.querySelector('.toggle__label--vuln');
  const fixLabel     = document.querySelector('.toggle__label--fix');
  const sandbox      = document.getElementById('cj-sandbox');
  const resultBox    = document.getElementById('cj-result');
  const resetBtn     = document.getElementById('cj-reset');

  let isFixed = false;

  /* ---- Toggle handler ---- */
  toggle.addEventListener('change', () => {
    isFixed = toggle.checked;
    vulnLabel.style.color = isFixed ? 'var(--text-dim)' : 'var(--red)';
    fixLabel.style.color  = isFixed ? 'var(--green)' : 'var(--text-dim)';
    resetDemo();
  });

  /* ---- Payload buttons ---- */
  document.querySelectorAll('.cj-payload').forEach(btn => {
    btn.addEventListener('click', () => {
      const payload = btn.dataset.payload;
      runPayload(payload);
    });
  });

  /* ---- Reset button ---- */
  if (resetBtn) {
    resetBtn.addEventListener('click', resetDemo);
  }

  /* ---- Run a payload ---- */
  function runPayload(type) {
    resetDemo();

    if (isFixed) {
      runFixed(type);
    } else {
      runVulnerable(type);
    }
  }

  /* ---- Vulnerable demo ---- */
  function runVulnerable(type) {
    const targetPage = sandbox.querySelector('.cj-target');
    const overlay    = sandbox.querySelector('.cj-overlay');
    const reveal     = sandbox.querySelector('.cj-reveal');

    let baitText, baitBtn, actionText, revealMsg;

    switch (type) {
      case 'prize':
        baitText   = '🎉 Congratulations!';
        baitBtn    = 'Claim Your Prize!';
        actionText = 'Delete My Account';
        revealMsg  = 'You thought you clicked "Claim Prize" — but you actually clicked "Delete Account" on the hidden page underneath.';
        break;
      case 'video':
        baitText   = '▶️ Exclusive Video';
        baitBtn    = 'Play Video';
        actionText = 'Transfer $1,000';
        revealMsg  = 'You clicked "Play Video" — but actually triggered "Transfer $1,000" on the transparent banking page behind the overlay.';
        break;
      case 'close':
        baitText   = '❌ Close This Ad';
        baitBtn    = 'Close [X]';
        actionText = 'Enable Webcam';
        revealMsg  = 'You tried to close an ad — but that click went to the "Enable Webcam" permission button on the hidden page.';
        break;
      default:
        return;
    }

    // Set up target page
    targetPage.querySelector('h4').textContent = 'Account Settings';
    targetPage.querySelector('.cj-action-btn').textContent = actionText;

    // Set up overlay
    overlay.querySelector('h3').textContent = baitText;
    overlay.querySelector('p').textContent  = 'Click the button below to continue!';
    overlay.querySelector('.cj-bait-btn').textContent = baitBtn;
    overlay.classList.add('active');

    // Handle bait click
    const baitBtnEl = overlay.querySelector('.cj-bait-btn');
    const handler = async () => {
      baitBtnEl.removeEventListener('click', handler);

      // Animate: fade overlay to show what's underneath
      overlay.style.transition = 'opacity 0.6s ease';
      overlay.style.opacity = '0.3';

      await sleep(800);
      overlay.classList.remove('active');
      overlay.style.opacity = '';
      overlay.style.transition = '';

      // Flash the target button
      const actionBtn = targetPage.querySelector('.cj-action-btn');
      actionBtn.style.boxShadow = '0 0 30px rgba(255, 68, 102, 0.6)';
      actionBtn.style.transform = 'scale(1.05)';

      await sleep(600);

      // Show reveal
      reveal.querySelector('h4').textContent = '⚠️ Clickjacked!';
      reveal.querySelector('p').textContent = revealMsg;
      reveal.classList.add('active');

      // Update result box
      resultBox.className = 'result-box result-box--danger';
      resultBox.innerHTML = `<strong style="color:var(--red)">✗ Exploited:</strong> ${escapeHTML(revealMsg)}`;

      showToast('Clickjacking attack succeeded!', 'danger');
    };

    baitBtnEl.addEventListener('click', handler);

    resultBox.className = 'result-box';
    resultBox.innerHTML = '<span style="color:var(--orange)">⏳ Click the bait button in the sandbox above…</span>';
  }

  /* ---- Fixed demo ---- */
  function runFixed(type) {
    const blocked = sandbox.querySelector('.cj-blocked');
    const targetPage = sandbox.querySelector('.cj-target');
    const overlay = sandbox.querySelector('.cj-overlay');

    let payloadName;
    switch (type) {
      case 'prize':  payloadName = '"Claim Your Prize" overlay'; break;
      case 'video':  payloadName = '"Play Video" overlay'; break;
      case 'close':  payloadName = '"Close Ad" overlay'; break;
      default: return;
    }

    // Hide target, show blocked
    targetPage.style.display = 'none';
    overlay.classList.remove('active');
    blocked.classList.add('active');
    blocked.querySelector('h4').textContent = 'Framing Blocked!';
    blocked.querySelector('p').textContent =
      `The ${payloadName} tried to frame this page, but the X-Frame-Options: DENY header and CSP frame-ancestors 'none' directive prevented it. The browser refused to render the page inside an iframe.`;

    resultBox.className = 'result-box result-box--success';
    resultBox.innerHTML =
      `<strong style="color:var(--green)">✓ Blocked:</strong> The page cannot be embedded in an iframe. ` +
      `The browser enforces <code style="color:var(--cyan)">X-Frame-Options: DENY</code> and ` +
      `<code style="color:var(--cyan)">Content-Security-Policy: frame-ancestors 'none'</code>, so the clickjacking overlay has nothing to display.`;

    showToast('Clickjacking attempt blocked!', 'success');
  }

  /* ---- Reset demo ---- */
  function resetDemo() {
    const targetPage = sandbox.querySelector('.cj-target');
    const overlay    = sandbox.querySelector('.cj-overlay');
    const reveal     = sandbox.querySelector('.cj-reveal');
    const blocked    = sandbox.querySelector('.cj-blocked');

    targetPage.style.display = '';
    targetPage.querySelector('.cj-action-btn').style.boxShadow = '';
    targetPage.querySelector('.cj-action-btn').style.transform = '';
    overlay.classList.remove('active');
    overlay.style.opacity = '';
    overlay.style.transition = '';
    reveal.classList.remove('active');
    blocked.classList.remove('active');

    resultBox.className = 'result-box';
    resultBox.innerHTML = '<span style="color:var(--text-dim)">Click a payload button above to run the demo.</span>';
  }

  /* ---- Opacity slider for education ---- */
  const opacitySlider = document.getElementById('cj-opacity');
  if (opacitySlider) {
    opacitySlider.addEventListener('input', (e) => {
      const overlay = sandbox.querySelector('.cj-overlay');
      if (overlay.classList.contains('active')) {
        // Remove transition so the slider feels instant
        overlay.style.transition = 'none';
        overlay.style.opacity = e.target.value;
      }
    });
    // Restore transition when user releases the slider
    opacitySlider.addEventListener('change', () => {
      const overlay = sandbox.querySelector('.cj-overlay');
      overlay.style.transition = '';
    });
  }
>>>>>>> 3861762 (ahmad commit)
});
