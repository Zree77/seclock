/* Seclock — Legally-Aware Digital Inheritance & Emergency Access Vault JS Engine */

// Multilingual i18n Dictionary (English, Malayalam, Hindi)
const i18n = {
  en: {
    tab_setup: "1. Vault Setup & Cryptography",
    tab_liveness: "2. Multi-Channel Liveness",
    tab_ocr: "3. Legal Document OCR Proof",
    tab_wizard: "4. Vernacular Nominee Recovery",
    tab_staged: "5. Staged Disclosure Tiers",
    tab_ledger: "6. Tamper-Evident Audit Ledger",
    tab_security: "7. Security & Owner Veto",
    setup_title: "User Onboarding & Threshold Key Generation",
    setup_subtitle: "Client-side AES-256 vault encryption combined with Shamir's Secret Sharing (3-of-5 threshold). No single nominee or server holds the master key.",
    owner_header: "Account Owner Profile",
    nominee_header: "Nominee Share Holders (3-of-5 Threshold)",
    assets_header: "Pre-Configured Asset Tiers",
    btn_encrypt_setup: "Encrypt Vault & Generate 5 Shamir Shares",
    liveness_title: "Multi-Channel Liveness Verification & Escalation Ladder",
    liveness_subtitle: "Prevents false triggers due to loss of internet or smartphones. Check-ins escalate through Mobile App -> SMS Reply -> IVR Automated Voice Call.",
    ocr_title: "Legal Document Verification Module (India Specific)",
    ocr_subtitle: "Vault release requires documentary legal proof (Death Certificate / Legal Heirship Certificate) verified against Indian government certificate structures — preventing false or silent triggers.",
    wizard_title: "Guided Vernacular Nominee Recovery Wizard",
    wizard_subtitle: "Designed for non-technical, grieving family members. Guides step-by-step in Malayalam, Hindi, or English.",
    wiz_step1_label: "Identity & Doc Proof",
    wiz_step2_label: "Key Share Entry",
    wiz_step3_label: "Threshold Reconstruction",
    wiz_s1_title: "Step 1: Confirm Nominee Identity & Legal Proof",
    wiz_s1_desc: "Select your name from the registered nominee list and verify that the legal document has been approved.",
    wiz_s2_title: "Step 2: Enter Shamir Nominee Key Shares",
    wiz_s2_desc: "Reconstruction requires at least 3 nominee key shares. Submit nominee shares below:",
    wiz_s3_title: "Step 3: Vault Decrypted & Staged Release Ready",
    staged_title: "Staged / Partial Disclosure Management",
    staged_subtitle: "Prevents an all-or-nothing data dump. Releasing urgent bank & insurance details first, followed by credentials and personal memory vaults.",
    ledger_title: "Tamper-Evident SHA-256 Hash-Chained Audit Ledger",
    ledger_subtitle: "Every check-in, missed cycle, document submission, and share submission is cryptographically hash-chained for legal defensibility in probate court.",
    security_title: "Security Anomaly Monitor & Account Owner Veto",
    security_subtitle: "Detects malicious claim attempts or false liveness triggers. Provides living account owners a 1-click emergency abort veto button."
  },
  ml: {
    tab_setup: "1. വോൾട്ട് ക്രമീകരണം (Vault Setup)",
    tab_liveness: "2. തത്സമയ പരിശോധന (Liveness)",
    tab_ocr: "3. നിയമപരമായ രേഖ പരിശോധന (OCR)",
    tab_wizard: "4. അവകാശികളുടെ വീണ്ടെടുക്കൽ (Recovery)",
    tab_staged: "5. ഘട്ടങ്ങളായുള്ള വെളിപ്പെടുത്തൽ",
    tab_ledger: "6. തട്ടിപ്പ് തടയുന്ന ഓഡിറ്റ് ലെഡ്ജർ",
    tab_security: "7. സുരക്ഷയും റദ്ദാക്കലും (Veto)",
    setup_title: "ഉപയോക്തൃ രജിസ്ട്രേഷനും സുരക്ഷിത കീ നിർമ്മാണവും",
    setup_subtitle: "ക്ലയന്റ് അധിഷ്ഠിത AES-256 എൻക്രിപ്ഷനും ഷാമിർ സീക്രട്ട് ഷെയറിംഗും (3/5 ത്രെഷോൾഡ്). ഒരൊറ്റ അവകാശിക്കോ സെർവറിനോ മാസ്റ്റർ കീ ലഭിക്കില്ല.",
    owner_header: "അക്കൗണ്ട് ഉടമയുടെ വിവരങ്ങൾ",
    nominee_header: "അവകാശികളുടെ വിവരങ്ങൾ (3-of-5 ത്രെഷോൾഡ്)",
    assets_header: "ഡിജിറ്റൽ സ്വത്തുക്കളുടെ വിവരങ്ങൾ",
    btn_encrypt_setup: "വോൾട്ട് എൻക്രിപ്റ്റ് ചെയ്തു 5 താക്കോൽ ഭാഗങ്ങൾ നിർമ്മിക്കുക",
    liveness_title: "വിവിധ മാധ്യമങ്ങളിലൂടെയുള്ള തത്സമയ പരിശോധന",
    liveness_subtitle: "സ്മാർട്ട്ഫോൺ അല്ലെങ്കിൽ ഇന്റർനെറ്റ് ഇല്ലെങ്കിലും പ്രവർത്തിക്കും. ആപ്പ് -> SMS -> IVR വോയിസ് കോൾ വഴി പരിശോധന നടത്താം.",
    ocr_title: "ഇന്ത്യൻ നിയമപരമായ രേഖ പരിശോധന (OCR)",
    ocr_subtitle: "മരണ സർട്ടിഫിക്കറ്റ് അല്ലെങ്കിൽ ലീഗൽ ഹെയർഷിപ്പ് സർട്ടിഫിക്കറ്റ് പരിശോധിച്ച ശേഷം മാത്രമേ ഡാറ്റ റിലീസ് ചെയ്യൂ.",
    wizard_title: "അവകാശികൾക്കുള്ള ലളിതമായ വീണ്ടെടുക്കൽ സഹായം",
    wizard_subtitle: "സാങ്കേതിക പരിജ്ഞാനമില്ലാത്ത ദുഃഖിതരായ കുടുംബാംഗങ്ങൾക്കായി മലയാളത്തിൽ ഘട്ടം ഘട്ടമായുള്ള വഴികാട്ടി.",
    wiz_step1_label: "തിരിച്ചറിയലും രേഖയും",
    wiz_step2_label: "കീ വിവരങ്ങൾ നൽകുക",
    wiz_step3_label: "താക്കോൽ പുനർനിർമ്മാണം",
    wiz_s1_title: "ഘട്ടം 1: അവകാശിയുടെ വ്യക്തിത്വവും രേഖയും ഉറപ്പാക്കുക",
    wiz_s1_desc: "രജിസ്റ്റർ ചെയ്ത അവകാശികളുടെ പട്ടികയിൽ നിന്ന് നിങ്ങളുടെ പേര് തിരഞ്ഞെടുക്കുക.",
    wiz_s2_title: "ഘട്ടം 2: അവകാശികളുടെ രഹസ്യ താക്കോലുകൾ നൽകുക",
    wiz_s2_desc: "അൺലോക്ക് ചെയ്യാൻ കുറഞ്ഞത് 3 അവകാശികളുടെ താക്കോൽ ഭാഗങ്ങൾ ആവശ്യമാണ്.",
    wiz_s3_title: "ഘട്ടം 3: വോൾട്ട് അൺലോക്ക് ചെയ്തു - വിവരങ്ങൾ ലഭ്യമാണ്",
    staged_title: "ഘട്ടങ്ങളായുള്ള വിവര വെളിപ്പെടുത്തൽ",
    staged_subtitle: "ആദ്യം ബാങ്ക്, ഇൻഷുറൻസ് വിവരങ്ങൾ, തുടർന്ന് സോഷ്യൽ മീഡിയ, വ്യക്തിഗത ഓർമ്മക്കുറിപ്പുകൾ നൽകുന്നു.",
    ledger_title: "സുരക്ഷിത SHA-256 ഡിജിറ്റൽ ഓഡിറ്റ് ലെഡ്ജർ",
    ledger_subtitle: "കോടതിയിൽ തെളിവായി നൽകാൻ കഴിയുന്ന മാറ്റം വരുത്താനാകാത്ത ഡിജിറ്റൽ റെക്കോർഡ്.",
    security_title: "സുരക്ഷാ മുന്നറിയിപ്പും എമർജൻസി റദ്ദാക്കലും",
    security_subtitle: "തെറ്റായ അവകാശവാദങ്ങൾ ഉണ്ടായാൽ അക്കൗണ്ട് ഉടമയ്ക്ക് 1-ക്ലിക്ക് വഴി പ്രക്രിയ റദ്ദാക്കാം."
  },
  hi: {
    tab_setup: "1. वॉल्ट सेटअप और कुंजी निर्माण",
    tab_liveness: "2. बहु-चैनल लाइवनेस जांच",
    tab_ocr: "3. कानूनी दस्तावेज सत्यापन (OCR)",
    tab_wizard: "4. नामांकित व्यक्ति पुनर्प्राप्ति विजार्ड",
    tab_staged: "5. चरणबद्ध प्रकटीकरण",
    tab_ledger: "6. छेड़छाड़-मुक्त ऑडिट लेजर",
    tab_security: "7. सुरक्षा और मालिक का वीटो",
    setup_title: "उपयोगकर्ता पंजीकरण और गुप्त कुंजी विभाजन",
    setup_subtitle: "क्लाइंट-साइड AES-256 एन्क्रिप्शन और शामिर सीक्रेट शेयरिंग (3-of-5 थ्रेशोल्ड)।",
    owner_header: "खाता धारक प्रोफ़ाइल",
    nominee_header: "नामांकित व्यक्ति (3-of-5 थ्रेशोल्ड)",
    assets_header: "डिजिटल संपत्ति विवरण",
    btn_encrypt_setup: "वॉल्ट एन्क्रिप्ट करें और 5 शेयर उत्पन्न करें",
    liveness_title: "बहु-चैनल लाइवनेस सत्यापन",
    liveness_subtitle: "मोबाइल ऐप -> एसएमएस उत्तर -> आईवीआर स्वचालित फोन कॉल के माध्यम से सत्यापन।",
    ocr_title: "कानूनी दस्तावेज सत्यापन (भारत विशिष्ट)",
    ocr_subtitle: "मृत्यु प्रमाण पत्र / कानूनी वारिस प्रमाण पत्र के सत्यापन के बाद ही वॉल्ट अनलॉक होता है।",
    wizard_title: "नामांकित व्यक्ति के लिए सरल पुनर्प्राप्ति गाइड",
    wizard_subtitle: "गैर-तकनीकी और दुखी परिवार के सदस्यों के लिए हिंदी में चरण-दर-चरण मार्गदर्शन।",
    wiz_step1_label: "पहचान और दस्तावेज",
    wiz_step2_label: "कुंजी शेयर दर्ज करें",
    wiz_step3_label: "पुनर्प्राप्ति और अनलॉक",
    wiz_s1_title: "चरण 1: नामांकित व्यक्ति की पहचान की पुष्टि करें",
    wiz_s1_desc: "नामांकित सूची से अपना नाम चुनें और दस्तावेज सत्यापन की जांच करें।",
    wiz_s2_title: "चरण 2: नामांकित व्यक्ति की चाबी शेयर दर्ज करें",
    wiz_s2_desc: "अनलॉक करने के लिए कम से कम 3 शेयर की आवश्यकता है।",
    wiz_s3_title: "चरण 3: वॉल्ट अनलॉक हो गया है",
    staged_title: "चरणबद्ध प्रकटीकरण प्रबंधन",
    staged_subtitle: "पहले बैंक और बीमा विवरण, फिर क्रेडेंशियल्स जारी करता है।",
    ledger_title: "छेड़छाड़-मुक्त ऑडिट लेजर",
    ledger_subtitle: "अदालत के लिए डिजिटल रूप से हस्ताक्षरित अपरिवर्तनीय रिकॉर्ड।",
    security_title: "सुरक्षा चेतावनी और आपातकालीन वीटो",
    security_subtitle: "गलत दावों के मामले में 1-क्लिक आपातकालीन रद्द करने की सुविधा।"
  }
};

let currentLang = 'en';
let globalState = {};
let currentVerifyMode = 'owner';

// On DOM Load
document.addEventListener('DOMContentLoaded', () => {
  fetchState();
  loadSampleCertificate();
  loadOwnerKeyPreview();
});

// Switch Vernacular Language
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  if (lang === 'ml') document.body.style.fontFamily = "var(--font-malayalam), var(--font-body)";
  else if (lang === 'hi') document.body.style.fontFamily = "var(--font-hindi), var(--font-body)";
  else document.body.style.fontFamily = "var(--font-body)";
}

// Switch Navigation Tab
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById(tabId).classList.add('active');
  if (tabId === 'tab-ledger') loadAuditLedger();
  if (tabId === 'tab-wizard') populateWizardNominees();
  if (tabId === 'tab-verify') { loadOwnerKeyPreview(); populateNomineeRoster(); }
}

// ─── IDENTITY VERIFICATION MODULE ─────────────────────────────────────────────

function setVerifyMode(mode) {
  currentVerifyMode = mode;
  const ownerPanel  = document.getElementById('verify-owner-panel');
  const nomPanel    = document.getElementById('verify-nominee-panel');
  const btnOwner    = document.getElementById('toggle-owner-mode');
  const btnNom      = document.getElementById('toggle-nominee-mode');

  if (mode === 'owner') {
    ownerPanel.style.display = 'block';
    nomPanel.style.display   = 'none';
    btnOwner.className = 'btn btn-primary';
    btnNom.className   = 'btn btn-secondary';
    loadOwnerKeyPreview();
  } else {
    ownerPanel.style.display = 'none';
    nomPanel.style.display   = 'block';
    btnOwner.className = 'btn btn-secondary';
    btnNom.className   = 'btn btn-primary';
    btnNom.style.background  = 'linear-gradient(135deg, var(--accent-purple), #6d28d9)';
    populateNomineeRoster();
  }
}

async function loadOwnerKeyPreview() {
  try {
    const res  = await fetch('/api/verify/owner-key');
    if (!res.ok) return;
    const data = await res.json();
    const box  = document.getElementById('owner-key-preview');
    if (!box) return;
    box.innerHTML = `
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.3rem 1rem; color: var(--primary-cyan);">
        <span style="color: var(--text-muted);">Owner Name</span>   <span>${data.owner_name}</span>
        <span style="color: var(--text-muted);">Phone</span>         <span>${data.phone}</span>
        <span style="color: var(--text-muted);">Auth Method</span>   <span style="color: var(--accent-emerald);">SHA-256 Salted Passphrase Hash</span>
        <span style="color: var(--text-muted);">Hash Preview</span>  <span>${data.passphrase_hash_preview}</span>
        <span style="color: var(--text-muted);">Salt Preview</span>  <span>${data.salt_preview}</span>
      </div>
    `;
  } catch (e) { /* silent */ }
}

function togglePassphraseVisibility() {
  const input = document.getElementById('owner-passphrase-input');
  const icon  = document.getElementById('pass-eye-icon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    icon.setAttribute('data-lucide', 'eye');
  }
  lucide.createIcons();
}

async function verifyOwnerIdentity() {
  const passphrase = document.getElementById('owner-passphrase-input').value.trim();
  if (!passphrase) { alert('Please enter your vault passphrase.'); return; }

  const resultBox = document.getElementById('owner-verify-result');
  resultBox.innerHTML = `<div style="color: var(--text-muted); text-align:center;">Verifying...</div>`;

  try {
    const res  = await fetch('/api/verify/owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase })
    });

    if (!res.ok) {
      const err = await res.json();
      resultBox.innerHTML = `
        <div style="background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.4); border-radius: var(--radius-md); padding: 1.25rem; color: #fecdd3; text-align: left;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem;">
            <i data-lucide="shield-x" style="color:var(--accent-rose);"></i>
            <strong>VERIFICATION FAILED</strong>
          </div>
          <div style="font-size:0.85rem;">${err.detail}</div>
        </div>`;
      lucide.createIcons();
      return;
    }

    const data = await res.json();
    resultBox.innerHTML = `
      <div style="background: rgba(16,185,129,0.12); border: 1px solid #34d399; border-radius: var(--radius-md); padding: 1.5rem; text-align: left;">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
          <i data-lucide="shield-check" style="width:36px;height:36px;color:var(--accent-emerald);"></i>
          <div>
            <div style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; color:#34d399;">IDENTITY VERIFIED</div>
            <div style="font-size:0.8rem; color: var(--text-muted);">Access Level: ${data.access_level}</div>
          </div>
        </div>
        <div style="display:grid; gap:0.5rem; font-size:0.85rem; font-family: var(--font-mono); background: rgba(7,9,19,0.6); padding: 1rem; border-radius: var(--radius-sm);">
          <div><span style="color:var(--text-muted);">Owner Name </span><span style="color:#fff;">${data.owner_name}</span></div>
          <div><span style="color:var(--text-muted);">Encryption  </span><span style="color:var(--primary-cyan);">${data.key_info.encryption}</span></div>
          <div><span style="color:var(--text-muted);">Key Split   </span><span style="color:var(--primary-cyan);">${data.key_info.key_split}</span></div>
          <div><span style="color:var(--text-muted);">Role        </span><span style="color:var(--accent-amber);">${data.key_info.your_role}</span></div>
          <div><span style="color:var(--text-muted);">Veto Power  </span><span style="color:var(--accent-emerald);">✓ YES</span></div>
          <div><span style="color:var(--text-muted);">Session Token </span><span style="color:var(--text-muted);">${data.session_token.substring(0,20)}...</span></div>
        </div>
      </div>`;
    lucide.createIcons();
    fetchState();
  } catch (err) {
    resultBox.innerHTML = `<div style="color:var(--accent-rose);">Error: ${err.message}</div>`;
  }
}

async function populateNomineeRoster() {
  const roster  = document.getElementById('nominees-share-roster');
  const select  = document.getElementById('nominee-verify-select');
  if (!roster || !select) return;

  try {
    const res  = await fetch('/api/state');
    const data = await res.json();
    const nominees = data.nominees || [];

    select.innerHTML = '';
    roster.innerHTML = '';

    nominees.forEach((nom, i) => {
      const opt = document.createElement('option');
      opt.value = nom.name;
      opt.textContent = `${nom.name} (${nom.relation || 'Nominee'})`;
      select.appendChild(opt);

      const card = document.createElement('div');
      card.style.cssText = `background: rgba(7,9,19,0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-sm); padding: 0.85rem; cursor: pointer; transition: all 0.2s;`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <span style="font-weight:600; color:#fff;">${nom.name}</span>
          <span style="font-size:0.75rem; background: rgba(139,92,246,0.2); color: var(--accent-purple); padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(139,92,246,0.3);">Share #${nom.assigned_share_index || (i+1)}</span>
        </div>
        <div style="font-size:0.75rem; color: var(--text-muted); margin-bottom:0.3rem;">${nom.relation || 'Nominee'} · ${nom.phone || ''}</div>
        <div style="font-family: var(--font-mono); font-size:0.7rem; color: var(--accent-purple); word-break: break-all;">${nom.formatted_share || 'SECLOCK-SHARE-' + (i+1) + '-...'}</div>
        ${nom.public_commitment ? `<div style="font-size:0.7rem; color:var(--text-dim); margin-top:0.25rem;">Public Commitment: <span style="color:var(--text-muted);">${nom.public_commitment}</span></div>` : ''}
      `;
      card.addEventListener('mouseenter', () => card.style.borderColor = 'rgba(139,92,246,0.5)');
      card.addEventListener('mouseleave', () => card.style.borderColor = 'var(--glass-border)');
      card.addEventListener('click', () => {
        select.value = nom.name;
        if (nom.assigned_share_hex) {
          document.getElementById('nominee-share-input').value = nom.assigned_share_hex;
        }
      });
      roster.appendChild(card);
    });
  } catch(e) { /* silent */ }
}

async function verifyNomineeIdentity() {
  const name      = document.getElementById('nominee-verify-select').value;
  const shareHex  = document.getElementById('nominee-share-input').value.trim();
  const resultBox = document.getElementById('nominee-verify-result');

  if (!name)     { alert('Please select your nominee name.'); return; }
  if (!shareHex) { alert('Please enter your allocated Shamir key share.'); return; }

  resultBox.innerHTML = `<div style="color: var(--text-muted);">Verifying cryptographic share...</div>`;

  try {
    const res = await fetch('/api/verify/nominee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nominee_name: name, share_hex: shareHex })
    });

    if (!res.ok) {
      const err = await res.json();
      resultBox.innerHTML = `
        <div style="background:rgba(244,63,94,0.15); border:1px solid rgba(244,63,94,0.4); border-radius:var(--radius-md); padding:1.25rem; color:#fecdd3;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem;">
            <i data-lucide="key-round" style="color:var(--accent-rose);"></i>
            <strong>KEY SHARE INVALID</strong>
          </div>
          <div style="font-size:0.85rem;">${err.detail}</div>
        </div>`;
      lucide.createIcons();
      return;
    }

    const data = await res.json();
    resultBox.innerHTML = `
      <div style="background:rgba(16,185,129,0.12); border:1px solid #34d399; border-radius:var(--radius-md); padding:1.5rem;">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
          <i data-lucide="key" style="width:32px;height:32px;color:var(--accent-emerald);"></i>
          <div>
            <div style="font-family:var(--font-heading); font-size:1.05rem; font-weight:700; color:#34d399;">NOMINEE KEY VERIFIED</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${data.relation} — ${data.access_level}</div>
          </div>
        </div>
        <div style="display:grid; gap:0.5rem; font-size:0.82rem; font-family:var(--font-mono); background:rgba(7,9,19,0.6); padding:1rem; border-radius:var(--radius-sm);">
          <div><span style="color:var(--text-muted);">Nominee     </span><span style="color:#fff;">${data.nominee_name}</span></div>
          <div><span style="color:var(--text-muted);">Share Index </span><span style="color:var(--primary-cyan);">#${data.key_info.share_index} of ${data.key_info.threshold_required.split('-of-')[1]}</span></div>
          <div><span style="color:var(--text-muted);">Share Ref   </span><span style="color:var(--accent-purple);">${data.key_info.share_preview}</span></div>
          <div><span style="color:var(--text-muted);">Commitment  </span><span style="color:var(--text-muted);">${data.key_info.public_commitment}</span></div>
          <div><span style="color:var(--text-muted);">HMAC Check  </span><span style="color:var(--accent-amber);">${data.key_info.hmac_checksum}</span></div>
          <div><span style="color:var(--text-muted);">Role        </span><span style="color:var(--accent-amber);">${data.key_info.your_role}</span></div>
          <div><span style="color:var(--text-muted);">Threshold   </span><span style="color:var(--accent-emerald);">${data.key_info.threshold_required} shares required to reconstruct vault</span></div>
        </div>
      </div>`;
    lucide.createIcons();
    fetchState();
  } catch (err) {
    resultBox.innerHTML = `<div style="color:var(--accent-rose);">Error: ${err.message}</div>`;
  }
}

// ─── END IDENTITY VERIFICATION MODULE ─────────────────────────────────────────

// Fetch System State from Backend REST API
async function fetchState() {
  try {
    const res = await fetch('/api/state');
    globalState = await res.json();
    updateUIState();
  } catch (err) {
    console.error("Failed to fetch state:", err);
  }
}

// Update UI Indicators
function updateUIState() {
  const pill = document.getElementById('nav-liveness-pill');
  const text = document.getElementById('nav-liveness-text');

  if (globalState.veto_triggered) {
    pill.className = 'status-pill expired';
    text.textContent = 'EMERGENCY OWNER VETO ACTIVE';
    return;
  }

  if (globalState.liveness_status === 'ACTIVE') {
    pill.className = 'status-pill active';
    text.textContent = `VAULT ACTIVE (${globalState.check_in_interval_days} Days Frequency)`;
  } else if (globalState.liveness_status === 'WARNING') {
    pill.className = 'status-pill warning';
    text.textContent = 'LIVENESS CHECK-IN DUE';
  } else {
    pill.className = 'status-pill expired';
    text.textContent = 'LIVENESS EXPIRED (ESCALATED)';
  }
}

// Handle Vault Setup Submission
async function handleVaultSetup(e) {
  e.preventDefault();

  const ownerName = document.getElementById('owner-name').value;
  const ownerPhone = document.getElementById('owner-phone').value;
  const checkinDays = parseInt(document.getElementById('checkin-days').value);

  const nomineeNames = document.querySelectorAll('.nominee-name');
  const nomineePhones = document.querySelectorAll('.nominee-phone');
  const nominees = [];

  for (let i = 0; i < nomineeNames.length; i++) {
    if (nomineeNames[i].value.trim()) {
      nominees.push({
        name: nomineeNames[i].value.trim(),
        phone: nomineePhones[i].value.trim() || "+91 90000 0000" + i,
        relation: i === 0 ? "Daughter" : (i === 1 ? "Son" : "Nominee")
      });
    }
  }

  let tier1, tier2, tier3;
  try {
    tier1 = JSON.parse(document.getElementById('tier1-input').value);
    tier2 = JSON.parse(document.getElementById('tier2-input').value);
    tier3 = JSON.parse(document.getElementById('tier3-input').value);
  } catch (err) {
    alert("Invalid JSON format in Asset Tiers.");
    return;
  }

  const payload = {
    owner_name: ownerName,
    owner_phone: ownerPhone,
    owner_email: "ramachandran.kv@gmail.com",
    preferred_channels: ["App", "SMS", "IVR"],
    check_in_interval_days: checkinDays,
    nominees: nominees,
    tier1_assets: tier1,
    tier2_assets: tier2,
    tier3_assets: tier3
  };

  try {
    const res = await fetch('/api/vault/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.status === 'SUCCESS') {
      displaySharesGrid(data.shares, data.nominees);
      fetchState();
      alert("Vault setup complete! Master key split into 5 Shamir shares with a 3-of-5 threshold.");
    } else {
      alert("Vault Setup Error: " + (data.detail || "Unknown error"));
    }
  } catch (err) {
    console.error("Setup error:", err);
  }
}

// Handle Custom Certificate File Upload from User's Computer
function handleCertificateFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const dropTitle = document.getElementById('dropzone-title');
  const dropSub = document.getElementById('dropzone-subtitle');
  dropTitle.textContent = `Uploaded File: ${file.name}`;
  dropSub.textContent = `File Size: ${(file.size / 1024).toFixed(1)} KB | Type: ${file.type || 'Custom File'}`;

  // If Image file, show live image preview
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('cert-preview-img').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Read text content
  const textReader = new FileReader();
  textReader.onload = function(e) {
    let content = e.target.result;

    // If file is an image, simulate real OCR extraction text for the uploaded image
    if (file.type.startsWith('image/')) {
      content = `
[OCR EXTRACTED PAYLOAD FROM UPLOADER: ${file.name}]
GOVERNMENT OF KERALA / INDIA
DEPARTMENT OF ECONOMICS AND STATISTICS / UIDAI
FORM NO. 6 — CERTIFICATE VERIFICATION
Registration Number: KL-D-2025-098412
Pramaan ID: JP-98471029348
Date of Issue: 10/08/2026
Name of Person: K. V. RAMACHANDRAN NAIR
Nominee / Informant Name: PRIYA RAMACHANDRAN
Biometric Status: AADHAAR IRIS & FINGERPRINT VERIFIED
Issuing Authority: SUB-REGISTRAR / TAHSILDAR OFFICE
      `.trim();
    }

    document.getElementById('ocr-text-input').value = content;
    alert(`File "${file.name}" uploaded successfully! OCR text payload extracted.`);
  };

  if (file.type.startsWith('image/')) {
    // For images, read as data URL and populate simulated OCR payload
    textReader.readAsDataURL(file);
  } else {
    textReader.readAsText(file);
  }
}

// Display Generated Shares Grid
function displaySharesGrid(shares, nominees) {
  const box = document.getElementById('generated-shares-box');
  const grid = document.getElementById('shares-list-grid');
  box.style.display = 'block';
  grid.innerHTML = '';

  shares.forEach((share, i) => {
    const nomineeName = nominees[i] ? nominees[i].name : `Nominee ${i+1}`;
    const card = document.createElement('div');
    card.className = 'share-badge';
    card.innerHTML = `
      <span class="share-index-tag">Nominee Share #${share.share_index} (${nomineeName})</span>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">Key Share (256-bit Galois Polynomial Point):</div>
      <div style="color: var(--primary-cyan); font-weight: 600;">${share.share_hex}</div>
    `;
    grid.appendChild(card);
  });
}

// Liveness Simulation Handlers
async function simulateCheckIn(channel, code) {
  try {
    const res = await fetch('/api/liveness/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, response_code: code })
    });
    const data = await res.json();
    fetchState();
    alert(`Check-in verified via ${channel}. Liveness timer reset to ACTIVE.`);
  } catch (err) {
    console.error("Check-in error:", err);
  }
}

async function simulateMissedCycle() {
  try {
    const res = await fetch('/api/liveness/simulate-miss', { method: 'POST' });
    const data = await res.json();
    fetchState();
    alert("Missed cycle simulated! Liveness status set to EXPIRED.");
  } catch (err) {
    console.error("Simulate miss error:", err);
  }
}

// SMS Simulator Modals
function openSMSSimulator() {
  document.getElementById('simulators-display-grid').style.display = 'grid';
  document.getElementById('sms-phone-container').scrollIntoView({ behavior: 'smooth' });
}

function sendSMSResponse() {
  const code = document.getElementById('sms-input-field').value;
  const chatBox = document.getElementById('sms-chat-box');

  const outBubble = document.createElement('div');
  outBubble.className = 'sms-bubble outgoing';
  outBubble.textContent = code;
  chatBox.appendChild(outBubble);

  setTimeout(() => {
    const inBubble = document.createElement('div');
    inBubble.className = 'sms-bubble incoming';
    inBubble.innerHTML = `[SECLOCK VERIFIED]<br>Thank you Ramachandran. Liveness check-in confirmed via SMS.`;
    chatBox.appendChild(inBubble);
    simulateCheckIn('SMS', code);
  }, 600);
}

// IVR Simulator
function openIVRSimulator() {
  document.getElementById('simulators-display-grid').style.display = 'grid';
  document.getElementById('ivr-phone-container').scrollIntoView({ behavior: 'smooth' });
}

function pressIVRKey(digit) {
  const status = document.getElementById('ivr-voice-status');
  if (digit === '1') {
    status.style.color = '#34d399';
    status.innerHTML = `DTMF Key '1' Pressed.<br>"Thank you! Your liveness check-in has been confirmed."`;
    setTimeout(() => {
      simulateCheckIn('IVR', 'DTMF_KEY_1');
    }, 500);
  } else {
    status.style.color = '#f43f5e';
    status.innerHTML = `DTMF Key '${digit}' Pressed.<br>"Invalid keypress. Please press 1 to confirm."`;
  }
}

// Load Sample Death Certificate Text
function loadSampleCertificate() {
  document.getElementById('cert-preview-img').src = '/sample_certificates/sample_death_certificate.png';
  const text = `
GOVERNMENT OF KERALA
DEPARTMENT OF ECONOMICS AND STATISTICS
FORM NO. 6 — DEATH CERTIFICATE
(Issued under Section 12/17 of the Registration of Births and Deaths Act, 1969)

Registration Number: KL-D-2025-098412
Date of Registration: 18/05/2025
Name of Deceased: K. V. RAMACHANDRAN NAIR
Sex / Age: MALE / 74 YEARS
Date of Death: 14/05/2025
Place of Death: KOZHIKODE MEDICAL CENTER, KERALA
Father's / Husband's Name: LATE UNNIKRISHNAN NAIR
Permanent Address: HOUSE NO. 42/108, CHEVAYUR, KOZHIKODE - 673017
Nominee / Informant Name: PRIYA RAMACHANDRAN (DAUGHTER)
Relationship: DAUGHTER & REGISTERED LEGAL HEIR
Issuing Authority: SUB-REGISTRAR / TAHSILDAR OFFICE, KOZHIKODE
  `;
  document.getElementById('ocr-text-input').value = text.trim();
  document.getElementById('dropzone-title').textContent = "Sample Death Certificate (Form 6) Loaded";
}

// Load Sample Life Certificate (Jeevan Pramaan) Text
function loadSampleLifeCertificate() {
  document.getElementById('cert-preview-img').src = '/sample_certificates/sample_life_certificate.png';
  const text = `
GOVERNMENT OF INDIA
JEEVAN PRAMAAN — DIGITAL LIFE CERTIFICATE
(Biometric Pensioner Life Verification)

Pramaan ID (Certificate No): JP-98471029348
Date of Issue: 10/08/2026
Account Owner / Pensioner: K. V. RAMACHANDRAN NAIR
Aadhaar Number (Masked): XXXX-XXXX-8912
Biometric Status: AADHAAR IRIS & FINGERPRINT VERIFIED
Verification Center / Portal: JEEVAN PRAMAAN ONLINE PORTAL / UIDAI
Validity Period: VALID UNTIL AUGUST 2027
Status: ACTIVE — PERSON CONFIRMED ALIVE
  `;
  document.getElementById('ocr-text-input').value = text.trim();
}

// Verify Owner Life Certificate (Jeevan Pramaan)
async function verifyOwnerLifeCertificate() {
  const text = document.getElementById('ocr-text-input').value;
  try {
    const res = await fetch('/api/liveness/upload-life-certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_text: text })
    });
    const data = await res.json();

    const box = document.getElementById('ocr-results-box');
    box.style.display = 'block';

    const isVerified = data.status === 'VERIFIED_ALIVE';
    box.style.background = isVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.15)';
    box.style.borderColor = isVerified ? '#34d399' : 'rgba(244, 63, 94, 0.4)';
    box.style.color = isVerified ? '#a7f3d0' : '#fecdd3';

    box.innerHTML = `
      <i data-lucide="${isVerified ? 'award' : 'alert-triangle'}" class="alert-icon"></i>
      <div>
        <h4 style="margin-bottom: 0.25rem;">Life Certificate Result: ${data.status} (Confidence: ${data.confidence_score}%)</h4>
        <div style="font-size: 0.85rem;">
          <strong>Pramaan ID:</strong> ${data.extracted_data.pramaan_id} | 
          <strong>Owner Name:</strong> ${data.extracted_data.owner_name} | 
          <strong>Status:</strong> CONFIRMED ALIVE & ACTIVE
        </div>
        <div style="font-size: 0.8rem; margin-top: 0.4rem; opacity: 0.9;">
          <strong>Biometric Verification:</strong> ${data.extracted_data.biometric_verification} | 
          <strong>Authority:</strong> ${data.extracted_data.issuing_authority}
        </div>
      </div>
    `;
    lucide.createIcons();
    fetchState();
    if (isVerified) {
      alert("Digital Life Certificate Verified! Liveness timer successfully reset to ACTIVE.");
    }
  } catch (err) {
    console.error("Life Certificate verification error:", err);
  }
}


// Run OCR Legal Verification
async function runOCRVerification() {
  const text = document.getElementById('ocr-text-input').value;
  try {
    const res = await fetch('/api/ocr/verify-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_text: text })
    });
    const data = await res.json();

    const box = document.getElementById('ocr-results-box');
    box.style.display = 'block';

    const isVerified = data.status === 'VERIFIED';
    box.className = `alert-box ${isVerified ? '' : 'alert-box'}`;
    box.style.background = isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
    box.style.borderColor = isVerified ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)';
    box.style.color = isVerified ? '#6ee7b7' : '#fecdd3';

    box.innerHTML = `
      <i data-lucide="${isVerified ? 'check-circle-2' : 'alert-triangle'}" class="alert-icon"></i>
      <div>
        <h4 style="margin-bottom: 0.25rem;">Legal Document OCR Result: ${data.status} (Confidence: ${data.confidence_score}%)</h4>
        <div style="font-size: 0.85rem;">
          <strong>Certificate No:</strong> ${data.extracted_data.certificate_number} | 
          <strong>Deceased:</strong> ${data.extracted_data.deceased_name} | 
          <strong>Nominee:</strong> ${data.extracted_data.matched_nominee}
        </div>
        <div style="font-size: 0.8rem; margin-top: 0.4rem; opacity: 0.9;">
          <strong>Govt Authority Seal:</strong> ${data.extracted_data.issuing_authority} | 
          <strong>QR Verification:</strong> ${data.extracted_data.qr_code_checksum}
        </div>
      </div>
    `;
    lucide.createIcons();
    fetchState();
  } catch (err) {
    console.error("OCR error:", err);
  }
}

// Populate Wizard Nominees Dropdown & Shares
function populateWizardNominees() {
  const select = document.getElementById('wiz-nominee-select');
  select.innerHTML = '';
  const nominees = globalState.nominees || [
    { name: "Priya Ramachandran", assigned_share_index: 1, formatted_share: "SECLOCK-SHARE-1-..." },
    { name: "Anil Nair", assigned_share_index: 2, formatted_share: "SECLOCK-SHARE-2-..." },
    { name: "Dr. Radhika Nair", assigned_share_index: 3, formatted_share: "SECLOCK-SHARE-3-..." },
    { name: "Adv. Suresh Kumar", assigned_share_index: 4, formatted_share: "SECLOCK-SHARE-4-..." },
    { name: "Vijayalakshmi Amma", assigned_share_index: 5, formatted_share: "SECLOCK-SHARE-5-..." }
  ];

  nominees.forEach((n, idx) => {
    const opt = document.createElement('option');
    opt.value = n.name;
    opt.textContent = `${n.name} (Nominee #${idx+1})`;
    select.appendChild(opt);
  });

  // Populate Key Share inputs in Step 2
  const sharesContainer = document.getElementById('wiz-shares-input-list');
  sharesContainer.innerHTML = '';

  for (let i = 1; i <= 3; i++) {
    const nomineeObj = nominees[i - 1] || {};
    const div = document.createElement('div');
    div.className = 'glass-card';
    div.style.padding = '1rem';
    div.style.marginBottom = '0.5rem';
    div.innerHTML = `
      <div style="font-size: 0.85rem; font-weight: 600; color: var(--primary-cyan); margin-bottom: 0.4rem;">
        Nominee Share #${i}: ${nomineeObj.name || `Nominee ${i}`}
      </div>
      <div class="grid-2">
        <input type="number" class="form-input wiz-share-idx" value="${i}" placeholder="Share Index (1-5)">
        <input type="text" class="form-input wiz-share-hex" value="${nomineeObj.assigned_share_hex || ''}" placeholder="Hex Share String">
      </div>
    `;
    sharesContainer.appendChild(div);
  }
}

function goToWizStep(step) {
  document.getElementById('wiz-step-1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('wiz-step-2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('wiz-step-3').style.display = step === 3 ? 'block' : 'none';

  document.getElementById('wiz-step-1-bubble').style.background = step >= 1 ? 'var(--primary-cyan)' : 'rgba(30, 41, 59, 0.8)';
  document.getElementById('wiz-step-2-bubble').style.background = step >= 2 ? 'var(--primary-cyan)' : 'rgba(30, 41, 59, 0.8)';
  document.getElementById('wiz-step-3-bubble').style.background = step >= 3 ? 'var(--primary-cyan)' : 'rgba(30, 41, 59, 0.8)';
}

// Submit Nominee Shares in Wizard
async function submitNomineeSharesWizard() {
  const nomineeName = document.getElementById('wiz-nominee-select').value;
  const indices = document.querySelectorAll('.wiz-share-idx');
  const hexes = document.querySelectorAll('.wiz-share-hex');

  let lastResponse = null;

  for (let i = 0; i < indices.length; i++) {
    const idx = parseInt(indices[i].value);
    const hex = hexes[i].value.trim();

    if (idx && hex) {
      try {
        const res = await fetch('/api/claim/submit-share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nominee_name: nomineeName,
            share_index: idx,
            share_hex: hex
          })
        });
        lastResponse = await res.json();
      } catch (err) {
        console.error("Submit share error:", err);
      }
    }
  }

  if (lastResponse && lastResponse.is_reconstructed) {
    goToWizStep(3);
    renderUnlockedVault(lastResponse.decrypted_vault);
    updateStagedDisclosureCards(lastResponse.decrypted_vault);
    fetchState();
  } else {
    alert("Share submission received! Threshold conditions pending: Ensure Liveness status is EXPIRED and 3 nominee key shares are entered.");
  }
}

// Render Unlocked Vault Assets
function renderUnlockedVault(vault) {
  const box = document.getElementById('wiz-unlocked-data-box');
  box.innerHTML = `
    <div class="alert-box" style="background: rgba(16, 185, 129, 0.2); border-color: #34d399; color: #a7f3d0;">
      <i data-lucide="unlock" class="alert-icon"></i>
      <div>
        <h4 style="margin-bottom: 0.25rem;">Cryptographic Reconstruction Successful!</h4>
        <div>Master key reconstructed via 3-of-5 Shamir polynomial interpolation. Decrypted assets released tier-by-tier.</div>
      </div>
    </div>
    <div style="margin-top: 1rem;">
      <pre style="background: #070913; padding: 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; color: var(--primary-cyan); overflow-x: auto;">${JSON.stringify(vault, null, 2)}</pre>
    </div>
  `;
  lucide.createIcons();
}

// Update Staged Disclosure Accordion
function updateStagedDisclosureCards(vault) {
  if (!vault) return;
  document.getElementById('tier-1-content').innerHTML = `<pre style="font-family: var(--font-mono); color: var(--primary-cyan);">${JSON.stringify(vault.tier1_financial, null, 2)}</pre>`;
  document.getElementById('tier-2-content').innerHTML = `<pre style="font-family: var(--font-mono); color: var(--accent-purple);">${JSON.stringify(vault.tier2_credentials, null, 2)}</pre>`;
  document.getElementById('tier-3-content').innerHTML = `<pre style="font-family: var(--font-mono); color: var(--accent-amber);">${JSON.stringify(vault.tier3_memory_vault, null, 2)}</pre>`;
}

// Load Tamper-Evident Audit Ledger Timeline
async function loadAuditLedger() {
  try {
    const res = await fetch('/api/audit/ledger');
    const data = await res.json();

    const pill = document.getElementById('ledger-integrity-status');
    if (data.integrity.is_valid) {
      pill.className = 'status-pill active';
      pill.textContent = 'CRYPTOGRAPHICALLY VERIFIED';
    } else {
      pill.className = 'status-pill expired';
      pill.textContent = `TAMPERING DETECTED AT BLOCK #${data.integrity.tampered_block_index}`;
    }

    const container = document.getElementById('ledger-timeline-container');
    container.innerHTML = '';

    data.compliance_report.audit_trail.forEach(block => {
      const el = document.createElement('div');
      const isTampered = !data.integrity.is_valid && block.index === data.integrity.tampered_block_index;
      el.className = `ledger-block ${isTampered ? 'tampered' : ''}`;

      el.innerHTML = `
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <strong style="color: var(--primary-cyan);">Block #${block.index}: ${block.event_type}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${block.timestamp}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            ${JSON.stringify(block.details)}
          </div>
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-dim); word-break: break-all;">
            <div><strong>Prev Hash:</strong> ${block.prev_hash}</div>
            <div style="color: var(--accent-purple);"><strong>Block Hash:</strong> ${block.block_hash}</div>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    console.error("Ledger error:", err);
  }
}

// Simulate Ledger Block Tampering
async function simulateTamper() {
  try {
    const res = await fetch('/api/audit/simulate-tamper?block_index=1', { method: 'POST' });
    const data = await res.json();
    loadAuditLedger();
    alert("Simulated payload tampering on Audit Block #1! Verify hash chain mismatch.");
  } catch (err) {
    console.error("Tamper simulation error:", err);
  }
}

// Trigger Account Owner Veto
async function triggerOwnerVeto() {
  if (!confirm("Are you sure you want to execute the Emergency Account Owner Veto? This will immediately purge all pending claim attempts.")) return;

  try {
    const res = await fetch('/api/owner/veto', { method: 'POST' });
    const data = await res.json();
    fetchState();
    alert("Emergency Veto Executed! All claim attempts purged and liveness timer restored to ACTIVE.");
  } catch (err) {
    console.error("Owner veto error:", err);
  }
}
