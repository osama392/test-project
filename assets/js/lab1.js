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
});
