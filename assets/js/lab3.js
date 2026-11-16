/**
 * Lab 3: DOM Clobbering
 * Interactive markup injector & namespace collision tester
 */

function loadClobberPayload(type) {
  const editor = document.getElementById('markupInput');
  if (!editor) return;

  if (type === 'form') {
    editor.value = '<form id="systemConfig"><input name="isAdmin" value="true"></form>';
  } else if (type === 'anchor') {
    editor.value = '<a id="systemConfig" name="isAdmin" href="#admin-override"></a>';
  } else if (type === 'benign') {
    editor.value = '<p>Great educational sandbox! Very clean UI.</p>';
  }
  Sandbox.resetSimulationStage();
  Sandbox.log(`Loaded payload markup: [${type}]`, "info");
}

function processMarkup() {
  const markupInput = document.getElementById('markupInput');
  const markup = markupInput ? markupInput.value : '';
  const sink = document.getElementById('clobberSink');
  const inspectBox = document.getElementById('variableInspection');
  const clobberedText = document.getElementById('clobberedStateText');
  const userView = document.getElementById('userVaultView');
  const adminView = document.getElementById('adminVaultView');
  const simStage = document.getElementById('sim-stage');
  const bannerVuln = document.getElementById('banner-vuln');
  const bannerFixed = document.getElementById('banner-fixed');
  const mode = Sandbox.getMode();

  if (!sink) return;

  // Clean old sink
  sink.innerHTML = '';
  try {
    delete window.systemConfig;
  } catch (e) {
    window.systemConfig = undefined;
  }

  // Inject markup into sink
  sink.innerHTML = markup;

  // Inspect global namespace property collision
  const clobberedObj = window.systemConfig;
  const hasClobbering = !!(clobberedObj && (clobberedObj.isAdmin || clobberedObj.name === 'isAdmin'));

  if (mode === 'vulnerable') {
    // VULNERABLE CHECK: Naive loose truthiness check
    if (hasClobbering) {
      if (userView) userView.style.display = 'none';
      if (adminView) adminView.style.display = 'block';
      if (clobberedText) {
        clobberedText.innerHTML = `<strong>Collision detected:</strong> window.systemConfig.isAdmin is ${clobberedObj.isAdmin || clobberedObj}`;
      }
      
      if (simStage) simStage.className = 'sim-stage state-vuln-triggered';
      if (bannerVuln) bannerVuln.style.display = 'flex';
      if (bannerFixed) bannerFixed.style.display = 'none';
      Sandbox.log(`DOM CLOBBERING EXPLOIT: Global reference hijacked by <${clobberedObj.tagName.toLowerCase()}> element. Admin panel rendered!`, "vuln");
    } else {
      if (userView) userView.style.display = 'block';
      if (adminView) adminView.style.display = 'none';
      if (inspectBox) {
        inspectBox.textContent = `window.systemConfig: ${clobberedObj ? clobberedObj.toString() : 'undefined'}`;
      }
      Sandbox.log("Normal content rendered. No authorization collision.", "info");
    }
  } else {
    // FIXED CHECK: Strict primitive boolean type verification
    // Never trust global elements; must be strict primitive boolean
    const isLegitAdmin = typeof clobberedObj?.isAdmin === 'boolean' && !(clobberedObj?.isAdmin instanceof HTMLElement);

    if (userView) userView.style.display = 'block';
    if (adminView) adminView.style.display = 'none';

    if (hasClobbering) {
      if (inspectBox) {
        inspectBox.innerHTML = `<span style="color: var(--fixed-color);">[DEFENSE TRIGGERED]</span> Clobbered DOM reference rejected. Type: <strong>${typeof clobberedObj} (${clobberedObj.constructor.name})</strong>`;
      }
      if (simStage) simStage.className = 'sim-stage state-fixed-blocked';
      if (bannerFixed) bannerFixed.style.display = 'flex';
      if (bannerVuln) bannerVuln.style.display = 'none';
      Sandbox.log(`DOM CLOBBERING BLOCKED: Target was an HTMLElement (${clobberedObj.constructor.name}), not a boolean. Denied access.`, "fixed");
    } else {
      if (inspectBox) inspectBox.textContent = `window.systemConfig: safe / unaffected`;
      Sandbox.log("Markup processed safely in hardened mode.", "fixed");
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  Sandbox.onModeChange(function() {
    processMarkup();
  });
});
