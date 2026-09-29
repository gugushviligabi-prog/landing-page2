/**
 * AURA TECH — Interactive Modern Landing Page Engine
 * Pure Vanilla JavaScript (No external libraries required)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Theme Management (Dark / Light Mode)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or system preference
  const savedTheme = localStorage.getItem('aura_theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('aura_theme', newTheme);

      showToast(newTheme === 'dark' ? 'მუქი რეჟიმი გააქტიურდა' : 'ღია რეჟიმი გააქტიურდა', 'info', 2500);
    });
  }

  /* --------------------------------------------------------------------------
     2. Sticky Header & Scroll Spy Navigation
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  const handleScroll = () => {
    const scrollY = window.pageYOffset;

    // Header blur background on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Active Section Spy
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn');

  if (mobileToggleBtn && mobileDrawer) {
    const toggleMobileMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggleBtn.classList.toggle('active', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    };

    mobileToggleBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Interactive 3D Tilt Effect on Hero Card
     -------------------------------------------------------------------------- */
  const heroTiltCard = document.getElementById('hero-tilt-card');
  const heroVisualCard = document.getElementById('hero-visual-card');

  if (heroVisualCard && heroTiltCard && window.innerWidth > 992) {
    heroVisualCard.addEventListener('mousemove', (e) => {
      const rect = heroVisualCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      heroTiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroVisualCard.addEventListener('mouseleave', () => {
      heroTiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* --------------------------------------------------------------------------
     5. Animated Number Counter-Up Effect
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('[data-target]');
  let hasAnimatedCounters = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // EaseOutExpo curve
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = (target * ease).toFixed(decimals);

        counter.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  // Trigger counters with IntersectionObserver
  const statsSection = document.getElementById('about-stats-grid');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedCounters) {
          hasAnimatedCounters = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // Also trigger hero quick stats immediately
  const heroStats = document.querySelector('.hero-quick-stats');
  if (heroStats) {
    setTimeout(() => {
      const quickNumbers = heroStats.querySelectorAll('[data-target]');
      quickNumbers.forEach(c => {
        const target = parseFloat(c.getAttribute('data-target'));
        const isFloat = target % 1 !== 0;
        let start = 0;
        const step = target / 30;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            c.textContent = isFloat ? `${target}%` : (target === 150 ? `${target}K+` : `${target}x`);
            clearInterval(timer);
          } else {
            c.textContent = isFloat ? `${start.toFixed(1)}%` : `${Math.floor(start)}${target === 150 ? 'K+' : 'x'}`;
          }
        }, 30);
      });
    }, 400);
  }

  /* --------------------------------------------------------------------------
     6. Features Filtering System
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const featureCards = document.querySelectorAll('.feature-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      featureCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     7. Interactive Accordion (About Pillars)
     -------------------------------------------------------------------------- */
  const pillarItems = document.querySelectorAll('.pillar-item');

  pillarItems.forEach(item => {
    const headerBtn = item.querySelector('.pillar-header');
    if (headerBtn) {
      headerBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other pillars
        pillarItems.forEach(p => {
          p.classList.remove('active');
          const pBtn = p.querySelector('.pillar-header');
          if (pBtn) pBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          headerBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     8. Testimonials Carousel / Slider
     -------------------------------------------------------------------------- */
  const testimonials = [
    {
      stars: '★★★★★',
      quote: '„AURA Tech-ის ინტეგრაციის შემდეგ ჩვენი მონაცემების დამუშავების დრო 6-ჯერ შემცირდა. სისტემის სტაბილურობა და ქართული ენის სრული მხარდაჭერა საუკეთესოა ბაზარზე.“',
      name: 'ნიკოლოზ ბერიძე',
      role: 'ოპერაციული დირექტორი, FinTech Solutions',
      avatar: 'ნი'
    },
    {
      stars: '★★★★★',
      quote: '„ავტომატიზირებულმა სამუშაო პროცესებმა ჩვენს საინჟინრო გუნდს კვირაში 25+ საათი დაუზოგა. API არის წარმოუდგენლად სწრაფი და ინტუიციური.“',
      name: 'თამარ კვირიკაშვილი',
      role: 'მთავარი არქიტექტორი, CloudScale Global',
      avatar: 'თკ'
    },
    {
      stars: '★★★★★',
      quote: '„კიბერუსაფრთხოების სტანდარტები და მყისიერი მონიტორინგი გვაძლევს სრულ გარანტიას. AURA-სთან თანამშრომლობა ჩვენი საუკეთესო სტრატეგიული გადაწყვეტილება იყო.“',
      name: 'გიორგი მაისურაძე',
      role: 'CIO, Enterprise Logistics Georgia',
      avatar: 'გმ'
    }
  ];

  let currentTestimonialIndex = 0;
  const tQuote = document.getElementById('t-quote');
  const tName = document.getElementById('t-name');
  const tRole = document.getElementById('t-role');
  const tAvatar = document.getElementById('t-avatar');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const testimonialCard = document.getElementById('testimonial-card');

  const updateTestimonial = (index) => {
    if (!tQuote || !tName || !tRole || !tAvatar || !testimonialCard) return;

    testimonialCard.style.opacity = '0';
    testimonialCard.style.transform = 'translateY(8px)';

    setTimeout(() => {
      const data = testimonials[index];
      tQuote.textContent = data.quote;
      tName.textContent = data.name;
      tRole.textContent = data.role;
      tAvatar.textContent = data.avatar;

      dotBtns.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      testimonialCard.style.opacity = '1';
      testimonialCard.style.transform = 'translateY(0)';
    }, 250);
  };

  dotBtns.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentTestimonialIndex = index;
      updateTestimonial(index);
    });
  });

  // Auto slide every 7 seconds
  setInterval(() => {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    updateTestimonial(currentTestimonialIndex);
  }, 7000);

  /* --------------------------------------------------------------------------
     9. Video Demo Modal Dialog
     -------------------------------------------------------------------------- */
  const demoModal = document.getElementById('demo-modal');
  const heroDemoBtn = document.getElementById('hero-demo-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalCtaBtn = document.getElementById('modal-cta-btn');

  const openModal = () => {
    if (demoModal) {
      demoModal.removeAttribute('hidden');
      requestAnimationFrame(() => {
        demoModal.classList.add('open');
      });
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (demoModal) {
      demoModal.classList.remove('open');
      setTimeout(() => {
        demoModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }, 300);
    }
  };

  if (heroDemoBtn) heroDemoBtn.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
  if (modalCtaBtn) modalCtaBtn.addEventListener('click', closeModal);

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Contact Form Validation & Submission
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const termsInput = document.getElementById('contact-terms');
  const submitBtn = document.getElementById('contact-submit-btn');
  const charCounter = document.getElementById('char-counter');

  // Error labels
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const termsError = document.getElementById('terms-error');

  // Live textarea character counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 500) {
        charCounter.style.color = '#ef4444';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // Email regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (messageError) messageError.textContent = '';
      if (termsError) termsError.textContent = '';
      nameInput.classList.remove('invalid');
      emailInput.classList.remove('invalid');
      messageInput.classList.remove('invalid');

      // Name validation
      if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
        nameError.textContent = 'გთხოვთ მიუთითოთ სახელი (მინიმუმ 3 სიმბოლო)';
        nameInput.classList.add('invalid');
        isValid = false;
      }

      // Email validation
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        emailError.textContent = 'გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი';
        emailInput.classList.add('invalid');
        isValid = false;
      }

      // Message validation
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageError.textContent = 'შეტყობინება უნდა შედგებოდეს მინიმუმ 10 სიმბოლოსგან';
        messageInput.classList.add('invalid');
        isValid = false;
      }

      // Terms validation
      if (!termsInput.checked) {
        termsError.textContent = 'საჭიროა წესებზე და პირობებზე დათანხმება';
        isValid = false;
      }

      if (!isValid) return;

      // Simulate sending with loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';

        showToast('თქვენი შეტყობინება წარმატებით გაიგზავნა! გუნდი დაგიკავშირდებათ 2 საათში.', 'success', 5000);
      }, 1300);
    });
  }

  /* --------------------------------------------------------------------------
     11. Newsletter Form
     -------------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterMsg = document.getElementById('newsletter-msg');

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      if (!isValidEmail(email)) {
        if (newsletterMsg) {
          newsletterMsg.style.color = '#ef4444';
          newsletterMsg.textContent = 'არასწორი ელ-ფოსტის ფორმატი';
        }
        return;
      }

      if (newsletterMsg) {
        newsletterMsg.style.color = 'var(--accent-green)';
        newsletterMsg.textContent = '✓ წარმატებით გამოიწერეთ!';
      }
      newsletterEmail.value = '';
      showToast('მადლობა სიახლეების გამოწერისთვის!', 'success', 3500);

      setTimeout(() => {
        if (newsletterMsg) newsletterMsg.textContent = '';
      }, 5000);
    });
  }

  /* --------------------------------------------------------------------------
     12. Feature Cards "Learn More" Interaction
     -------------------------------------------------------------------------- */
  const featureBtns = document.querySelectorAll('.card-learn-more');
  featureBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.feature-card');
      const title = card ? card.querySelector('.card-title').textContent : 'შესაძლებლობა';
      showToast(`არჩეულია: „${title}“. დეტალებისთვის დაგვიკავშირდით კონტაქტის ფორმით.`, 'info', 4000);
    });
  });

  /* --------------------------------------------------------------------------
     13. Toast Notification Utility
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, duration);
  }

});
