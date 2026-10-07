# CORM — Static Website Package

This package is a flat static HTML/CSS/vanilla-JS website for the College of Relationship & Marriage (CORM).

## Deployment

The site is compatible with GitHub Pages, Cloudflare Pages, and other static hosts. No Node.js server or build command is required.

Upload/publish the files in this directory as the site root. `index.html` is the homepage.

## Forms

Contact and counselor booking forms use FormSubmit and route submissions to:

`collegeofrelationship@gmail.com`

The forms include a native HTML `action` fallback so they remain usable on static hosting even if JavaScript/AJAX is unavailable.

**Important:** FormSubmit may require the receiving email address to confirm/activate the integration the first time a form is submitted. Check the CORM Gmail inbox for any FormSubmit activation email.

## Updated in this release

- Removed header navigation underline artifacts and tightened responsive navigation behavior.
- Added a clean split-layout contact form with minimalist fields and a red “Send Message Securely” button.
- Added native FormSubmit routing for contact and counselor booking forms.
- Made counselor session controls real links as well as JavaScript-enhanced controls.
- Set all 10 Nuggets categories to collapsed on initial load with smooth accordion expansion.
- Retained lightweight scroll-reveal and card hover animations with reduced-motion support.
