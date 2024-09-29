'use strict';
(function () {
    function validateField(field) {
        const validationRules = field.getAttribute('data-valid').split('-');
        const value = field.value.trim();
        const errors = [];

        let errorElement = field.nextElementSibling;
        if (errorElement && errorElement.tagName.toLowerCase() === 'small') {
            errorElement.remove();
        }

        if (validationRules.includes('m') && !value) {
            errors.push('This field is required.');
        }

        if (validationRules.includes('email')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors.push('Please enter a valid email address.');
            }
        }

        if (errors.length > 0) {
            field.classList.add('input-error');
            field.classList.remove('input-success');

            errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.textContent = errors[0];
            field.insertAdjacentElement('afterend', errorElement);
        } else {
            field.classList.remove('input-error');
            field.classList.add('input-success');
        }

        return errors;
    }

    function validateAll(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        const fields = form.querySelectorAll('[data-valid]');
        let allValid = true;
        const allErrors = [];

        const errorSummary = form.querySelector('#errorSummary');
        if (errorSummary) {
            errorSummary.remove();
        }

        fields.forEach(field => {
            const errors = validateField(field);
            if (errors.length > 0) {
                allValid = false;
                allErrors.push({
                    fieldName: field.getAttribute('placeholder') || field.getAttribute('id'),
                    errors: errors
                });
            }
        });

        if (!allValid && errorSummary) {
            const summaryElement = document.createElement('ul');
            summaryElement.id = 'errorSummary';
            summaryElement.style.color = 'red';

            allErrors.forEach(error => {
                const listItem = document.createElement('li');
                listItem.textContent = `${error.fieldName}: ${error.errors.join(', ')}`;
                summaryElement.appendChild(listItem);
            });

            const summaryContainer = form.querySelector('.errorContainer');
            summaryContainer.appendChild(summaryElement);
        }

        return allValid;
    }

    document.addEventListener('keyup', function (event) {
        const field = event.target;
        if (field.hasAttribute('data-valid')) {
            validateField(field);
        }
    });

    window.validateAll = validateAll;
})();