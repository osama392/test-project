/**
 * Lab 2: Open URL Redirection
 * Interactive mock browser & payload controller
 */

let activePayload = {
  type: "phishing",
  name: "External Phishing Domain",
  url: "https://evil-phishing-bank.attacker/login",
  isDangerous: true
};

function loadRedirectPayload(type) {
  const mockParam = document.getElementById('mockParam');
  if (type === 'phishing') {
    activePayload = {
      type: "phishing",
      name: "External Phishing Domain",
      url: "https://evil-phishing-bank.attacker/login",
      isDangerous: true
    };
  } else if (type === 'protocol_relative') {
    activePayload = {
      type: "protocol_relative",
      name: "Protocol-Relative Bypass",
      url: "//malicious-credential-stealer.test/oauth",
      isDangerous: true
    };
  } else if (type === 'safe_internal') {
    activePayload = {
      type: "safe_internal",
      name: "Safe Relative Path",
      url: "/dashboard/profile",
      isDangerous: false
    };
  }

  if (mockParam) {
    mockParam.textContent = activePayload.url;
    mockParam.style.color = activePayload.isDangerous ? "#fca5a5" : "#6ee7b7";
  }
  resetBrowserView();
  Sandbox.log(`Payload loaded: [${activePayload.name}] -> ${activePayload.url}`, "info");
}

function resetBrowserView() {
  const safeView = document.getElementById('safePortalView');
  const phishingScreen = document.getElementById('phishingScreen');
  const mockHost = document.getElementById('mockHost');
  const mockPath = document.getElementById('mockPath');

  if (safeView) safeView.style.display = 'block';
  if (phishingScreen) phishingScreen.style.display = 'none';
  if (mockHost) mockHost.textContent = 'trusted-portal.42amman.edu';
  if (mockPath) mockPath.textContent = '/auth/login?next=';
  Sandbox.resetSimulationStage();
}

function executeRedirect() {
  const mode = Sandbox.getMode();
  const bannerVuln = document.getElementById('banner-vuln');
  const bannerFixed = document.getElementById('banner-fixed');
  const simStage = document.getElementById('sim-stage');
  const safeView = document.getElementById('safePortalView');
  const phishingScreen = document.getElementById('phishingScreen');
  const phishingDestText = document.getElementById('phishingDestText');
  const mockHost = document.getElementById('mockHost');
  const mockPath = document.getElementById('mockPath');
  const mockParam = document.getElementById('mockParam');

  if (mode === 'vulnerable') {
    if (activePayload.isDangerous) {
      if (safeView) safeView.style.display = 'none';
      if (phishingScreen) phishingScreen.style.display = 'block';
      if (phishingDestText) phishingDestText.textContent = activePayload.url;
      
      // Update address bar to show phishing domain
      if (mockHost) mockHost.textContent = activePayload.url.replace(/https?:\/\//, '');
      if (mockPath) mockPath.textContent = '';
      if (mockParam) mockParam.textContent = '';

      if (simStage) simStage.className = 'mock-viewport state-vuln-triggered';
      if (bannerVuln) bannerVuln.style.display = 'flex';
      if (bannerFixed) bannerFixed.style.display = 'none';
      Sandbox.log(`OPEN REDIRECT EXPLOITED: User navigated to untrusted origin -> ${activePayload.url}`, "vuln");
    } else {
      // Safe relative route
      Sandbox.log(`Safe internal redirect followed: ${activePayload.url}`, "fixed");
    }
  } else {
    // Fixed Mode: Strict Allow-List Regex Check
    // Relative path only, single slash, no double slashes //
    const isSafe = /^\/(?!\/)[a-zA-Z0-9_\-\/]+$/.test(activePayload.url);

    if (isSafe) {
      Sandbox.log(`ALLOW-LIST PASS: Safe internal route accepted -> ${activePayload.url}`, "fixed");
      if (bannerFixed) bannerFixed.style.display = 'flex';
      if (bannerVuln) bannerVuln.style.display = 'none';
      if (simStage) simStage.className = 'mock-viewport state-fixed-blocked';
    } else {
      // Blocked!
      if (mockHost) mockHost.textContent = 'trusted-portal.42amman.edu';
      if (mockPath) mockPath.textContent = '/dashboard';
      if (mockParam) {
        mockParam.textContent = ' [BLOCKED TARGET]';
        mockParam.style.color = '#10b981';
      }

      if (simStage) simStage.className = 'mock-viewport state-fixed-blocked';
      if (bannerFixed) bannerFixed.style.display = 'flex';
      if (bannerVuln) bannerVuln.style.display = 'none';
      Sandbox.log(`REDIRECT BLOCKED: Allow-list rejected untrusted destination [${activePayload.url}]. Defaulted to /dashboard.`, "fixed");
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  Sandbox.onModeChange(function() {
    resetBrowserView();
  });
});
