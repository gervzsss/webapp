// Simple form validation and small reveal animations for about page
(function () {
    const form = document.getElementById('contactForm');
    const nameEl = document.getElementById('cName');
    const emailEl = document.getElementById('cEmail');
    const subjectEl = document.getElementById('cSubject');
    const messageEl = document.getElementById('cMessage');
    const alertEl = document.getElementById('cAlert');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showAlert(type, text) {
        alertEl.innerHTML = `<div class="alert ${type === 'success' ? 'alert-success' : 'alert-danger'}">${text}</div>`;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        alertEl.innerHTML = '';

        if (!nameEl.value.trim()) { nameEl.classList.add('is-invalid'); valid = false; } else nameEl.classList.remove('is-invalid');
        if (!validateEmail(emailEl.value)) { emailEl.classList.add('is-invalid'); valid = false; } else emailEl.classList.remove('is-invalid');
        if (!messageEl.value.trim()) { messageEl.classList.add('is-invalid'); valid = false; } else messageEl.classList.remove('is-invalid');

        if (!valid) {
            showAlert('error', 'Please fix the highlighted fields and try again.');
            return;
        }

        // Simulate sending
        const submitBtn = document.getElementById('cSubmit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            form.reset();
            showAlert('success', 'Thanks — your message was sent. We will get back to you within 48 hours.');
        }, 900);
    });

    // reveal animation moved to scripts/reveal.js (shared across pages)
})();
