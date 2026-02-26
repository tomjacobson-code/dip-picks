/* ============================================================
   DIP PICKS — Main JavaScript v2
   ============================================================ */

// --- Sticky Nav Shadow ---
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// --- Mobile Nav ---
const toggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function openMobileNav() {
  mobileNav.classList.add('open');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (toggle) toggle.addEventListener('click', openMobileNav);
if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

// --- Scroll Reveal ---
const reveals = document.querySelectorAll('.dip-card, .bundle-card, .section-header, .gifting-grid > *, .hero-fullbleed__content, .hosting-section__content');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
  revealObserver.observe(el);
});

// --- Size Toggle on Product Cards ---
document.querySelectorAll('.dip-card__size-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const card = btn.closest('.dip-card');
    const siblings = card.querySelectorAll('.dip-card__size-btn');
    siblings.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');

    const price = btn.dataset.price;
    const priceEl = card.querySelector('.dip-card__price');
    if (priceEl && price) {
      priceEl.textContent = '$' + price;
    }
  });
});

// --- Quantity Buttons (PDP) ---
document.querySelectorAll('.pdp__qty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const valueEl = btn.parentElement.querySelector('.pdp__qty-value');
    let val = parseInt(valueEl.textContent);
    if (btn.dataset.action === 'increase') {
      val++;
    } else if (btn.dataset.action === 'decrease' && val > 1) {
      val--;
    }
    valueEl.textContent = val;
  });
});

// --- Add to Cart (placeholder) ---
document.querySelectorAll('.dip-card__add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Quick animation
    btn.style.transform = 'scale(1.3)';
    btn.textContent = '\u2713';
    btn.style.background = 'var(--burnt-orange)';

    setTimeout(() => {
      btn.style.transform = '';
      btn.textContent = '+';
      btn.style.background = '';
    }, 1200);

    // Update cart count
    const cartCount = document.querySelector('.nav__cart-count');
    if (cartCount) {
      cartCount.textContent = parseInt(cartCount.textContent) + 1;
    }
  });
});

// --- Active Nav Link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
