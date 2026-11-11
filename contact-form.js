(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: document.getElementById('contactName'),
    email: document.getElementById('contactEmail'),
    message: document.getElementById('contactMessage')
  };
  const errors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    message: document.getElementById('messageError')
  };
  const status = document.getElementById('formStatus');
  const counter = document.getElementById('messageCount');
  const projectType = document.getElementById('projectType');
  const honeypot = document.getElementById('companyWebsite');
  const recipient = 'programmer.cs03@gmail.com';

  function setError(key, message) {
    fields[key].setAttribute('aria-invalid', String(Boolean(message)));
    errors[key].textContent = message;
  }

  function validate() {
    let valid = true;
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();

    setError('name', '');
    setError('email', '');
    setError('message', '');

    if (name.length < 2) {
      setError('name', 'Please enter at least 2 characters for your name.');
      valid = false;
    }
    if (!fields.email.validity.valid || !email) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    }
    if (message.length < 10) {
      setError('message', 'Please add at least 10 characters about your project.');
      valid = false;
    }
    return valid;
  }

  Object.entries(fields).forEach(([key, field]) => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate();
      if (key === 'message') counter.textContent = `${field.value.length} / ${field.maxLength}`;
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    status.dataset.state = '';

    // A filled hidden field usually indicates an automated submission.
    if (honeypot.value.trim()) return;

    if (!validate()) {
      status.textContent = 'Please review the highlighted fields.';
      status.dataset.state = 'error';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();
    const type = projectType.value || 'Not specified';
    const subject = `Portfolio inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${type}`,
      '',
      'Project details:',
      message
    ].join('\n');

    status.textContent = 'Your email app should open with the message prepared. The message is not sent until you press Send there.';
    status.dataset.state = 'success';
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
