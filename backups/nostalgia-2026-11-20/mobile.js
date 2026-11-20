'use strict';
// Keep detailed reading optional on phones and expanded on larger screens.
const mobileLayout = window.matchMedia('(max-width: 600px)');
const disclosures = document.querySelectorAll('.mobile-disclosure');
function syncDisclosures() {
  disclosures.forEach(disclosure => { disclosure.open = !mobileLayout.matches; });
}
syncDisclosures();
mobileLayout.addEventListener('change', syncDisclosures);
