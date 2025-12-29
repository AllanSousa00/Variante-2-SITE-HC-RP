document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supportForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const successMessage = document.getElementById('successMessage');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const categoryError = document.getElementById('categoryError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    // Form fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const categorySelect = document.getElementById('category');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Validation functions
    const validateName = () => {
        const value = nameInput.value.trim();
        const isValid = value.length >= 2;
        
        if (!isValid) {
            nameError.textContent = value.length === 0 ? 'Por favor, insira seu nome' : 'Nome deve ter pelo menos 2 caracteres';
            nameError.style.display = 'block';
            nameInput.style.borderColor = '#ff4444';
        } else {
            nameError.style.display = 'none';
            nameInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return isValid;
    };

    const validateEmail = () => {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);
        
        if (!isValid) {
            emailError.textContent = value.length === 0 ? 'Por favor, insira seu e-mail' : 'Por favor, insira um e-mail válido';
            emailError.style.display = 'block';
            emailInput.style.borderColor = '#ff4444';
        } else {
            emailError.style.display = 'none';
            emailInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return isValid;
    };

    const validateCategory = () => {
        const isValid = categorySelect.value !== '';
        
        if (!isValid) {
            categoryError.textContent = 'Por favor, selecione uma categoria';
            categoryError.style.display = 'block';
            categorySelect.style.borderColor = '#ff4444';
        } else {
            categoryError.style.display = 'none';
            categorySelect.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return isValid;
    };

    const validateSubject = () => {
        const value = subjectInput.value.trim();
        const isValid = value.length >= 3;
        
        if (!isValid) {
            subjectError.textContent = value.length === 0 ? 'Por favor, insira um assunto' : 'Assunto deve ter pelo menos 3 caracteres';
            subjectError.style.display = 'block';
            subjectInput.style.borderColor = '#ff4444';
        } else {
            subjectError.style.display = 'none';
            subjectInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return isValid;
    };

    const validateMessage = () => {
        const value = messageInput.value.trim();
        const isValid = value.length >= 10;
        
        if (!isValid) {
            messageError.textContent = value.length === 0 ? 'Por favor, insira sua mensagem' : 'Mensagem deve ter pelo menos 10 caracteres';
            messageError.style.display = 'block';
            messageInput.style.borderColor = '#ff4444';
        } else {
            messageError.style.display = 'none';
            messageInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        return isValid;
    };

    // Real-time validation with debounce
    let validationTimeout;
    
    const debounceValidation = (validationFn) => {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(validationFn, 300);
    };

    nameInput.addEventListener('input', () => debounceValidation(validateName));
    emailInput.addEventListener('input', () => debounceValidation(validateEmail));
    categorySelect.addEventListener('change', validateCategory);
    subjectInput.addEventListener('input', () => debounceValidation(validateSubject));
    messageInput.addEventListener('input', () => debounceValidation(validateMessage));

    // Clear validation on focus
    nameInput.addEventListener('focus', () => {
        nameError.style.display = 'none';
        nameInput.style.borderColor = 'var(--primary-color)';
    });
    
    emailInput.addEventListener('focus', () => {
        emailError.style.display = 'none';
        emailInput.style.borderColor = 'var(--primary-color)';
    });
    
    categorySelect.addEventListener('focus', () => {
        categoryError.style.display = 'none';
        categorySelect.style.borderColor = 'var(--primary-color)';
    });
    
    subjectInput.addEventListener('focus', () => {
        subjectError.style.display = 'none';
        subjectInput.style.borderColor = 'var(--primary-color)';
    });
    
    messageInput.addEventListener('focus', () => {
        messageError.style.display = 'none';
        messageInput.style.borderColor = 'var(--primary-color)';
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide any existing success message
        successMessage.style.display = 'none';

        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isCategoryValid = validateCategory();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        if (!isNameValid || !isEmailValid || !isCategoryValid || !isSubjectValid || !isMessageValid) {
            // Scroll to first error
            const firstError = form.querySelector('.error-message[style*="block"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'block';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            successMessage.style.display = 'block';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Reset form after showing success
            setTimeout(() => {
                form.reset();
                // Clear all error states
                [nameInput, emailInput, categorySelect, subjectInput, messageInput].forEach(input => {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                });
            }, 500);

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            loadingSpinner.style.display = 'none';
        }
    });

    // Clear error messages when form is reset
    form.addEventListener('reset', () => {
        [nameError, emailError, categoryError, subjectError, messageError].forEach(error => {
            error.style.display = 'none';
        });
        [nameInput, emailInput, categorySelect, subjectInput, messageInput].forEach(input => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
});
