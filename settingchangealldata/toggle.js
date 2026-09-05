function toggleEdit(type) {
        const elId = 'edit' + type.charAt(0).toUpperCase() + type.slice(1);
        const el = document.getElementById(elId);
        const isOpen = el.classList.contains('active');
        document.querySelectorAll('.edit-form').forEach(f => f.classList.remove('active'));
        if (!isOpen) { 
            el.classList.add('active'); 
            const input = el.querySelector('input, select');
            if (input) input.focus();
        }
    }

    function showToast(message, type) {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('i');
        const text = document.getElementById('toastText');
        toast.className = 'toast ' + type;
        icon.className = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
        text.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function submitEdit(event, type) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        $.ajax({
            url: window.location.href,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function() {
                if (type === 'nama') {
                    const newVal = document.getElementById('inputNama').value;
                    document.getElementById('displayNama').textContent = newVal;
                } else if (type === 'email') {
                    const newVal = document.getElementById('inputEmail').value;
                    document.getElementById('displayEmail').textContent = newVal;
                } else if (type === 'loginMode') {
                    const select = document.getElementById('inputLoginMode');
                    const newVal = select.options[select.selectedIndex].text;
                    document.getElementById('displayLoginMode').textContent = newVal;
                }
                document.querySelectorAll('.edit-form').forEach(f => f.classList.remove('active'));
                showToast(type === 'loginMode' ? 'Mode login berhasil diperbarui' : 'Data berhasil diperbarui', 'success');
            },
            error: function() {
                showToast('Gagal menyimpan. Coba lagi.', 'error');
            }
        });
        return false;
    }

    <?php if (isset($update_response['status']) && $update_response['status']): ?>
    $(document).ready(function() {
        showToast('<?= $update_response['message'] ?>', '<?= $update_response['status'] ?>');
    });
    <?php endif; ?>

    document.querySelectorAll('.edit-form input, .edit-form select').forEach(inp => {
        inp.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { 
                e.preventDefault(); 
                this.closest('form').querySelector('.btn-save').click(); 
            }
        });
    });
