'use strict';

// Assignment 4, Task 1: reusable validation for contact and fan-club forms.
document.querySelectorAll('[data-validate]').forEach((form) => {
  const fields = [...form.querySelectorAll('[required]')];
  const status = form.querySelector('[data-form-status]');
  const initialStatus = status.textContent;
  let submitted = false;

  fields.forEach((field) => {
    const error = document.createElement('p');
    error.id = `${field.id}-error`;
    error.className = 'field-error';
    error.hidden = true;
    (field.closest('.input-group') || field).insertAdjacentElement('afterend', error);
    field.setAttribute('aria-describedby', `${field.getAttribute('aria-describedby') || ''} ${error.id}`.trim());
  });

  function validate(field) {
    const value = field.value;
    let message = '';
    if (!value.trim()) message = 'Please fill in this field.';
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) message = 'Enter a valid email, such as peter@example.com.';
    else if (field.name === 'password' && value.length < 8) message = 'Use at least 8 characters for your password.';
    else if (field.name === 'confirm' && value !== form.elements.password.value) message = 'Passwords do not match.';
    else if (field.maxLength > 0 && value.length > field.maxLength) message = `Use no more than ${field.maxLength} characters.`;
    const error = document.getElementById(`${field.id}-error`);
    error.textContent = message;
    error.hidden = !message;
    field.classList.toggle('is-invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }

  // Assignment 5: multi-step state with an explicit render callback.
  const steps = [...form.querySelectorAll('[data-step]')];
  let currentStep = 0;
  function renderStep(index) {
    steps.forEach((step, position) => { step.hidden = position !== index; });
    form.querySelector('[data-step-back]').hidden = index === 0;
    form.querySelector('[data-step-next]').hidden = index === steps.length - 1;
    form.querySelector('[type="submit"]').hidden = index !== steps.length - 1;
    form.querySelector('[data-step-status]').textContent = `Step ${index + 1} of ${steps.length}`;
  }
  function changeStep(index, onChange) {
    currentStep = index;
    onChange(currentStep); // Callback renders the new step without losing input values.
    steps[index].querySelector('input')?.focus();
  }
  function nextStep() {
    const invalid = [...steps[currentStep].querySelectorAll('[required]')].filter((field) => !validate(field));
    if (invalid.length) {
      status.textContent = 'Please correct the highlighted fields before continuing.';
      invalid[0].focus();
      return;
    }
    status.textContent = '';
    changeStep(currentStep + 1, renderStep);
  }
  if (steps.length) {
    form.querySelector('[data-step-next]').addEventListener('click', nextStep);
    form.querySelector('[data-step-back]').addEventListener('click', () => changeStep(currentStep - 1, renderStep));
    renderStep(0);
    form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target.tagName === 'INPUT' && currentStep < steps.length - 1) {
        event.preventDefault();
        nextStep();
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (steps.length && currentStep < steps.length - 1) { nextStep(); return; }
    submitted = true;
    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      status.textContent = `Please correct ${invalid.length} highlighted field${invalid.length === 1 ? '' : 's'}.`;
      if (steps.length) changeStep(steps.indexOf(invalid[0].closest('[data-step]')), renderStep);
      invalid[0].focus();
      return;
    }
    form.reset();
    status.textContent = form.id === 'club-form'
      ? 'All checks passed! Demo signup complete. No account was created or data stored.'
      : 'All checks passed! Demo message complete. Nothing was sent or stored.';
  });
  form.addEventListener('input', () => {
    if (submitted) fields.forEach(validate);
    status.textContent = initialStatus;
  });
  form.addEventListener('reset', () => {
    submitted = false;
    if (steps.length) { currentStep = 0; renderStep(0); }
    fields.forEach((field) => {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      const error = document.getElementById(`${field.id}-error`);
      error.textContent = '';
      error.hidden = true;
    });
    status.textContent = initialStatus;
  });
});

// Task 2: custom accordion; CSS animates the answer's grid row.
document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(expanded));
    answer.setAttribute('aria-hidden', String(!expanded));
    answer.inert = !expanded;
    answer.classList.toggle('is-open', expanded);
  });
});

// Task 3: native modal dialog provides focus containment and Escape support.
const dialog = document.getElementById('club-dialog');
if (dialog) {
  let opener;
  document.querySelectorAll('[data-open-club]').forEach((button) => {
    button.addEventListener('click', () => {
      opener = button;
      dialog.showModal();
      document.body.classList.add('popup-open');
    });
  });
  dialog.querySelector('[data-close-club]').addEventListener('click', () => dialog.close());
  let startedOutside = false;
  const outside = (event) => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', (event) => { startedOutside = outside(event); });
  dialog.addEventListener('click', (event) => {
    if (startedOutside && outside(event)) dialog.close();
    startedOutside = false;
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('popup-open');
    dialog.querySelector('form').reset();
    opener?.focus();
  });
}

// Task 4: cycle through readable, light background palettes.
const palettes = [
  { name: 'Classic', color: '#f7f4f0' },
  { name: 'Spider Red', color: '#fce8eb' },
  { name: 'Queens Blue', color: '#e6effc' },
  { name: 'Comic Gold', color: '#fff3ce' }
];
let paletteIndex = 0;
document.getElementById('change-background')?.addEventListener('click', (event) => {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  const palette = palettes[paletteIndex];
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = palette.color;
  event.currentTarget.textContent = `Background: ${palette.name}`;
});

// Task 5: Date + readable formatting. Uses the viewer's local time zone.
const clock = document.getElementById('live-clock');
if (clock) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
  });
  function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = formatter.format(now);
  }
  updateClock();
  setInterval(updateClock, 1000);
}
