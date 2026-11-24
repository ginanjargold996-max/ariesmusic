// Tailwind CSS Custom Configuration
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          obsidian: '#09090B',
          surface: '#111114',
          crimson: '#DC2626',
          scarlet: '#EF4444',
          'crimson-dark': '#991B1B',
          mist: '#F4F4F5'
        },
        fontFamily: {
          display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
          heading: ['"Plus Jakarta Sans"', 'sans-serif'],
          sans: ['"Inter"', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'monospace']
        }
      }
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Header & Back-To-Top Scroll State
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const heroBgImg = document.getElementById('heroBgImg');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (header) {
      if (currentScroll > 50) {
        header.classList.add('shadow-2xl');
      } else {
        header.classList.remove('shadow-2xl');
      }
    }

    if (backToTop) {
      if (currentScroll > 500) {
        backToTop.classList.remove('opacity-0', 'invisible');
        backToTop.classList.add('opacity-100', 'visible');
      } else {
        backToTop.classList.add('opacity-0', 'invisible');
        backToTop.classList.remove('opacity-100', 'visible');
      }
    }

    if (heroBgImg && currentScroll < window.innerHeight) {
      heroBgImg.style.transform = `translateY(${currentScroll * 0.22}px) scale(1.05)`;
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const icon = menuToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Scroll Reveal IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // Package Tabs & Dropdown Synchronization
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function activatePackageTab(targetTab) {
    if (!targetTab || tabBtns.length === 0) return;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    const targetBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab);
    if (targetBtn) targetBtn.classList.add('active');
    if (targetContent) targetContent.classList.add('active');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activatePackageTab(btn.dataset.tab);
    });
  });

  // Activate tab from URL hash on packages.html
  if (window.location.hash) {
    const hashTab = window.location.hash.replace('#', '');
    if (['acoustic', 'electric', 'exclusive'].includes(hashTab)) {
      activatePackageTab(hashTab);
    }
  }

  document.querySelectorAll('.package-dropdown-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const tabName = link.dataset.navTab;
      const packagesSection = document.getElementById('packages');
      if (packagesSection) {
        e.preventDefault();
        activatePackageTab(tabName);
        closeMobileMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Client Search & Category Filter
  const clientSearch = document.getElementById('clientSearch');
  const clientFilterBtns = document.querySelectorAll('.client-filter-btn');
  const clientItems = document.querySelectorAll('.client-item');
  const noClientMsg = document.getElementById('noClientMsg');
  let activeClientCat = 'all';

  function filterClients() {
    const query = clientSearch ? clientSearch.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    clientItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const cat = item.dataset.category;
      const matchesCat = activeClientCat === 'all' || cat === activeClientCat;
      const matchesQuery = text.includes(query);

      if (matchesCat && matchesQuery) {
        item.style.display = 'flex';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (noClientMsg) {
      noClientMsg.classList.toggle('hidden', visibleCount > 0);
    }
  }

  if (clientSearch) {
    clientSearch.addEventListener('input', filterClients);
  }

  clientFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clientFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeClientCat = btn.dataset.cat;
      filterClients();
    });
  });

  // Gallery Lightbox Modal with Prev/Next Controls
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeLightbox = document.getElementById('closeLightbox');
  const prevLightbox = document.getElementById('prevLightbox');
  const nextLightbox = document.getElementById('nextLightbox');
  const galleryTriggers = Array.from(document.querySelectorAll('.gallery-trigger'));
  let currentGalleryIdx = 0;

  function openLightboxAt(index) {
    if (galleryTriggers.length === 0 || !lightboxModal) return;
    currentGalleryIdx = (index + galleryTriggers.length) % galleryTriggers.length;
    const item = galleryTriggers[currentGalleryIdx];
    lightboxImg.src = item.dataset.img;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightboxCounter.textContent = `${String(currentGalleryIdx + 1).padStart(2, '0')} / ${String(galleryTriggers.length).padStart(2, '0')}`;
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
  }

  galleryTriggers.forEach((trigger, idx) => {
    trigger.addEventListener('click', () => openLightboxAt(idx));
  });

  function hideLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
    lightboxImg.src = '';
  }

  if (prevLightbox) prevLightbox.addEventListener('click', () => openLightboxAt(currentGalleryIdx - 1));
  if (nextLightbox) nextLightbox.addEventListener('click', () => openLightboxAt(currentGalleryIdx + 1));
  if (closeLightbox) closeLightbox.addEventListener('click', hideLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) hideLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      return;
    }
    if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowLeft') openLightboxAt(currentGalleryIdx - 1);
    if (e.key === 'ArrowRight') openLightboxAt(currentGalleryIdx + 1);
  });

  // Quick Copy Contact Info
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      const original = btn.textContent;
      btn.textContent = 'Tersalin!';
      btn.classList.add('text-scarlet', 'border-scarlet');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('text-scarlet', 'border-scarlet');
      }, 1800);
    });
  });

  // Contact Form Submission Feedback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check mr-2"></i>Pesan Terkirim!';
      btn.style.background = '#09090B';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        this.reset();
      }, 3000);
    });
  }
});
