'use strict';
const form = document.querySelector('#inquiry-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = data.get('name').trim();
  const email = data.get('email').trim();
  const project = data.get('project').trim();
  const brief = data.get('brief').trim();
  if (!name || !project || !brief) {
    document.querySelector('#form-status').textContent = 'Please fill in your name, project type and a short brief.';
    return;
  }
  const subject = `Project inquiry: ${project}`;
  const body = `Name: ${name}\nEmail: ${email}\nProject type: ${project}\n\n${brief}`;
  window.location.href = `mailto:hello@madebyamar.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-status').textContent = 'Your email draft is ready to open. Send it from your email app to complete your inquiry. If no app opens, email hello@madebyamar.co directly.';
});
