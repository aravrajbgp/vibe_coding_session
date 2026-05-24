/**
 * ARAV RAJ PORTFOLIO INTERACTIVITY SCRIPTS
 * Custom Cursor, Typing Effect, Scroll Reveals, Form Validator
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Custom Mouse Cursor with Spring Lerp
    // ==========================================
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    const lerpSpeed = 0.16; // Adjust for cursor lag fluidity
    let isMoving = false;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements on first motion
        if (!isMoving) {
            dot.style.opacity = '1';
            outline.style.opacity = '1';
            isMoving = true;
        }

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Hide cursors when pointer leaves window viewport
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        outline.style.opacity = '0';
        isMoving = false;
    });

    // Smooth cursor outline trail animation loop
    function animateCursorOutline() {
        if (isMoving) {
            outlineX += (mouseX - outlineX) * lerpSpeed;
            outlineY += (mouseY - outlineY) * lerpSpeed;
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
        }
        requestAnimationFrame(animateCursorOutline);
    }
    animateCursorOutline();

    // Toggle active cursor state using Event Delegation
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        if (
            target.closest('a') || 
            target.closest('button') || 
            target.closest('.cursor-hover') ||
            target.closest('input') || 
            target.closest('textarea') ||
            target.closest('.social-icon')
        ) {
            dot.classList.add('active');
            outline.classList.add('active');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target;
        if (
            target.closest('a') || 
            target.closest('button') || 
            target.closest('.cursor-hover') ||
            target.closest('input') || 
            target.closest('textarea') ||
            target.closest('.social-icon')
        ) {
            dot.classList.remove('active');
            outline.classList.remove('active');
        }
    });

    // ==========================================
    // 2. Animated Typing Effect
    // ==========================================
    const words = [
        "B.Tech CSE Student.",
        "Aspiring Software Developer.",
        "Tech Enthusiast."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById("typed-text");

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        // Word completed
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2200; // Delay when word is fully typed
            isDeleting = true;
        } 
        // Word completely erased
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 600; // Pause before typing next word
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Initialize Typing Effect
    if (typedTextSpan) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================
    // 3. Scroll Progress Indicator & Nav Highlights
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Progress bar width
        if (height > 0) {
            const scrolledPercentage = (winScroll / height) * 100;
            scrollProgress.style.width = scrolledPercentage + '%';
        }

        // Header shadow/blur switch
        if (winScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Section Navigation Link Highlighter
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset header height
            const sectionHeight = section.offsetHeight;
            if (winScroll >= sectionTop && winScroll < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 4. Hamburger Menu Logic
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 5. Scroll Reveal IntersectionObserver
    // ==========================================
    // Stash skill widths to animate them gracefully on intersection
    const skillBars = document.querySelectorAll('.skill-bar-progress');
    skillBars.forEach(bar => {
        const inlineWidth = bar.style.width || '0%';
        bar.setAttribute('data-target-width', inlineWidth);
        bar.style.width = '0%';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px -10px -50px -10px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is a skills container, animate sub skill progress bars
                if (entry.target.classList.contains('skills-category-card')) {
                    const bars = entry.target.querySelectorAll('.skill-bar-progress');
                    bars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-target-width');
                        bar.style.width = targetWidth;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe fade-in animations and reveals
    document.querySelectorAll('.animate-fade').forEach(el => scrollObserver.observe(el));
    document.querySelectorAll('.animate-reveal').forEach(el => scrollObserver.observe(el));
    document.querySelectorAll('.skills-category-card').forEach(el => scrollObserver.observe(el));

    // Force run check in case elements are already in viewport on load
    setTimeout(() => {
        document.querySelectorAll('.hero-section .animate-fade').forEach(el => {
            el.classList.add('active');
        });
    }, 200);

    // ==========================================
    // 6. Contact Form Submission Handling & Toast
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    let toastTimeout;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalHTML = submitBtn.innerHTML;
            
            // Trigger loading animation state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>`;
            
            // Mock API dispatch delay
            setTimeout(() => {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                
                // Reset form inputs
                contactForm.reset();
                
                // Show Custom Toast Alert
                clearTimeout(toastTimeout);
                toast.classList.add('show');
                
                // Hide Toast after 3 seconds matching the CSS progress timer
                toastTimeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }, 1500);
        });
    }

    // ==========================================
    // 7. Back To Top Action
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
