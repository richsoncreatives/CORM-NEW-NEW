/**
 * CORM (College of Relationship & Marriage) Core Client Scripts
 * - Responsive Mobile Navigation
 * - Floating "Direct Enquiries" Button
 * - Robust Event Delegation Nuggets Accordion (Every Item & Category Expands/Collapses)
 * - Dynamic Counselor Session Booking & Cross-Page Routing
 * - Secure Form Submissions to collegeofrelationship@gmail.com
 * - Scroll-Triggered Reveal Animations
 */

(function () {
  'use strict';

  const TARGET_EMAIL = 'collegeofrelationship@gmail.com';
  const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/' + TARGET_EMAIL;

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /* 1. Header Mobile Navigation */
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
    });

    if (mobileNav) {
      $$('a', mobileNav).forEach((link) => {
        link.addEventListener('click', () => {
          header.classList.remove('mobile-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.setAttribute('aria-label', 'Open menu');
        });
      });
    }

    document.addEventListener('click', (e) => {
      if (header.classList.contains('mobile-open') && !header.contains(e.target)) {
        header.classList.remove('mobile-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', 'Open menu');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('mobile-open')) {
        header.classList.remove('mobile-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', 'Open menu');
        trigger.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100 && header.classList.contains('mobile-open')) {
        header.classList.remove('mobile-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* 2. Floating "Direct Enquiries" Button */
  function initFloatingEnquiryButton() {
    const existing = $('#floating-enquiry-btn');
    const isContactPage = window.location.pathname.includes('contact') || document.title.toLowerCase().includes('contact');

    let btn = existing;
    if (!btn) {
      btn = document.createElement('a');
      btn.id = 'floating-enquiry-btn';
      btn.className = 'floating-enquiry-btn';
      btn.setAttribute('aria-label', 'Direct Enquiries to CORM');
      btn.href = isContactPage ? '#main' : 'contact.html';
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
        const target = $('.inquiry-form') || $('#main');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const firstInput = $('input', target);
          if (firstInput) setTimeout(() => firstInput.focus(), 400);
        }
      }
    });
  }

  /* 3. Robust Event-Delegated Nuggets Accordion */
  function initNuggetsAccordion() {
    document.addEventListener('click', (e) => {
      // A. Category Header Click
      const headBtn = e.target.closest('.nuggets-cat-head');
      if (headBtn) {
        e.preventDefault();
        const cat = headBtn.closest('.nuggets-cat');
        if (!cat) return;

        const chevron = cat.querySelector('.nuggets-chevron');
        const isOpen = cat.classList.contains('open');

        if (isOpen) {
          cat.classList.remove('open');
          headBtn.setAttribute('aria-expanded', 'false');
          if (chevron) chevron.classList.remove('open');
        } else {
          cat.classList.add('open');
          headBtn.setAttribute('aria-expanded', 'true');
          if (chevron) chevron.classList.add('open');
        }
        return;
      }

      // B. Individual Nugget Card Header Click
      const card = e.target.closest('.nugget-card');
      if (card) {
        if (e.target.closest('a') || e.target.closest('button')) return;

        const headerTrigger = e.target.closest('.nugget-card-header') ||
                              e.target.closest('.nugget-card-toggle') ||
                              e.target.closest('h3');
        if (headerTrigger) {
          e.preventDefault();
          card.classList.toggle('collapsed');
        }
      }
    });
  }

  /* 4. Counselor Booking Flow with Dynamic Name Routing */
  function initCounselorBooking() {
    const counselorInput = $('#booking-counselor');
    const counselorDisplay = $('#selected-counselor-name');
    const bookingSection = $('#request');

    function selectCounselor(counselorName) {
      if (!counselorName) return;

      if (counselorInput) counselorInput.value = counselorName;

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

    // Handle clicks on [data-counselor] buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.request-session-btn') || e.target.closest('[data-counselor]');
      if (btn) {
        e.preventDefault();
        const cName = btn.getAttribute('data-counselor');
        if (cName) selectCounselor(cName);
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

  }

  /* 5. Scroll-Triggered Reveal Animation */
  function initScrollReveal() {
    const targets = $$(
      'section, .nuggets-cat, .service-item, .team-card, .book-card, .intake-card, .service-grid article, .values-grid article'
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
      { rootMargin: '0px 0px -30px 0px', threshold: 0.05 }
    );

    targets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  /* 6. Form Submission Handling with Routing to collegeofrelationship@gmail.com */
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
        submitBtn.innerHTML = 'Sending...';
      }

      showStatus(form, 'loading', '⏳ Sending your details to the CORM counseling & ministry team...');

      const formData = new FormData(form);
      const payload = {
        _subject: formType === 'counselor_booking'
          ? `[CORM Booking] Consultation Request: ${formData.get('counselor') || 'General'}`
          : `[CORM Website Inquiry] ${formData.get('subject') || 'Contact Message'}`,
        _replyto: formData.get('email') || '',
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
            '✓ <strong>Your message has been received!</strong> Your inquiry has been sent directly to <strong>' +
            TARGET_EMAIL +
            '</strong>. A member of our team will contact you shortly.'
          );
          form.reset();
        } else {
          throw new Error(data.message || 'Server error occurred');
        }
      } catch (err) {
        console.warn('Direct delivery fallback to mailto client:', err);

        let mailBody = 'CORM Website Submission:\n\n';
        for (const [key, val] of Object.entries(payload)) {
          if (!key.startsWith('_')) {
            mailBody += `${key}: ${val}\n`;
          }
        }

        mailtoFallback(payload._subject, mailBody);

        showStatus(
          form,
          'success',
          '✓ Your email application has opened with your message addressed to <strong>' +
          TARGET_EMAIL +
          '</strong>. Please click "Send" to complete your submission.'
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

  /* 7. Initialize Everything Cleanly */
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
