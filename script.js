
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
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Initialize All Components =====
    initMobileNav();
    initSmoothScroll();
    initInteractiveChecklist();
    initEnergyTracker();
    initStickyHeader();
    initBackToTop();
    initTimelineAnimation();

    // ===== Mobile Navigation =====
    function initMobileNav() {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.setAttribute('aria-label', 'Toggle Navigation Menu');

        const navContent = document.createElement('div');
        navContent.className = 'nav-content';

        const nav = document.querySelector('nav');
        const navUl = document.querySelector('nav ul');

        if (nav && navUl) {
            // Wrap existing navigation in our container
            nav.prepend(menuToggle);
            nav.classList.add('sticky-nav');
            
            // Create an overlay for mobile menu
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);

            // Configure menu toggle behavior
            menuToggle.addEventListener('click', function() {
                navUl.classList.toggle('active');
                overlay.classList.toggle('active');
                
                // Improve accessibility
                const isExpanded = navUl.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded);
                
                // Prevent scrolling when menu is open
                document.body.style.overflow = isExpanded ? 'hidden' : '';
            });

            // Close menu when overlay is clicked
            overlay.addEventListener('click', function() {
                navUl.classList.remove('active');
                overlay.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
                document.body.style.overflow = '';
            });
            
            // Close menu when a link is clicked
            const navLinks = navUl.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navUl.classList.remove('active');
                    overlay.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // ===== Smooth Scrolling =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '#top') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calculate offset to account for sticky header
                    const headerOffset = document.querySelector('.sticky-nav')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== Interactive Checklist =====
    function initInteractiveChecklist() {
        const checklistItems = document.querySelectorAll('.checklist li');
        
        checklistItems.forEach(item => {
            // Make checklist items interactive
            item.addEventListener('click', function() {
                this.classList.toggle('checked');
                
                // Save state to localStorage
                saveChecklistState();
            });
            
            // Add keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.classList.toggle('checked');
                    saveChecklistState();
                }
            });
        });
        
        // Load saved state from localStorage
        loadChecklistState();
        
        function saveChecklistState() {
            const checkedItems = [];
            checklistItems.forEach((item, index) => {
                if (item.classList.contains('checked')) {
                    checkedItems.push(index);
                }
            });
            localStorage.setItem('energyChecklist', JSON.stringify(checkedItems));
        }
        
        function loadChecklistState() {
            try {
                const savedState = localStorage.getItem('energyChecklist');
                if (savedState) {
                    const checkedIndexes = JSON.parse(savedState);
                    checkedIndexes.forEach(index => {
                        checklistItems[index]?.classList.add('checked');
                    });
                }
            } catch (e) {
                console.error('Error loading checklist state:', e);
            }
        }
    }

    // ===== Energy Tracker =====
    function initEnergyTracker() {
        // Create energy tracking UI
        createEnergyTracker();
        
        // Load saved energy data
        loadEnergyData();
        
        function createEnergyTracker() {
            // Only add the tracker if the management systems section exists
            const managementSection = document.getElementById('management-systems');
            if (!managementSection) return;
            
            const trackerSection = document.createElement('div');
            trackerSection.className = 'highlight-box';
            trackerSection.innerHTML = `
                <h3 class="highlight-title">Дневно Проследяване на Енергията</h3>
                <div class="energy-tracker">
                    <div class="tracker-row">
                        <div class="tracker-label">Сутрин (12:30)</div>
                        <div class="tracker-scale" data-time="morning">
                            <button class="energy-level" data-value="1">1</button>
                            <button class="energy-level" data-value="2">2</button>
                            <button class="energy-level" data-value="3">3</button>
                            <button class="energy-level" data-value="4">4</button>
                            <button class="energy-level" data-value="5">5</button>
                        </div>
                    </div>
                    <div class="tracker-row">
                        <div class="tracker-label">Следобед (17:00)</div>
                        <div class="tracker-scale" data-time="afternoon">
                            <button class="energy-level" data-value="1">1</button>
                            <button class="energy-level" data-value="2">2</button>
                            <button class="energy-level" data-value="3">3</button>
                            <button class="energy-level" data-value="4">4</button>
                            <button class="energy-level" data-value="5">5</button>
                        </div>
                    </div>
                    <div class="tracker-row">
                        <div class="tracker-label">Вечер (21:00)</div>
                        <div class="tracker-scale" data-time="evening">
                            <button class="energy-level" data-value="1">1</button>
                            <button class="energy-level" data-value="2">2</button>
                            <button class="energy-level" data-value="3">3</button>
                            <button class="energy-level" data-value="4">4</button>
                            <button class="energy-level" data-value="5">5</button>
                        </div>
                    </div>
                </div>
                <div class="tracker-summary">
                    <p>Днешна средна енергия: <span id="energy-average">-</span></p>
                </div>
            `;
            
            // Add custom styles for tracker
            const trackerStyle = document.createElement('style');
            trackerStyle.textContent = `
                .energy-tracker {
                    margin-top: 1.5rem;
                }
                .tracker-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .tracker-label {
                    min-width: 120px;
                    font-weight: 500;
                }
                .tracker-scale {
                    display: flex;
                    gap: 0.5rem;
                }
                .energy-level {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    border: 2px solid var(--primary);
                    background: rgba(255,255,255,0.8);
                    color: var(--primary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .energy-level:hover {
                    transform: scale(1.1);
                }
                .energy-level.active {
                    background: var(--primary);
                    color: white;
                }
                .tracker-summary {
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px dashed var(--border);
                    font-weight: 500;
                    text-align: center;
                }
                #energy-average {
                    font-weight: 600;
                    color: var(--primary-dark);
                }
            `;
            document.head.appendChild(trackerStyle);
            
            // Insert tracker into the management section
            managementSection.appendChild(trackerSection);
            
            // Add event listeners to energy buttons
            document.querySelectorAll('.energy-level').forEach(button => {
                button.addEventListener('click', function() {
                    const time = this.parentElement.dataset.time;
                    const value = parseInt(this.dataset.value);
                    
                    // Remove active class from siblings
                    const siblings = this.parentElement.querySelectorAll('.energy-level');
                    siblings.forEach(sib => sib.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Save energy data
                    saveEnergyData(time, value);
                    updateEnergyAverage();
                });
            });
        }
        
        function saveEnergyData(time, value) {
            // Get current date as key
            const today = new Date().toISOString().split('T')[0];
            
            // Get existing data or initialize new object
            let energyData = JSON.parse(localStorage.getItem('energyData') || '{}');
            
            // Initialize today's data if needed
            if (!energyData[today]) {
                energyData[today] = {};
            }
            
            // Save the value for this time period
            energyData[today][time] = value;
            
            // Save to localStorage
            localStorage.setItem('energyData', JSON.stringify(energyData));
        }
        
        function loadEnergyData() {
            try {
                const today = new Date().toISOString().split('T')[0];
                const energyData = JSON.parse(localStorage.getItem('energyData') || '{}');
                
                // If we have data for today
                if (energyData[today]) {
                    // For each time period, activate the corresponding button
                    Object.entries(energyData[today]).forEach(([time, value]) => {
                        const scale = document.querySelector(`.tracker-scale[data-time="${time}"]`);
                        if (scale) {
                            const button = scale.querySelector(`.energy-level[data-value="${value}"]`);
                            if (button) {
                                button.classList.add('active');
                            }
                        }
                    });
                    
                    // Update average display
                    updateEnergyAverage();
                }
            } catch (e) {
                console.error('Error loading energy data:', e);
            }
        }
        
        function updateEnergyAverage() {
            const today = new Date().toISOString().split('T')[0];
            const energyData = JSON.parse(localStorage.getItem('energyData') || '{}');
            
            if (energyData[today]) {
                const values = Object.values(energyData[today]);
                if (values.length > 0) {
                    const sum = values.reduce((a, b) => a + b, 0);
                    const avg = (sum / values.length).toFixed(1);
                    
                    // Update the average display
                    const avgElement = document.getElementById('energy-average');
                    if (avgElement) {
                        avgElement.textContent = avg;
                    }
                }
            }
        }
    }

    // ===== Sticky Header with Active State =====
    function initStickyHeader() {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelectorAll('nav ul li a');
        const sections = document.querySelectorAll('section');
        
        // On scroll, update active state and handle sticky header
        window.addEventListener('scroll', function() {
            // Update active menu item
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
            // Show/hide back to top button
            const backToTopButton = document.querySelector('.top-button');
            if (backToTopButton) {
                if (window.scrollY > 300) {
                    backToTopButton.style.opacity = '1';
                    backToTopButton.style.pointerEvents = 'auto';
                } else {
                    backToTopButton.style.opacity = '0';
                    backToTopButton.style.pointerEvents = 'none';
                }
            }
        });
    }

    // ===== Back to Top Button =====
    function initBackToTop() {
        const backToTopButton = document.querySelector('.top-button');
        
        if (backToTopButton) {
            // Set initial state
            backToTopButton.style.opacity = '0';
            backToTopButton.style.pointerEvents = 'none';
            backToTopButton.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            // Add click event
            backToTopButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ===== Timeline Animation =====
    function initTimelineAnimation() {
        // Create intersection observer for timeline items
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        // Add animation CSS
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .timeline-item {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .timeline-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .timeline-item:nth-child(1) { transition-delay: 0.1s; }
            .timeline-item:nth-child(2) { transition-delay: 0.2s; }
            .timeline-item:nth-child(3) { transition-delay: 0.3s; }
            .timeline-item:nth-child(4) { transition-delay: 0.4s; }
            .timeline-item:nth-child(5) { transition-delay: 0.5s; }
        `;
        document.head.appendChild(animationStyle);
        
        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
        
        // Create animation for cards too
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            observer.observe(card);
        });
    }

    // ===== Add Keyboard Accessibility =====
    function improveAccessibility() {
        // Add keyboard navigation for interactive elements
        document.querySelectorAll('.food-item, .card, .protocol-steps li').forEach(item => {
            if (!item.getAttribute('tabindex')) {
                item.setAttribute('tabindex', '0');
            }
        });
    }
    improveAccessibility();

    // ===== Detect User Preference =====
    function detectAndApplyUserPreferences() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Apply styles for reduced motion
            const reduceMotionStyle = document.createElement('style');
            reduceMotionStyle.textContent = `
                * {
                    transition-duration: 0.1s !important;
                    animation-duration: 0.1s !important;
                }
            `;
            document.head.appendChild(reduceMotionStyle);
        }
    }
    detectAndApplyUserPreferences();
});
   