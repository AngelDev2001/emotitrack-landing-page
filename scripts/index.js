const EMAILJS_CONFIG = {
    publicKey: 'TU_PUBLIC_KEY_AQUI',
    serviceId: 'TU_SERVICE_ID_AQUI',
    templateId: 'TU_TEMPLATE_ID_AQUI'
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');
    const submitButton = form.querySelector('.btn-submit');

    function showError(input, message) {
        removeError(input);
        input.style.border = '2px solid #ff4444';
        input.style.background = '#ffe5e5';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff4444';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;

        input.parentElement.appendChild(errorDiv);
    }

    function removeError(input) {
        input.style.border = 'none';
        input.style.background = '#F5F5F5';

        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function showSuccess(input) {
        removeError(input);
        input.style.border = '2px solid #4CAF50';
        input.style.background = '#e8f5e9';
    }

    function showMessage(type, text) {
        const existingMessages = form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        messageDiv.style.padding = '20px';
        messageDiv.style.borderRadius = '15px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.marginTop = '20px';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.style.animation = 'slideIn 0.3s ease-out';

        if (type === 'success') {
            messageDiv.style.background = '#4CAF50';
            messageDiv.style.color = 'white';
            messageDiv.innerHTML = `✅ ${text}`;
        } else {
            messageDiv.style.background = '#ff4444';
            messageDiv.style.color = 'white';
            messageDiv.innerHTML = `❌ ${text}`;
        }

        form.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    function setButtonLoading(isLoading) {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            submitButton.style.opacity = '0.7';
            submitButton.style.cursor = 'not-allowed';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
        }
    }

    function validateName() {
        const name = nameInput.value.trim();

        if (name === '') {
            showError(nameInput, 'Por favor ingresa tu nombre');
            return false;
        }

        if (name.length < 2) {
            showError(nameInput, 'El nombre debe tener al menos 2 caracteres');
            return false;
        }

        if (name.length > 50) {
            showError(nameInput, 'El nombre no puede exceder 50 caracteres');
            return false;
        }

        if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'\-]+$/.test(name)) {
            showError(nameInput, 'El nombre solo puede contener letras');
            return false;
        }

        showSuccess(nameInput);
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();

        if (email === '') {
            showError(emailInput, 'Por favor ingresa tu correo electrónico');
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            showError(emailInput, 'Por favor ingresa un correo válido (ejemplo@correo.com)');
            return false;
        }

        if (email.length > 100) {
            showError(emailInput, 'El correo es demasiado largo');
            return false;
        }

        showSuccess(emailInput);
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();

        if (message === '') {
            showError(messageInput, 'Por favor escribe tu mensaje');
            return false;
        }

        if (message.length < 10) {
            showError(messageInput, 'El mensaje debe tener al menos 10 caracteres');
            return false;
        }

        if (message.length > 1000) {
            showError(messageInput, 'El mensaje no puede exceder 1000 caracteres');
            return false;
        }

        showSuccess(messageInput);
        return true;
    }

    function validateForm() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        return isNameValid && isEmailValid && isMessageValid;
    }

    async function sendEmail(formData) {
        const url = 'https://api.emailjs.com/api/v1.0/email/send';

        const payload = {
            service_id: EMAILJS_CONFIG.serviceId,
            template_id: EMAILJS_CONFIG.templateId,
            user_id: EMAILJS_CONFIG.publicKey,
            template_params: {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_name: 'EmotiTrack Team',
                reply_to: formData.email
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error ${response.status}: ${errorData}`);
            }

            return await response.text();
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw error;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        removeError(nameInput);
        removeError(emailInput);
        removeError(messageInput);

        if (!validateForm()) {
            const firstError = form.querySelector('[style*="border: 2px solid #ff4444"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        if (EMAILJS_CONFIG.publicKey === 'TU_PUBLIC_KEY_AQUI' ||
            EMAILJS_CONFIG.serviceId === 'TU_SERVICE_ID_AQUI' ||
            EMAILJS_CONFIG.templateId === 'TU_TEMPLATE_ID_AQUI') {

            showMessage('error', 'Error de configuración. Por favor configura EmailJS primero.');
            console.error('⚠️ EMAILJS NO CONFIGURADO. Lee las instrucciones en el código.');
            return;
        }

        setButtonLoading(true);

        try {
            const result = await sendEmail(formData);

            console.log('✅ Email enviado exitosamente:', result);

            showMessage('success', '¡Mensaje enviado con éxito! Te contactaremos pronto.');

            form.reset();
            removeError(nameInput);
            removeError(emailInput);
            removeError(messageInput);

        } catch (error) {
            console.error('❌ Error al enviar:', error);

            let errorMessage = 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.';

            if (error.message.includes('401')) {
                errorMessage = 'Error de autenticación. Verifica tu Public Key de EmailJS.';
            } else if (error.message.includes('400')) {
                errorMessage = 'Error de configuración. Verifica tus IDs de EmailJS.';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
            }

            showMessage('error', errorMessage);

        } finally {
            // Restaurar botón
            setButtonLoading(false);
        }
    }

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    nameInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            removeError(this);
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            removeError(this);
        }
    });

    messageInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            removeError(this);
        }
    });

    form.addEventListener('submit', handleSubmit);

    const style = document.createElement('style');
    style.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                }
            `;
    document.head.appendChild(style);
});