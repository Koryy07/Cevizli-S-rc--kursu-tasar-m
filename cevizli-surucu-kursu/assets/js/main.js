/**
 * Cevizli Sürücü Kursu - Ana JavaScript Dosyası
 * İçerik: Navbar, Animasyonlar, Sayaçlar, Form Doğrulama
 */

'use strict';

/* =============================================
   DOM Hazır Olduğunda Çalıştır
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initAppointmentForm();
  initScrollTop();
  initSmoothScroll();
  setMinDate();
});

/* =============================================
   NAVBAR - Scroll Efekti & Aktif Link
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll'da navbar arka planı değiştir
  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Aktif bölümü belirle
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // İlk yüklemede çalıştır
}

/* =============================================
   MOBİL MENÜ - Hamburger Toggle
   ============================================= */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Hamburger tıklama
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Menü linkine tıklandığında menüyü kapat
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Dışarı tıklandığında menüyü kapat
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* =============================================
   SCROLL ANİMASYONLARI - Intersection Observer
   ============================================= */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Kademeli gecikme ile görünür yap
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   SAYAÇ ANİMASYONU
   ============================================= */
function initCounters() {
  const counters = document.querySelectorAll('.counter, .stat-number');
  let countersStarted = false;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    if (!target) return;

    const duration = 2000; // ms
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('tr-TR');
    }, 16);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* =============================================
   RANDEVU FORMU - Doğrulama ve Gönderim
   ============================================= */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  // Gerçek zamanlı doğrulama
  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');

  fullNameInput.addEventListener('blur', () => validateName(fullNameInput));
  phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
  phoneInput.addEventListener('input', formatPhone);

  // Form gönderimi
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName(fullNameInput);
    const isPhoneValid = validatePhone(phoneInput);

    if (!isNameValid || !isPhoneValid) return;

    // Gönderme animasyonu
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

    // Simüle edilmiş gönderim (gerçek backend bağlantısı için değiştirin)
    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'block';
      successMsg.style.animation = 'fadeUp 0.5s ease forwards';
    }, 1500);
  });
}

function validateName(input) {
  const errorEl = document.getElementById('nameError');
  const value = input.value.trim();

  if (!value) {
    showError(input, errorEl, 'Ad soyad alanı zorunludur.');
    return false;
  }
  if (value.length < 3) {
    showError(input, errorEl, 'Ad soyad en az 3 karakter olmalıdır.');
    return false;
  }
  clearError(input, errorEl);
  return true;
}

function validatePhone(input) {
  const errorEl = document.getElementById('phoneError');
  const value = input.value.replace(/\s/g, '');

  if (!value) {
    showError(input, errorEl, 'Telefon numarası zorunludur.');
    return false;
  }
  // Türk telefon numarası formatı
  const phoneRegex = /^(0|\+90)?[5][0-9]{9}$/;
  if (!phoneRegex.test(value)) {
    showError(input, errorEl, 'Geçerli bir telefon numarası girin (05XX XXX XX XX).');
    return false;
  }
  clearError(input, errorEl);
  return true;
}

function formatPhone(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);

  // Otomatik format: 0555 555 55 55
  if (value.length >= 4 && value.length < 7) {
    value = value.slice(0, 4) + ' ' + value.slice(4);
  } else if (value.length >= 7 && value.length < 10) {
    value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
  } else if (value.length >= 10) {
    value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 9) + ' ' + value.slice(9, 11);
  }
  e.target.value = value;
}

function showError(input, errorEl, message) {
  input.style.borderColor = '#e31e24';
  errorEl.textContent = message;
}

function clearError(input, errorEl) {
  input.style.borderColor = '#22c55e';
  errorEl.textContent = '';
}

/* =============================================
   MİNİMUM TARİH - Bugünden önce seçilemesin
   ============================================= */
function setMinDate() {
  const dateInput = document.getElementById('appointmentDate');
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/* =============================================
   SCROLL TO TOP BUTONU
   ============================================= */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   SMOOTH SCROLL - Tüm Anchor Linkler
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const targetTop = target.offsetTop - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* =============================================
   KURS KARTLARI - Hover Efekti Güçlendirme
   ============================================= */
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
  });
});

/* =============================================
   YORUM KARTLARI - Otomatik Kaydırma (Opsiyonel)
   ============================================= */
// Yorumlar için basit bir fade-in efekti zaten CSS'de mevcut.
// İleride slider eklemek için bu bölüm genişletilebilir.

/* =============================================
   SAYFA YÜKLENİRKEN LOADING EFEKTİ
   ============================================= */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
