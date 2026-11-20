# Made by Amar

Static portfolio for brand, content and campaign work with creatives and nonprofits. No build step is required. Serve this folder with a static server; GitHub Pages remains supported and CNAME retains madebyamar.co.

## Content

The homepage leads with Homegrown, followed by Voices of Resilience and a clearly labeled self-initiated Made by Amar study. Project narratives and qualitative outcomes come from owner-supplied notes. No numerical outcomes, testimonials or experience-year claims are added. Unfeatured image files remain available for later use. Fonts are hosted locally with their licenses.

## Activate direct inquiries before launch

The local form intentionally has no endpoint and its submit button is disabled. A prominent notice with a direct email link appears before the fields, so visitors see the limitation before entering details. Do not treat this state as a completed direct-submission integration.

1. Create a Formspree form and verify hello@madebyamar.co as its recipient. Configure the provider's spam protection to match its supported submission flow.
2. In index.html, add the real action="https://formspree.io/f/FORM_ID" to #inquiry-form, retaining method="post". Remove disabled from the submit button so native submission also works without JavaScript.
3. Replace the initial #form-status text with: Send your brief here. I’ll review it so we can discuss fit and scope.
4. Verify an actual inquiry reaches the intended inbox. Check both enhanced JavaScript submission and native submission with JavaScript disabled, including any provider spam challenge. The automated tests mock provider responses and cannot establish email delivery.

No private API keys belong in this static site. inquiry.js reads the public endpoint from the HTML action, handles pending/success/error states and retains inputs on failure. An uncertain network response asks visitors to retry or email; it does not claim confirmed failure or delivery.

## Browser checks

Install Playwright in a development environment and use an installed Chrome browser, then run `node tests/site.cjs`. Alternatively set PLAYWRIGHT_MODULE to an existing Playwright module directory. Tests use a temporary local server and intercept all provider requests: no email is sent.

Checks cover 320/390/600/768/820/834/1024/1100/1440px widths, links, imagery, package prefill, invalid and whitespace-only inputs, service rejection, rate limiting, network failure, success, duplicate prevention and native POST without JavaScript. The test also captures the current hero to assets/made-by-amar-site.png for the self-study. Review that generated image when changing the hero. Full-page previews are written to .preview/.

Publishing is separate from local implementation. Activate and verify Formspree before releasing the direct-submit form.

## Nostalgia redesign / saved version

The complete pre-redesign site is in backups/pre-nostalgia-2026-09-07/, including the exact HTML, CSS, scripts and assets present before this redesign. To revert, copy its index.html, styles.css, inquiry.js and assets folder back into the project root, replacing the corresponding files. The backup itself should remain intact.

The new editorial treatment uses the existing portrait, locally hosted fonts, CSS light leaks, outlined typography and an SVG grain overlay. No external image or font service is required.

## Cross-device UX follow-up

On screens up to 600px, navigation scrolls with the page to leave the reading viewport clear. The four links retain their existing tap targets.

The Powered by Netlify badge is injected by the host, not this repository. Turn it off under **Project configuration > General > Powered by Netlify badge**, then save. This works on the Free plan and applies on the next request without a redeploy. See https://docs.netlify.com/manage/projects/powered-by-netlify-badge/.

## Simplified mobile reading

At 600px and below, project stories, package inclusions, the process and additional About copy use keyboard-accessible disclosures. Full detail expands on larger screens. The hero and contact use shorter copy; decorative ticker and repeated introductory copy are omitted. The unconfigured form is hidden on mobile in favour of direct email. Adding its verified action restores it. Native details retain the content when JavaScript is unavailable.
