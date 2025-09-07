/* Portfolio JavaScript */

(() => {
  'use strict';

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Contact pop-up */
  const form = document.getElementById('myForm');

  function openForm() {
    if (!form) return;
    form.style.display = 'block';
    const firstInput = form.querySelector('input, textarea, select, button');
    if (firstInput) firstInput.focus();
  }
  function closeForm() {
    if (!form) return;
    form.style.display = 'none';
  }

  // Expose to inline HTML handlers
  window.openForm = openForm;
  window.closeForm = closeForm;

  // Close when clicking outside the popup or on a ".cancel" button
  document.addEventListener('click', (event) => {
    if (!form) return;
    const clickedCancel = event.target.matches('.cancel');
    const clickedInsideForm = event.target.closest('.form-popup');
    const clickedContactTrigger = event.target.closest('.Pop_Up_Button, .contact');
    if (clickedCancel || (!clickedInsideForm && !clickedContactTrigger)) closeForm();
  }, false);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeForm();
  });

  /*  HTML5 validation for the contact form */
  if (form) {
    // Ensure the key fields are required (in case HTML changes later)
    ['Name', 'Email', 'Message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.required = true;
    });

    // Show native tooltip bubbles and block submission if invalid
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        // Triggers the browser's native "Please fill out this field!" bubble on the first invalid input
        if (typeof form.reportValidity === 'function') {
          form.reportValidity();
        } else {
          // Ancient fallback
          alert('Please fill out this field!');
        }
      }
    });

    // Use our exact message ONLY for empty fields; keep default messages for other errors (e.g., bad email)
    ['Name', 'Email', 'Message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      el.addEventListener('invalid', () => {
        // If it's missing, show our phrase; otherwise leave default messages alone
        if (el.validity.valueMissing) {
          el.setCustomValidity('Please fill out this field!');
        } else {
          el.setCustomValidity('');
        }
      });

      // Clear custom message once the user types
      el.addEventListener('input', () => el.setCustomValidity(''));
    });
  }

  /* - Slideshow - */
  let slideIndex = 1;
  const getSlides = () => Array.from(document.getElementsByClassName('mySlides'));
  const getDots   = () => Array.from(document.getElementsByClassName('dot'));

  function showSlides(n) {
    const slides = getSlides();
    const dots   = getDots();
    if (slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1)             { slideIndex = slides.length; }

    slides.forEach(s => s.style.display = 'none');
    dots.forEach(d => d.classList.remove('active'));

    slides[slideIndex - 1].style.display = 'block';
    if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');
  }

  function plusSlides(n)   { showSlides(slideIndex += n); }
  function currentSlide(n) { showSlides(slideIndex = n); }

  // Expose for inline HTML handlers
  window.plusSlides = plusSlides;
  window.currentSlide = currentSlide;

  // Initialize after DOM 
  document.addEventListener('DOMContentLoaded', () => {
    showSlides(slideIndex);

    // For any inline onclicks
    getDots().forEach((dot, i) => dot.addEventListener('click', () => currentSlide(i + 1)));

    // Keyboard navigation for slideshow
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  plusSlides(-1);
      if (e.key === 'ArrowRight') plusSlides(1);
    });

    // Gentle auto-advance that respects reduced motion
    const container = document.getElementById('Slideshow_Container') || document.getElementById('Slideshow');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = null;
    const startAuto = () => {
      if (prefersReduced.matches) return;
      stopAuto();
      timer = setInterval(() => plusSlides(1), 6000);
    };
    const stopAuto = () => { if (timer) clearInterval(timer); timer = null; };

    if (container) {
      container.addEventListener('mouseenter', stopAuto);
      container.addEventListener('mouseleave', startAuto);
      startAuto();
    }
  });
})();