document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");
  const dotsContainer = document.getElementById("dots");
  const cards = slider.querySelectorAll(".container");
  const totalSlides = cards.length;

  // selectors to auto-animate
  const selectors = [
    '.showcase .show-img img',
    '.showcase .show-text > *',
    '.about img',
    '.about .about-info > *',
    '.service-containers .container',
    '.projects-grid .project-card',
    '.contact .contact-head > *',
    'footer'
  ];

  // Add .animate to matched elements
  selectors.forEach(sel => {
    const nodes = Array.from(document.querySelectorAll(sel));
    nodes.forEach((el, idx) => {
      // Add animate class
      el.classList.add('animate');

      // apply sensible staggered delay for groups
      if (sel === '.showcase .show-text > *') {
        el.style.transitionDelay = `${idx * 120}ms`;
      } else if (sel === '.service-containers .container') {
        el.style.transitionDelay = `${(idx % 6) * 100}ms`; // repeatable small stagger
      } else if (sel === '.projects-grid .project-card') {
        el.style.transitionDelay = `${idx * 110}ms`;
      } else {
        // small default delay for other single items
        el.style.transitionDelay = '0ms';
      }
    });
  });

  // IntersectionObserver for reveal
  const ioOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // if you want reveal to happen only once, unobserve after show
        observer.unobserve(entry.target);
      }
    });
  }, ioOptions);

  // Observe all .animate targets
  const animatedTargets = document.querySelectorAll('.animate');
  animatedTargets.forEach(el => io.observe(el));

  /* ---- optional: menu toggle helper ---- */
  const menuWindow = document.querySelector('.menu-dropdown');
const menuClose = document.querySelector('.menu-close');
const menuIcon = document.getElementById('menu-icon');

menuIcon.addEventListener('click', () => {
    menuWindow.style.display = 'flex';
    menuIcon.style.display = 'none';
    menuClose.style.display = 'flex';
});

menuClose.addEventListener('click', () => {
    menuWindow.style.display = 'none';
    menuIcon.style.display = 'flex';
    menuClose.style.display = 'none';
});

  // Close menu when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (!menuWindow) return;
    if (menuWindow.style.display !== 'flex') return;
    if (e.target.closest('.menu-dropdown') || e.target.closest('#menu-icon')) return;
    menuWindow.style.display = 'none';
    menuClose.style.display = 'none';
    menuIcon.style.display = 'flex';
  });

  // Optional: cleanup on resize if desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && menuWindow) {
      menuWindow.style.display = '';
    }
  });



// Select the dark mode toggle icon
const darkModeToggle = document.querySelector('.material-symbols-outlined');

// Listen for click event on the toggle
darkModeToggle.addEventListener('click', () => {
    // Toggle dark theme class on body
    document.body.classList.toggle('dark-theme');

    // Change icon text based on mode
    if (document.body.classList.contains('dark-theme')) {
        darkModeToggle.textContent = 'light_mode'; // switch to sun icon
        localStorage.setItem('theme', 'dark'); // save preference
    } else {
        darkModeToggle.textContent = 'dark_mode'; // switch to moon icon
        localStorage.setItem('theme', 'light'); // save preference
    }
});

// Keep saved preference after page reload
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        darkModeToggle.textContent = 'light_mode';
    }
});







  let visibleSlides = () => {
    if (window.innerWidth <= 500) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
  };

  let currentSlide = 0;
  let autoplayInterval;

  function updateSlider() {
    const slideWidth = cards[0].offsetWidth + 20; // 20 is gap
    slider.scrollLeft = currentSlide * slideWidth;
    updateDots();
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll("span");
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add("active");
    }
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    const count = Math.ceil(totalSlides - visibleSlides() + 1);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentSlide = i;
        updateSlider();
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function autoplay() {
    autoplayInterval = setInterval(() => {
      currentSlide++;
      if (currentSlide > totalSlides - visibleSlides()) currentSlide = 0;
      updateSlider();
    }, 4000); // change every 4 seconds
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplay();
  }

  function enableSwipe() {
    let startX;

    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSlide < totalSlides - visibleSlides()) {
          currentSlide++;
        } else if (diff < 0 && currentSlide > 0) {
          currentSlide--;
        }
        updateSlider();
        resetAutoplay();
      }
    });
  }

  createDots();
  updateSlider();
  autoplay();
  enableSwipe();

  window.addEventListener("resize", () => {
    createDots();
    updateSlider();
  });
});
