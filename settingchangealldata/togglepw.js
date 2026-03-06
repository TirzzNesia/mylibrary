    function togglePassword() {
        const inp = document.getElementById('authPass');
        const ico = document.getElementById('eyeIcon');
        if (inp.type === 'password') {
            inp.type = 'text';
            ico.className = 'fa-solid fa-eye-slash';
        } else {
            inp.type = 'password';
            ico.className = 'fa-solid fa-eye';
        }
    }
