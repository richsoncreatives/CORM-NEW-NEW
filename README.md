# CORM — Static Website

This package is the cleaned, deployment-ready static version of the College of Relationship & Marriage (CORM) website.

## Included

- Static HTML pages
- `site-overrides.css` for responsive styling and animations
- `site.js` for mobile navigation, Nuggets accordion, counselor routing, and form submission
- No framework or build step is required for this static package

## Deployment

### Cloudflare Pages

Upload the contents of this folder as a static site, or connect the repository to Cloudflare Pages. No build command is required. The site output directory is the project root.

### GitHub Pages

Commit these files to a GitHub repository and enable GitHub Pages for the branch/folder containing the files. The site is plain HTML/CSS/JavaScript and does not require Node.js to run.

## Forms

Counselor booking submissions are sent through FormSubmit to:

`collegeofrelationship@gmail.com`

If the AJAX submission cannot be completed, the site falls back to opening the visitor's email application with the submission prepared.

## Main updates

- Responsive hamburger navigation for phones and tablets
- Simplified counselor booking form: Name, Email, Phone, Preferred Date, Message
- Selected counselor is displayed above the booking form and retained as a hidden routing value
- Nuggets categories are collapsed by default and expand/collapse when clicked
- Lightweight scroll reveals, card hover effects, and reduced-motion support
