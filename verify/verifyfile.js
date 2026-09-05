(function() {
    const fill = document.getElementById('progressFill');
    const pctText = document.getElementById('pctText');
    const spinnerText = document.getElementById('spinnerText');
    const loadingState = document.getElementById('loadingState');
    const successState = document.getElementById('successState');

    const spinnerMessages = [
        'Initializing security check...',
        'Inspecting TLS handshake...',
        'Verifying HTTP headers...',
        'Checking browser integrity...',
        'Analyzing request signature...',
        'Validating session token...',
        'Confirming access permissions...',
        'Finalizing verification...'
    ];

    let progress = 0;
    let msgIndex = 0;
    let step1Done = false, step2Done = false, step3Done = false;

    function setStepActive(n) {
        document.getElementById('stepNum' + n).classList.add('active');
        document.getElementById('stepLabel' + n).classList.add('active');
        const st = document.getElementById('stepStatus' + n);
        st.textContent = 'CHECKING';
        st.className = 'step-status show checking';
    }

    function setStepDone(n) {
        const num = document.getElementById('stepNum' + n);
        num.classList.remove('active');
        num.classList.add('done');
        num.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 13l4 4L19 7"/></svg>';
        document.getElementById('stepLabel' + n).classList.remove('active');
        document.getElementById('stepLabel' + n).classList.add('done');
        const st = document.getElementById('stepStatus' + n);
        st.textContent = 'PASSED';
        st.className = 'step-status show passed';
    }

    setTimeout(() => setStepActive(1), 200);

    const durationMs = 2500;
    const tickMs = 50;
    const startTime = Date.now();

    const interval = setInterval(function() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(100, (elapsed / durationMs) * 100);
        const rounded = Math.round(progress);

        fill.style.width = rounded + '%';
        pctText.textContent = rounded + '%';

        if (rounded >= 33 && !step1Done) {
            step1Done = true;
            setStepDone(1);
            setTimeout(() => setStepActive(2), 300);
        }
        if (rounded >= 66 && !step2Done) {
            step2Done = true;
            setStepDone(2);
            setTimeout(() => setStepActive(3), 300);
        }
        if (rounded >= 98 && !step3Done) {
            step3Done = true;
            setStepDone(3);
        }

        const newIdx = Math.min(Math.floor(progress / 13), spinnerMessages.length - 1);
        if (newIdx !== msgIndex) {
            msgIndex = newIdx;
            spinnerText.style.opacity = '0';
            setTimeout(() => {
                spinnerText.textContent = spinnerMessages[msgIndex];
                spinnerText.style.opacity = '1';
            }, 200);
        }

        if (elapsed >= durationMs) {
            clearInterval(interval);
            setTimeout(() => {
                loadingState.style.opacity = '0';
                loadingState.style.transform = 'translateY(-10px)';
                loadingState.style.transition = 'all 0.4s ease';
                setTimeout(() => {
                    loadingState.style.display = 'none';
                    successState.style.display = 'block';
                }, 400);
            }, 200);
        }
    }, tickMs);
})();
document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
document.addEventListener('keydown', function(e) {
    const key = (e.key || '').toLowerCase();
    if (key === 'f12') { e.preventDefault(); return; }
    if (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) { e.preventDefault(); return; }
    if (e.ctrlKey && key === 'u') { e.preventDefault(); }
});
