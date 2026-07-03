
document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER SCROLL EFFECT
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. MOBILE NAVIGATION MENU
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      navMenu.classList.remove('open');
      
      // Update active nav link representation
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 3. 3D VISUALIZER LOGIC
  const visualizerModel = document.getElementById('visualizer-model');
  const modelDoor = document.getElementById('model-door');
  const modelWindow = document.getElementById('model-window');
  
  const doorSash = document.getElementById('door-sash');
  const windowPaneLeft = document.getElementById('window-pane-left');
  
  const btnSelectDoor = document.getElementById('btn-select-door');
  const btnSelectWindow = document.getElementById('btn-select-window');
  
  const btnToggleOpen = document.getElementById('btn-toggle-open');
  const openText = document.getElementById('open-text');
  const btnRotateView = document.getElementById('btn-rotate-view');
  
  const colorDots = document.querySelectorAll('.color-dot');
  const glassBtns = document.querySelectorAll('.glass-btn');

  let currentProduct = 'door'; // 'door' or 'window'
  let isModelOpened = false;
  let isOrbiting = false;
  let currentThemeColor = 'charcoal';
  let currentGlassType = 'clear';

  // Helper to sync open state and button labels
  function syncOpenState() {
    if (currentProduct === 'door') {
      if (isModelOpened) {
        doorSash.classList.add('opened');
        openText.textContent = 'Close Sash';
        btnToggleOpen.classList.add('active');
      } else {
        doorSash.classList.remove('opened');
        openText.textContent = 'Open Sash';
        btnToggleOpen.classList.remove('active');
      }
    } else if (currentProduct === 'window') {
      if (isModelOpened) {
        windowPaneLeft.classList.add('opened');
        openText.textContent = 'Slide Close';
        btnToggleOpen.classList.add('active');
      } else {
        windowPaneLeft.classList.remove('opened');
        openText.textContent = 'Slide Open';
        btnToggleOpen.classList.remove('active');
      }
    }
  }

  // Set default model attributes
  visualizerModel.setAttribute('data-theme-color', currentThemeColor);
  visualizerModel.setAttribute('data-glass-type', currentGlassType);

  // Switch between Door and Window models
  btnSelectDoor.addEventListener('click', () => {
    if (currentProduct === 'door') return;
    currentProduct = 'door';
    
    btnSelectDoor.classList.add('active');
    btnSelectWindow.classList.remove('active');
    
    modelDoor.classList.add('active');
    modelWindow.classList.remove('active');
    
    // reset open state
    isModelOpened = false;
    syncOpenState();
  });

  btnSelectWindow.addEventListener('click', () => {
    if (currentProduct === 'window') return;
    currentProduct = 'window';
    
    btnSelectWindow.classList.add('active');
    btnSelectDoor.classList.remove('active');
    
    modelWindow.classList.add('active');
    modelDoor.classList.remove('active');
    
    // reset open state
    isModelOpened = false;
    syncOpenState();
  });

  // Toggle open/close interaction
  btnToggleOpen.addEventListener('click', () => {
    isModelOpened = !isModelOpened;
    syncOpenState();
  });

  // Toggle Auto-Orbit 3D rotate
  btnRotateView.addEventListener('click', () => {
    isOrbiting = !isOrbiting;
    if (isOrbiting) {
      visualizerModel.classList.add('rotating');
      btnRotateView.classList.add('active');
      btnRotateView.querySelector('span').textContent = 'Stop Orbit';
    } else {
      visualizerModel.classList.remove('rotating');
      btnRotateView.classList.remove('active');
      btnRotateView.querySelector('span').textContent = 'Orbit 3D (Auto)';
    }
  });

  // Handle color dot updates
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      currentThemeColor = dot.getAttribute('data-color');
      visualizerModel.setAttribute('data-theme-color', currentThemeColor);
    });
  });

  // Handle glass button updates
  glassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      glassBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentGlassType = btn.getAttribute('data-glass');
      visualizerModel.setAttribute('data-glass-type', currentGlassType);
    });
  });

  // 4. PROGRESSIVE ENHANCEMENT SCROLL ANIMATIONS FALLBACK
  // Check if CSS Scroll-driven animations are supported
  const isScrollTimelineSupported = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!isScrollTimelineSupported) {
    const animatedElements = document.querySelectorAll('.animate-scroll');
    
    // Apply JS fade-in transition preparations
    animatedElements.forEach(el => {
      el.classList.add('js-fade-in');
    });

    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      scrollObserver.observe(el);
    });
  }

  // 5. INQUIRY FORM SUBMISSION & WHATSAPP REDIRECT
  const inquiryForm = document.getElementById('project-inquiry-form');
  const formStatus = document.getElementById('form-status');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get Form Details
      const name = document.getElementById('client-name').value;
      const phone = document.getElementById('client-phone').value;
      const city = document.getElementById('client-city').value;
      const system = document.getElementById('client-system').value;
      const message = document.getElementById('client-message').value;
      
      // Update button state
      const submitBtn = inquiryForm.querySelector('.btn-submit');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing Inquiry...</span>`;

      // Simulate API submit latency
      setTimeout(() => {
        submitBtn.innerHTML = `<span>Redirecting...</span>`;
        formStatus.textContent = 'Inquiry logged! Opening WhatsApp Business to chat with our uPVC specialist directly...';
        formStatus.className = 'form-status success';
        
        // Generate WhatsApp business text message
        const waText = `Hello Trinath Enterprises,%0A%0A` +
          `I would like to schedule a free site inspection for a premium uPVC system quote.%0A%0A` +
          `*Project Details:*%0A` +
          `- *Name:* ${encodeURIComponent(name)}%0A` +
          `- *Phone:* ${encodeURIComponent(phone)}%0A` +
          `- *Location in Odisha:* ${encodeURIComponent(city)}%0A` +
          `- *Preferred uPVC System:* ${encodeURIComponent(system)}%0A` +
          `- *Remarks:* ${encodeURIComponent(message || 'No additional remarks.')}%0A%0A` +
          `Please contact me to coordinate a measurement date.`;
        
        const waUrl = `https://wa.me/917008859673?text=${waText}`;
        
        // Redirect to WhatsApp Business
        setTimeout(() => {
          window.open(waUrl, '_blank');
          inquiryForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          formStatus.style.display = 'none';
        }, 1500);

      }, 1000);
    });
  }

  // 6. CITY PIN HINTS
  const mapPins = document.querySelectorAll('.map-pin');
  mapPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const cityName = pin.getAttribute('data-city');
      const citySelect = document.getElementById('client-city');
      if (citySelect) {
        citySelect.value = cityName;
        // Scroll to form smooth
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        
        // Flashing animation on city select block
        citySelect.style.borderColor = 'var(--accent)';
        setTimeout(() => {
          citySelect.style.borderColor = '';
        }, 2000);
      }
    });
  });
});
