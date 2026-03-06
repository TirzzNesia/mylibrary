function Loginpopunder() {
    $('.popup-login, .popup-ariandi').hide();
    $('.selectLogin').css('display', 'flex').hide().fadeIn();
}

function OpenFacebook() {
    $('.selectLogin').hide();
    $('.loginxFacebook').css('display', 'flex').hide().fadeIn();
}

function OpenGoogle() {
    $('.selectLogin').hide();
    $('.tirzz-google').css('display', 'flex').hide().fadeIn();
}

function closeAll() {
    $('.popup-login, .popup-ariandi').fadeOut();
}

$(document).ready(function() {
    $('#downloadBtn').on('click', function() {
        Loginpopunder();
    });

    $(document).on('click', '.popup-login, .popup-ariandi', function(e) {
        if ($(e.target).is('.popup-login, .popup-ariandi')) {
            closeAll();
        }
    });
});
