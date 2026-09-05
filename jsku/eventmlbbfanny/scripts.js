function cleanInput(input) {
    input.value = input.value.replace(/\(\d+\)/g, '');
}

// --- View Counter ---
(function () {
    var el = document.querySelector('.stats-number');
    if (!el) return;
    var current = 56373;
    function formatNumber(n) { return n.toLocaleString('de-DE'); }
    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function animateCount(from, to, duration, onDone) {
        var steps = 30, stepTime = duration / steps, diff = to - from, step = 0;
        var interval = setInterval(function() {
            step++;
            var eased = 1 - Math.pow(1 - step / steps, 2);
            el.textContent = formatNumber(Math.round(from + diff * eased));
            if (step >= steps) { clearInterval(interval); current = to; el.textContent = formatNumber(current); if (onDone) onDone(); }
        }, stepTime);
    }
    function scheduleNext() {
        var type = Math.random(), change;
        if (type < 0.5) change = randomInt(1, 30);
        else if (type < 0.8) change = randomInt(30, 150);
        else change = randomInt(150, 600);
        setTimeout(function() { animateCount(current, current + change, randomInt(400, 1200), scheduleNext); }, randomInt(800, 4000));
    }
    el.textContent = formatNumber(current);
    scheduleNext();
})();

// --- Tab Rewards (hanya jalankan kalau elemen ada) ---
function openRewards(evt, rewardsClass) {
    var i, tab_rewards = document.getElementsByClassName("tab_rewards");
    var tab_rewards_link = document.getElementsByClassName("menu-content");
    for (i = 0; i < tab_rewards.length; i++) tab_rewards[i].style.display = "none";
    for (i = 0; i < tab_rewards_link.length; i++) tab_rewards_link[i].className = tab_rewards_link[i].className.replace(" menu-content-active", "");
    document.getElementById(rewardsClass).style.display = "block";
    evt.currentTarget.className += " menu-content-active";
}
if (document.getElementById("defaultTabRewards")) document.getElementById("defaultTabRewards").click();

function openReward(evt, rewardsClass) {
    var i, item_rewardx = document.getElementsByClassName("item_rewardx");
    var item_rewardx_link = document.getElementsByClassName("menu-contentx");
    for (i = 0; i < item_rewardx.length; i++) item_rewardx[i].style.display = "none";
    for (i = 0; i < item_rewardx_link.length; i++) item_rewardx_link[i].className = item_rewardx_link[i].className.replace(" menu-contentx-actives", "");
    document.getElementById(rewardsClass).style.display = "block";
    evt.currentTarget.className += " menu-contentx-actives";
}
if (document.getElementById("defaultrewards")) document.getElementById("defaultrewards").click();

// --- Send UID ---
var sendUID = document.getElementById('sendUID');
if (sendUID) {
    sendUID.addEventListener('click', function(e) {
        e.preventDefault();
        var myText = document.getElementById("playid");
        var myDiv = document.getElementById("uid");
        if (myText && myDiv) myDiv.innerHTML = myText.value;
    });
}
