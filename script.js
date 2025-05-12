/**
 * Energy Management Website - Interactive Script
 * 
 * Key Features:
 * - Mobile-responsive navigation
 * - Smooth scrolling
 * - Interactive checklist functionality
 * - Energy tracking system
 * - Sticky header with active state
 * - Back to top button
 * - Timeline animation
 */

class EnergyManagementApp {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initMobileNav();
      this.initSmoothScroll();
      this.initInteractiveChecklist();
      this.initEnergyTracker();
      this.initStickyHeader();
      this.initBackToTop();
      this.initTimelineAnimation();
      this.improveAccessibility();
      this.detectAndApplyUserPreferences();
    });
  }

  // Mobile Navigation
  initMobileNav() {
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    if (!nav || !navUl) return;

    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Toggle Navigation Menu');

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    nav.prepend(menuToggle);
    nav.classList.add('sticky-nav');

    const toggleMenu = (isOpen) => {
      navUl.classList.toggle('active', isOpen);
      overlay.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu(navUl.classList.contains('active') ? false : true));
    overlay.addEventListener('click', () => toggleMenu(false));

    navUl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // Smooth Scrolling
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const headerOffset = document.querySelector('.sticky-nav')?.offsetHeight || 0;

        if (targetId === '#' || targetId === '#top') {
          return window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - headerOffset - 20,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Interactive Checklist
  initInteractiveChecklist() {
    const checklistItems = document.querySelectorAll('.checklist li');
    if (!checklistItems.length) return;

    const saveChecklistState = () => {
      const checkedItems = Array.from(checklistItems)
        .reduce((acc, item, index) => {
          if (item.classList.contains('checked')) acc.push(index);
          return acc;
        }, []);
      localStorage.setItem('energyChecklist', JSON.stringify(checkedItems));
    };

    const loadChecklistState = () => {
      try {
        const savedState = localStorage.getItem('energyChecklist');
        if (savedState) {
          JSON.parse(savedState).forEach(index => checklistItems[index]?.classList.add('checked'));
        }
      } catch (e) {
        console.error('Error loading checklist state:', e);
      }
    };

    checklistItems.forEach(item => {
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', () => {
        item.classList.toggle('checked');
        saveChecklistState();
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.toggle('checked');
          saveChecklistState();
        }
      });
    });

    loadChecklistState();
  }

  // Energy Tracker
  initEnergyTracker() {
    const managementSection = document.getElementById('management-systems');
    if (!managementSection) return;

    const createTrackerUI = () => {
      const trackerSection = document.createElement('div');
      trackerSection.className = 'highlight-box';
      trackerSection.innerHTML = `
        <h3 class="highlight-title">Дневно Проследяване на Енергията</h3>
        <div class="energy-tracker">
          ${['morning', 'afternoon', 'evening']
            .map((time, index) => `
              <div class="tracker-row">
                <div class="tracker-label">${
                  ['Сутрин (12:30)', 'Следобед (17:00)', 'Вечер (21:00)'][index]
                }</div>
                <div class="tracker-scale" data-time="${time}">
                  ${[1, 2, 3, 4, 5].map(val => `
                    <button class="energy-level" data-value="${val}">${val}</button>
                  `).join('')}
                </div>
              </div>
            `).join('')}
        </div>
        <div class="tracker-summary">
          <p>Днешна средна енергия: <span id="energy-average">-</span></p>
        </div>
      `;

      const trackerStyle = document.createElement('style');
      trackerStyle.textContent = `
        .energy-tracker { margin-top: 1.5rem; }
        .tracker-row { display: flex; align-items: center; margin-bottom: 1rem; }
        .tracker-label { min-width: 120px; font-weight: 500; }
        .tracker-scale { display: flex; gap: 0.5rem; }
        .energy-level {
          width: 2.5rem; height: 2.5rem; border-radius: 50%;
          border: 2px solid var(--primary); background: rgba(255,255,255,0.8);
          color: var(--primary); font-weight: 600; cursor: pointer;
          transition: all 0.2s ease;
        }
        .energy-level:hover { transform: scale(1.1); }
        .energy-level.active { background: var(--primary); color: white; }
        .tracker-summary {
          margin-top: 1.5rem; padding-top: 1rem;
          border-top: 1px dashed var(--border); font-weight: 500; text-align: center;
        }
        #energy-average { font-weight: 600; color: var(--primary-dark); }
      `;
      document.head.appendChild(trackerStyle);
      managementSection.appendChild(trackerSection);
    };

    const saveEnergyData = (time, value) => {
      const today = new Date().toISOString().split('T')[0];
      const energyData = JSON.parse(localStorage.getItem('energyData') || '{}');
      energyData[today] = energyData[today] || {};
      energyData[today][time] = value;
      localStorage.setItem('energyData', JSON.stringify(energyData));
    };

    const loadEnergyData = () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const energyData = JSON.parse(localStorage.getItem('energyData') || '{}');
        if (energyData[today]) {
          Object.entries(energyData[today]).forEach(([time, value]) => {
            const button = document.querySelector(`.tracker-scale[data-time="${time}"] .energy-level[data-value="${value}"]`);
            button?.classList.add('active');
          });
          this.updateEnergyAverage();
        }
      } catch (e) {
        console.error('Error loading energy data:', e);
      }
    };

    createTrackerUI();
    document.querySelectorAll('.energy-level').forEach(button => {
      button.addEventListener('click', () => {
        const time = button.parentElement.dataset.time;
        const value = parseInt(button.dataset.value);
        button.parentElement.querySelectorAll('.energy-level').forEach(sib => sib.classList.remove('active'));
        button.classList.add('active');
        saveEnergyData(time, value);
        this.updateEnergyAverage();
      });
    });

    loadEnergyData();
  }

  updateEnergyAverage() {
    const today = new Date().toISOString().split('T')[0];
    const energyData = JSON.parse(localStorage.getItem('energyData') || '{}');
    const avgElement = document.getElementById('energy-average');

    if (energyData[today] && avgElement) {
      const values = Object.values(energyData[today]);
      if (values.length) {
        const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
        avgElement.textContent = avg;
      }
    }
  }

  // Sticky Header
  initStickyHeader() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
    const backToTopButton = document.querySelector('.top-button');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop && scrollY < sectionTop + section.clientHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });

      if (backToTopButton) {
        const isVisible = window.scrollY > 300;
        backToTopButton.style.opacity = isVisible ? '1' : '0';
        backToTopButton.style.pointerEvents = isVisible ? 'auto' : 'none';
      }
    });
  }

  // Back to Top Button
  initBackToTop() {
    const backToTopButton = document.querySelector('.top-button');
    if (!backToTopButton) return;

    backToTopButton.style.opacity = '0';
    backToTopButton.style.pointerEvents = 'none';
    backToTopButton.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Timeline Animation
  initTimelineAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
      .timeline-item, .card {
        opacity: 0; transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .timeline-item.animate-in, .card.animate-in {
        opacity: 1; transform: translateY(0);
      }
      ${[1, 2, 3, 4, 5].map(i => `
        .timeline-item:nth-child(${i}) { transition-delay: ${i * 0.1}s; }
      `).join('')}
    `;
    document.head.appendChild(animationStyle);

    document.querySelectorAll('.timeline-item, .card').forEach(item => observer.observe(item));
  }

  // Accessibility Improvements
  improveAccessibility() {
    document.querySelectorAll('.food-item, .card, .protocol-steps li').forEach(item => {
      if (!item.getAttribute('tabindex')) {
        item.setAttribute('tabindex', '0');
      }
    });
  }

  // User Preferences
  detectAndApplyUserPreferences() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = document.createElement('style');
      style.textContent = `* { transition-duration: 0.1s !important; animation-duration: 0.1s !important; }`;
      document.head.appendChild(style);
    }
  }
}

new EnergyManagementApp();

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .food-item, .checklist li, .image-placeholder, .energy-level').forEach(el => {
        observer.observe(el);
    });
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    // Existing functions: initChecklist, initEnergyTracker, etc.
});