/**
 * CORM (College of Relationship & Marriage) Core Client Scripts
 * - Responsive Mobile Navigation (Zero duplicate/orphaned header strings)
 * - Floating "Direct Enquiries" Button
 * - Robust Nuggets Accordion (Categories + Individual Reflections)
 * - Dynamic Counselor Session Booking & Cross-Page Routing
 * - Form Submissions Routed to collegeofrelationship@gmail.com
 * - High-End Scroll Reveal Animations & Micro-interactions
 */

(function () {
  'use strict';

  const TARGET_EMAIL = 'collegeofrelationship@gmail.com';
  const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/' + TARGET_EMAIL;

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /* --------------------------------------------------------------------------
     1. Header Mobile Navigation
     -------------------------------------------------------------------------- */
  function initHeaderNav() {
    const header = $('.site-header');
    const trigger = $('.corm-mobile-trigger');
    const mobileNav = $('.corm-mobile-nav');

    if (!header || !trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = header.classList.toggle('mobile-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      trigger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      if (mobileNav) {
        mobileNav.style.display = isOpen ? 'flex' : 'none';
      }
    });

    if (mobileNav) {
      $$('a', mobileNav).forEach((link) => {
        link.addEventListener('click', () => {
          header.classList.remove('mobile-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.setAttribute('aria-label', 'Open menu');
          mobileNav.style.display = 'none';
        });
      });
    }

    document.addEventListener('click', (e) => {
      if (header.classList.contains('mobile-open') && !header.contains(e.target)) {
        header.classList.remove('mobile-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', 'Open menu');
        if (mobileNav) mobileNav.style.display = 'none';
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. Floating "Direct Enquiries" Button
     -------------------------------------------------------------------------- */
  function initFloatingEnquiryButton() {
    let btn = $('#floating-enquiry-btn');
    const isContactPage = window.location.pathname.includes('contact') || document.title.toLowerCase().includes('contact');

    if (!btn) {
      btn = document.createElement('a');
      btn.id = 'floating-enquiry-btn';
      btn.className = 'floating-enquiry-btn';
      btn.setAttribute('aria-label', 'Direct Enquiries to CORM');
      btn.href = isContactPage ? '#inquiry-form' : 'contact.html';
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
        </svg>
        <span>Direct Enquiries</span>
        <span class="enquiry-pulse-dot"></span>
      `;
      document.body.appendChild(btn);
    }

    btn.addEventListener('click', (e) => {
      if (isContactPage) {
        e.preventDefault();
        const target = $('#inquiry-form') || $('.inquiry-form') || $('#main');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const firstInput = $('input', target);
          if (firstInput) setTimeout(() => firstInput.focus(), 400);
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Robust Nuggets Accordion (Categories & Individual Nugget Cards)
     -------------------------------------------------------------------------- */
  function toggleCategory(catEl, shouldOpen) {
    if (!catEl) return;
    const headBtn = catEl.querySelector('.nuggets-cat-head');
    const chevron = catEl.querySelector('.nuggets-chevron');
    const content = catEl.querySelector('.nuggets-cat-content');

    const currentlyOpen = catEl.classList.contains('open');
    const makeOpen = shouldOpen !== undefined ? shouldOpen : !currentlyOpen;

    if (makeOpen) {
      catEl.classList.add('open');
      if (headBtn) headBtn.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.classList.add('open');
      if (content) {
        content.style.gridTemplateRows = '1fr';
      }
    } else {
      catEl.classList.remove('open');
      if (headBtn) headBtn.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.classList.remove('open');
      if (content) {
        content.style.gridTemplateRows = '0fr';
      }
    }
  }

  function toggleNuggetCard(cardEl, shouldOpen) {
    if (!cardEl) return;
    const toggleBtn = cardEl.querySelector('.nugget-card-toggle');
    const chevron = cardEl.querySelector('.nugget-toggle-icon');
    const body = cardEl.querySelector('.nugget-body');

    const currentlyCollapsed = cardEl.classList.contains('collapsed');
    const makeOpen = shouldOpen !== undefined ? shouldOpen : currentlyCollapsed;

    if (makeOpen) {
      cardEl.classList.remove('collapsed');
      cardEl.classList.add('expanded');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        const txt = toggleBtn.querySelector('.toggle-text');
        if (txt) txt.textContent = 'Hide reflection';
      }
      if (chevron) chevron.classList.add('open');
      if (body) {
        body.style.display = 'block';
      }
    } else {
      cardEl.classList.add('collapsed');
      cardEl.classList.remove('expanded');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        const txt = toggleBtn.querySelector('.toggle-text');
        if (txt) txt.textContent = 'Read reflection';
      }
      if (chevron) chevron.classList.remove('open');
      if (body) {
        body.style.display = 'none';
      }
    }
  }

  function initNuggetsAccordion() {
    const categories = $$('.nuggets-cat');
    if (!categories.length) return;

    // By default: ALL categories collapsed as requested
    categories.forEach((cat) => {
      cat.classList.remove('open');
      const headBtn = cat.querySelector('.nuggets-cat-head');
      if (headBtn) headBtn.setAttribute('aria-expanded', 'false');
      const chevron = cat.querySelector('.nuggets-chevron');
      if (chevron) chevron.classList.remove('open');
      const content = cat.querySelector('.nuggets-cat-content');
      if (content) content.style.gridTemplateRows = '0fr';
    });

    // Ensure all individual nugget cards have a toggle button and clean click handler
    const cards = $$('.nugget-card');
    cards.forEach((card, idx) => {
      // If card doesn't already have a toggle button, inject one smoothly into the header
      if (!card.querySelector('.nugget-card-toggle')) {
        const title = card.querySelector('h3');
        const num = card.querySelector('.nugget-num');
        const headerWrap = document.createElement('div');
        headerWrap.className = 'nugget-card-header';
        headerWrap.setAttribute('role', 'button');
        headerWrap.setAttribute('tabindex', '0');
        headerWrap.setAttribute('aria-label', `Toggle nugget ${idx + 1}`);

        const textGroup = document.createElement('div');
        textGroup.className = 'nugget-header-titles';
        if (num) textGroup.appendChild(num);
        if (title) textGroup.appendChild(title);

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'nugget-card-toggle';
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.innerHTML = `
          <span class="toggle-text">Read reflection</span>
          <svg class="lucide lucide-chevron-down nugget-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        `;

        headerWrap.appendChild(textGroup);
        headerWrap.appendChild(toggleBtn);
        card.insertBefore(headerWrap, card.firstChild);
      }
    });

    // Delegated click event handler for complete reliability across all 100 nuggets & 10 categories
    document.addEventListener('click', (e) => {
      // 1. Category Header Click
      const headBtn = e.target.closest('.nuggets-cat-head');
      if (headBtn) {
        e.preventDefault();
        const cat = headBtn.closest('.nuggets-cat');
        if (cat) {
          toggleCategory(cat);
        }
        return;
      }

      // 2. Individual Nugget Card Header Click or Toggle Button Click
      const cardHeader = e.target.closest('.nugget-card-header');
      const cardToggle = e.target.closest('.nugget-card-toggle');
      if (cardHeader || cardToggle) {
        if (e.target.closest('a')) return; // Allow normal links inside cards
        e.preventDefault();
        const card = e.target.closest('.nugget-card');
        if (card) {
          toggleNuggetCard(card);
        }
        return;
      }

      // 3. Quick Action: Expand All / Collapse All
      const expandAllBtn = e.target.closest('#expand-all-nuggets-btn');
      if (expandAllBtn) {
        e.preventDefault();
        categories.forEach(cat => toggleCategory(cat, true));
        return;
      }

      const collapseAllBtn = e.target.closest('#collapse-all-nuggets-btn');
      if (collapseAllBtn) {
        e.preventDefault();
        categories.forEach(cat => toggleCategory(cat, false));
        return;
      }
    });

    // Keyboard accessibility for card headers
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const cardHeader = e.target.closest('.nugget-card-header');
        if (cardHeader && !e.target.closest('a') && !e.target.closest('button')) {
          e.preventDefault();
          const card = cardHeader.closest('.nugget-card');
          if (card) toggleNuggetCard(card);
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Counselor Booking Flow with Dynamic Name Routing
     -------------------------------------------------------------------------- */
  function initCounselorBooking() {
    const counselorSelect = $('#booking-counselor');
    const counselorDisplay = $('#selected-counselor-name');
    const bookingSection = $('#request') || $('#booking-form-card');

    function selectCounselor(counselorName) {
      if (!counselorName) return;

      if (counselorSelect) {
        let found = false;
        for (let i = 0; i < counselorSelect.options.length; i++) {
          const optVal = counselorSelect.options[i].value.toLowerCase();
          const target = counselorName.toLowerCase();
          if (optVal.includes(target) || target.includes(optVal)) {
            counselorSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          const newOpt = new Option(counselorName, counselorName, true, true);
          counselorSelect.add(newOpt);
        }
      }

      if (counselorDisplay) {
        counselorDisplay.textContent = counselorName;
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const card = $('.intake-card', bookingSection) || bookingSection;
        card.classList.remove('highlight-pulse');
        void card.offsetWidth;
        card.classList.add('highlight-pulse');
      }
    }

    // Handle clicks on [data-counselor] buttons across the page
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.request-session-btn') || e.target.closest('[data-counselor]');
      if (btn) {
        const cName = btn.getAttribute('data-counselor');
        if (cName) {
          if (window.location.pathname.includes('counselors')) {
            e.preventDefault();
            selectCounselor(cName);
          } else {
            // Route from other pages (e.g. index.html) to counselors page with query param
            window.location.href = `counselors.html?counselor=${encodeURIComponent(cName)}#request`;
          }
        }
      }
    });

    // Check URL parameters for cross-page routing (e.g. counselors.html?counselor=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCounselor = urlParams.get('counselor');
      if (urlCounselor) {
        setTimeout(() => selectCounselor(urlCounselor), 250);
      }
    } catch (_) {}

    if (counselorSelect && counselorDisplay) {
      counselorSelect.addEventListener('change', () => {
        counselorDisplay.textContent = counselorSelect.value || 'Any Available Counselor';
      });
    }

    const changeBtn = $('#change-counselor-btn');
    if (changeBtn && counselorSelect) {
      changeBtn.addEventListener('click', () => {
        counselorSelect.focus();
      });
    }
  }

  /* --------------------------------------------------------------------------
     5. Scroll-Triggered Reveal Animations
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = $$(
      'section, .nuggets-cat, .service-item, .team-card, .counselor-card, .book-card, .intake-card, .service-grid article, .values-grid article'
    );
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -25px 0px', threshold: 0.04 }
    );

    targets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  /* --------------------------------------------------------------------------
     6. Form Submissions Routed to collegeofrelationship@gmail.com
     -------------------------------------------------------------------------- */
  function showStatus(form, type, message) {
    let statusEl = $('.form-status-msg', form.parentNode) || $('.form-status-msg', form);
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'form-status-msg';
      form.parentNode.insertBefore(statusEl, form.nextSibling);
    }
    statusEl.className = `form-status-msg ${type}`;
    statusEl.innerHTML = message;
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function mailtoFallback(subject, body) {
    const url = 'mailto:' + encodeURIComponent(TARGET_EMAIL) +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    window.location.href = url;
  }

  function handleFormSubmission(form, formType) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = $('button[type="submit"]', form);
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending to ministerial team...';
      }

      showStatus(form, 'loading', '⏳ Sending your details directly to the CORM counseling & ministry team...');

      const formData = new FormData(form);
      const counselorName = formData.get('counselor') || $('#selected-counselor-name')?.textContent || 'General Inquiry';
      const senderName = formData.get('name') || formData.get('fullName') || 'Inquirer';
      const senderEmail = formData.get('email') || '';

      const payload = {
        _subject: formType === 'counselor_booking'
          ? `[CORM Booking] Consultation Request for ${counselorName} - from ${senderName}`
          : `[CORM Website Inquiry] ${formData.get('subject') || 'Contact Message'} - from ${senderName}`,
        _replyto: senderEmail,
        target_inbox: TARGET_EMAIL,
        counselor_requested: counselorName,
        submitted_at: new Date().toISOString()
      };

      formData.forEach((value, key) => {
        payload[key] = value;
      });

      try {
        const response = await fetch(FORMSUBMIT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
          showStatus(
            form,
            'success',
            '✓ <strong>Your message has been delivered!</strong> Your request has been sent straight to <strong>' +
            TARGET_EMAIL +
            '</strong>' + (formType === 'counselor_booking' ? ` regarding <strong>${counselorName}</strong>.` : '.') +
            ' A member of the CORM leadership will follow up with you within 24–48 hours.'
          );
          form.reset();
        } else {
          throw new Error(data.message || 'Server error occurred');
        }
      } catch (err) {
        console.warn('Fallback to native mail client:', err);

        let mailBody = 'CORM Website Submission Details:\n\n';
        for (const [key, val] of Object.entries(payload)) {
          if (!key.startsWith('_')) {
            mailBody += `${key}: ${val}\n`;
          }
        }

        mailtoFallback(payload._subject, mailBody);

        showStatus(
          form,
          'success',
          '✓ Your email client has been prepared with your request addressed to <strong>' +
          TARGET_EMAIL +
          '</strong>. Please tap "Send" in your email application to complete delivery.'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  function initForms() {
    const counselorForm = $('#counselor-booking-form');
    if (counselorForm) {
      handleFormSubmission(counselorForm, 'counselor_booking');
    }

    $$('.inquiry-form').forEach((form) => {
      handleFormSubmission(form, 'inquiry');
    });

    $$('.step-form').forEach((form) => {
      handleFormSubmission(form, 'counselor_booking');
    });
  }

  /* --------------------------------------------------------------------------
     7. Initialize on DOM Ready
     -------------------------------------------------------------------------- */
  function initAll() {
    initHeaderNav();
    initFloatingEnquiryButton();
    initNuggetsAccordion();
    initCounselorBooking();
    initScrollReveal();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
