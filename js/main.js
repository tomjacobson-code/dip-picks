/* ============================================================
   DIP PICKS — Main JavaScript v3
   ============================================================ */

// --- Cart Helpers (localStorage) ---
function getCart() {
  try { return JSON.parse(localStorage.getItem('dipPicksCart') || '[]'); }
  catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem('dipPicksCart', JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function updateCartBadges() {
  var count = getCartCount();
  document.querySelectorAll('.nav__cart-count').forEach(function (el) {
    el.textContent = count;
  });
}

function addToCart(item) {
  var cart = getCart();
  // For dips: merge if same name + size. Bundles always get a new line.
  if (item.type === 'dip') {
    var existing = cart.find(function (i) {
      return i.type === 'dip' && i.name === item.name && i.size === item.size;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      item.qty = 1;
      cart.push(item);
    }
  } else {
    item.qty = 1;
    cart.push(item);
  }
  saveCart(cart);
  updateCartBadges();
}

// Init badge on page load
updateCartBadges();


// --- Sticky Nav Shadow ---
var nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}


// --- Mobile Nav ---
var toggle = document.getElementById('navToggle');
var mobileNav = document.getElementById('mobileNav');
var mobileOverlay = document.getElementById('mobileOverlay');
var mobileClose = document.getElementById('mobileClose');

function openMobileNav() {
  if (mobileNav) mobileNav.classList.add('open');
  if (mobileOverlay) mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  if (mobileNav) mobileNav.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (toggle) toggle.addEventListener('click', openMobileNav);
if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);


// --- Scroll Reveal ---
var reveals = document.querySelectorAll('.dip-card, .bundle-card, .section-header, .gifting-grid > *, .hero-fullbleed__content, .hosting-section__content');

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(function (el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
  revealObserver.observe(el);
});


// --- Size Toggle on Individual Dip Cards ---
document.querySelectorAll('.dip-card').forEach(function (card) {
  var sizeBtns = card.querySelectorAll('.dip-card__size-btn');
  var priceEl = card.querySelector('.dip-card__price');

  sizeBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      sizeBtns.forEach(function (s) { s.classList.remove('active'); });
      btn.classList.add('active');
      if (priceEl && btn.dataset.price) {
        priceEl.textContent = '$' + btn.dataset.price;
      }
    });
  });
});


// --- Add to Cart: Individual Dip Cards ---
document.querySelectorAll('.dip-card').forEach(function (card) {
  var addBtn = card.querySelector('.dip-card__add');
  if (!addBtn) return;

  addBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (addBtn.classList.contains('added')) return;

    var nameEl = card.querySelector('.dip-card__name');
    var activeSizeBtn = card.querySelector('.dip-card__size-btn.active');
    var name = nameEl ? nameEl.textContent.trim() : 'Dip';
    var size = activeSizeBtn ? activeSizeBtn.textContent.trim().replace(/\$[\d.]+/, '').trim() : 'Regular';
    var price = activeSizeBtn && activeSizeBtn.dataset.price ? parseFloat(activeSizeBtn.dataset.price) : 18.00;

    addToCart({ type: 'dip', name: name, size: size, price: price });

    addBtn.classList.add('added');
    addBtn.textContent = '✓';
    setTimeout(function () {
      addBtn.classList.remove('added');
      addBtn.textContent = '+';
    }, 1400);
  });
});


// --- Quantity Buttons (PDP) ---
document.querySelectorAll('.pdp__qty-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var valueEl = btn.parentElement.querySelector('.pdp__qty-value');
    var val = parseInt(valueEl.textContent);
    if (btn.dataset.action === 'increase') {
      val++;
    } else if (btn.dataset.action === 'decrease' && val > 1) {
      val--;
    }
    valueEl.textContent = val;
  });
});


// --- Active Nav Link ---
var currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(function (link) {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
