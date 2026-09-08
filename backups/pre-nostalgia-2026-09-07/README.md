# Made by Amar

Static portfolio for brand, content and campaign work with creatives and nonprofits. No build step is required. Serve this folder with a static server; GitHub Pages remains supported and CNAME retains madebyamar.co.

## Content

The homepage leads with Homegrown, followed by Voices of Resilience and a clearly labeled self-initiated Made by Amar study. Project narratives and qualitative outcomes come from owner-supplied notes. No numerical outcomes, testimonials or experience-year claims are added. Unfeatured image files remain available for later use. Fonts are hosted locally with their licenses.

## Activate direct inquiries before launch

The local form intentionally has no endpoint and its submit button is disabled. The direct email link remains available. Do not treat this state as a completed direct-submission integration.

1. Create a Formspree form and verify hello@madebyamar.co as its recipient. Configure the provider's spam protection to match its supported submission flow.
2. In index.html, add the real action="https://formspree.io/f/FORM_ID" to #inquiry-form, retaining method="post". Remove disabled from the submit button so native submission also works without JavaScript.
3. Replace the initial #form-status text with: Send your brief here. I’ll review it so we can discuss fit and scope.
4. Verify an actual inquiry reaches the intended inbox. Check both enhanced JavaScript submission and native submission with JavaScript disabled, including any provider spam challenge. The automated tests mock provider responses and cannot establish email delivery.

No private API keys belong in this static site. inquiry.js reads the public endpoint from the HTML action, handles pending/success/error states and retains inputs on failure. An uncertain network response asks visitors to retry or email; it does not claim confirmed failure or delivery.

## Browser checks

Install Playwright in a development environment and use an installed Chrome browser, then run `node tests/site.cjs`. Alternatively set PLAYWRIGHT_MODULE to an existing Playwright module directory. Tests use a temporary local server and intercept all provider requests: no email is sent.

Checks cover 390/768/1440px widths, links, imagery, package prefill, invalid and whitespace-only inputs, service rejection, rate limiting, network failure, success, duplicate prevention and native POST without JavaScript. The test also captures the current hero to assets/made-by-amar-site.png for the self-study. Review that generated image when changing the hero. Full-page previews are written to .preview/.

Publishing is separate from local implementation. Activate and verify Formspree before releasing the direct-submit form.
