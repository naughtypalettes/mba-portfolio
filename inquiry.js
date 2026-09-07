'use strict';
const form = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');
const button = form.querySelector('button[type="submit"]');
const endpoint = form.getAttribute('action') || '';
const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
let pending = false;
button.disabled = !configured;
if (configured) status.textContent = 'Send your brief here. I’ll review it so we can discuss fit and scope.';
document.querySelectorAll('[data-package]').forEach((link) => {
  link.addEventListener('click', () => {
    form.elements.project.value = link.dataset.package;
  });
});
form.addEventListener('submit', async (event) => {
  if (!configured || pending) {
    event.preventDefault();
    return;
  }
  event.preventDefault();
  for (const name of ['name', 'email', 'project', 'brief']) {
    form.elements[name].value = form.elements[name].value.trim();
  }
  if (!form.reportValidity()) return;
  pending = true;
  button.disabled = true;
  button.textContent = 'Sending…';
  form.setAttribute('aria-busy', 'true');
  status.textContent = 'Sending your inquiry…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', body: new FormData(form),
      headers: { Accept: 'application/json' }, signal: controller.signal
    });
    if (!response.ok) {
      status.textContent = response.status === 429
        ? 'Too many attempts. Please wait a few minutes before trying again, or email me below.'
        : 'Your inquiry wasn’t accepted. Check your details and try again, or email me below.';
      return;
    }
    form.reset();
    status.textContent = 'Thanks—your inquiry has been submitted. I’ll review your brief so we can discuss fit and scope.';
  } catch {
    status.textContent = 'I couldn’t confirm your submission. Your details are still here. Please try again, or email me below.';
  } finally {
    clearTimeout(timeout);
    pending = false;
    button.disabled = false;
    button.textContent = 'Send inquiry ↗';
    form.removeAttribute('aria-busy');
  }
});
