// ============================================
// CREATIVE'S DEN - INTERACTIVE FEATURES
// ============================================

// Hero Video Optimization
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Optimize video loading
        heroVideo.addEventListener('loadedmetadata', function() {
            // Video metadata loaded, can now play
            this.play().catch(function(error) {
                // Auto-play was prevented, which is fine
                console.log('Video autoplay prevented:', error);
            });
        });

        // Handle video errors gracefully
        heroVideo.addEventListener('error', function() {
            // Fallback to poster image if video fails to load
            this.style.display = 'none';
            const heroSection = this.closest('.hero');
            if (heroSection) {
                heroSection.style.backgroundImage = 'url(' + this.poster + ')';
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center';
            }
        });

        // Pause video when page is not visible (save resources)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                heroVideo.pause();
            } else {
                heroVideo.play().catch(function(error) {
                    // Auto-play was prevented
                    console.log('Video play prevented:', error);
                });
            }
        });

        // For mobile devices, consider pausing to save bandwidth
        // Video will still show poster image
        if (window.innerWidth <= 768) {
            // On mobile, we can choose to pause after a few seconds or keep it playing
            // For now, let it play but with lower priority
            heroVideo.setAttribute('playsinline', 'true');
        }
    }
});

// Custom Cursor
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.getElementById('customCursor');
    const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!supportsCustomCursor) {
        if (cursor) cursor.style.display = 'none';
        return;
    }

    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .nav-link, .btn, input, textarea, select, .portfolio-item, video');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    function toggleMenu() {
        if (window.innerWidth <= 768) {
            const isActive = navMenu.classList.contains('active');
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (isActive) {
                body.classList.remove('menu-open');
            } else {
                body.classList.add('menu-open');
            }
        }
    }

    function closeMenu() {
        if (window.innerWidth <= 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                closeMenu();
            }
        }
    });

    // Close menu on window resize if it becomes desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Navbar scroll effect - floating menu
    const navbar = document.getElementById('navbar');
    let ticking = false;

    function updateNavbar() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Portfolio Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    // Add fade-in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize all items as visible
    portfolioItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
    });
});

// Portfolio Modal/Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    if (!modal) return;

    document.addEventListener('click', function(e) {
        const item = e.target.closest('.portfolio-item');
        if (!item) return;

        const img = item.querySelector('img');
        const video = item.querySelector('video');
        const overlay = item.querySelector('.portfolio-overlay');
        const title = overlay ? overlay.querySelector('h3')?.textContent : '';
        const description = overlay ? overlay.querySelector('p')?.textContent : '';

        if (video) {
            // Handle video
            modalImage.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideo.src = video.querySelector('source').src;
            modalVideo.load();
            modalVideo.play();
        } else if (img) {
            // Handle image
            modalVideo.style.display = 'none';
            modalImage.style.display = 'block';
            modalImage.src = img.src;
            modalImage.alt = img.alt;
        }

        if (modalTitle) modalTitle.textContent = title || '';
        if (modalDescription) modalDescription.textContent = description || '';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// Video Play/Pause for Portfolio Items
document.addEventListener('DOMContentLoaded', function() {
    const videoItems = document.querySelectorAll('.video-item video');
    // Video play/pause toggle functionality
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoItem = this.closest('.video-item');
            const video = videoItem.querySelector('video');
            
            if (video.paused) {
                video.play();
                this.textContent = '❚❚';
            } else {
                video.pause();
                this.textContent = '▶';
            }
        });
    });

    videoItems.forEach(video => {
        const playBtn = video.closest('.portfolio-item').querySelector('.play-btn');
        
        // Ensure video doesn't autoplay
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'metadata');
        
        video.addEventListener('play', function() {
            if (playBtn) playBtn.textContent = '❚❚';
        });

        video.addEventListener('pause', function() {
            if (playBtn) playBtn.textContent = '▶';
        });

        // Play only once - when video ends, reset to beginning
        video.addEventListener('ended', function() {
            this.pause();
            this.currentTime = 0;
            if (playBtn) playBtn.textContent = '▶';
        });

        // Prevent autoplay on hover
        video.addEventListener('mouseenter', function() {
            // Don't pause if user clicked to play
        });
    });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (new URLSearchParams(window.location.search).get('submitted') === 'true') {
        showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message || !data.service) {
                e.preventDefault();
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                e.preventDefault();
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            if (contactForm.action.includes('formsubmit.co')) {
                return;
            }

            e.preventDefault();
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();

            // In a real implementation, you would send this data to a server
            console.log('Form data:', data);
            
            // Example: Send to a form handler endpoint
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(result => {
            //     showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            //     contactForm.reset();
            // })
            // .catch(error => {
            //     showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            // });
        });
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';

            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Lazy Loading for Images (if not using native lazy loading)
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Add loading state to buttons on form submission
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Re-enable after a delay (in real implementation, do this after response)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }, 3000);
            }
        });
    });
});

// Add scroll animations (simple fade-in on scroll)
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.service-card, .work-item, .feature, .experience-card, .process-step, .why-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Performance: Preload critical resources
document.addEventListener('DOMContentLoaded', function() {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    // Fonts are loaded via Google Fonts, so this is handled by the stylesheet
    
    // Preconnect to external resources if needed
    // Add any external API connections here
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23f0f0f0" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
            this.alt = 'Image not available';
        });
    });
});

// Carousel functionality for About page
document.addEventListener('DOMContentLoaded', function() {
    function initCarousel(carouselSelector, dotsContainerId) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const items = track.querySelectorAll('.experience-card, .client-item, .process-step');
        const prevBtn = carousel.closest('.carousel-wrapper').querySelector('.carousel-prev');
        const nextBtn = carousel.closest('.carousel-wrapper').querySelector('.carousel-next');
        const dotsContainer = document.getElementById(dotsContainerId);

        if (items.length === 0) return;

        let currentIndex = 0;
        let itemsPerView = 3;
        let totalSlides = items.length;

        function calculateItemsPerView() {
            itemsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
        }

        items.forEach(item => {
            track.appendChild(item.cloneNode(true));
        });

        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel(smooth = true) {
            calculateItemsPerView();
            const itemWidth = 100 / itemsPerView;
            const gapPercent = track.offsetWidth > 0 ? (20 / track.offsetWidth) * 100 : 0;
            const translateX = -(currentIndex * (itemWidth + gapPercent));

            track.style.transition = smooth ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === (currentIndex % totalSlides));
                });
            }

            if (prevBtn) prevBtn.style.opacity = '1';
            if (nextBtn) nextBtn.style.opacity = '1';

            if (currentIndex >= totalSlides) {
                track.addEventListener('transitionend', function resetToStart(event) {
                    if (event.propertyName !== 'transform') return;
                    track.removeEventListener('transitionend', resetToStart);
                    currentIndex = 0;
                    updateCarousel(false);
                });
            }
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            updateCarousel();
        }

        function nextSlide() {
            currentIndex++;
            updateCarousel();
        }

        function prevSlide() {
            if (currentIndex <= 0) {
                currentIndex = totalSlides - 1;
                updateCarousel(false);
            } else {
                currentIndex--;
                updateCarousel();
            }
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                currentIndex = 0;
                calculateItemsPerView();
                updateCarousel(false);
            }, 250);
        });

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        });

        // Initialize
        calculateItemsPerView();
        updateCarousel(false);
    }

    // Initialize carousels
    initCarousel('.experience-carousel', 'experienceDots');
    initCarousel('.clients-carousel', 'clientsDots');
    initCarousel('.process-carousel', 'processDots');

    // Portfolio carousels with infinite loop
    function initPortfolioCarousel(carouselSelector, dotsContainerId) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const items = track.querySelectorAll('.portfolio-item');
        const prevBtn = carousel.closest('.carousel-wrapper').querySelector('.carousel-prev');
        const nextBtn = carousel.closest('.carousel-wrapper').querySelector('.carousel-next');
        const dotsContainer = document.getElementById(dotsContainerId);

        if (items.length === 0) return;

        let currentIndex = 0;
        let itemsPerView = 3;
        let totalSlides = 0;

        function calculateItemsPerView() {
            if (window.innerWidth <= 768) {
                itemsPerView = 1;
            } else {
                itemsPerView = 2; // Changed from 3 to 2 for bigger squares
            }
            totalSlides = items.length;
        }

        // Clone items for infinite loop
        function cloneItems() {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });
        }

        cloneItems();

        // Create dots
        function createDots() {
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
            }
        }

        function updateCarousel(smooth = true) {
            calculateItemsPerView();
            const itemWidth = 100 / itemsPerView;
            const itemStyles = window.getComputedStyle(items[0]);
            const itemGap = parseFloat(itemStyles.marginLeft) + parseFloat(itemStyles.marginRight);
            const gapPercent = track.offsetWidth > 0 ? (itemGap / track.offsetWidth) * 100 : 0;
            const translateX = -(currentIndex * (itemWidth + gapPercent));
            
            if (smooth) {
                track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === (currentIndex % totalSlides));
                });
            }

            // Seamless infinite loop
            if (currentIndex >= totalSlides) {
                track.addEventListener('transitionend', function resetToStart(event) {
                    if (event.propertyName !== 'transform') return;
                    track.removeEventListener('transitionend', resetToStart);
                    currentIndex = 0;
                    updateCarousel(false);
                });
            } else if (currentIndex < 0) {
                currentIndex = totalSlides - 1;
                updateCarousel(false);
            }
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            updateCarousel();
        }

        function nextSlide() {
            currentIndex++;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex--;
            updateCarousel();
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                currentIndex = 0;
                calculateItemsPerView();
                createDots();
                updateCarousel();
            }, 250);
        });

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        });

        // Initialize
        calculateItemsPerView();
        createDots();
        updateCarousel();
    }

    // Initialize the single combined portfolio carousel.
    initPortfolioCarousel('.portfolio-carousel[data-category="all"]', 'portfolioDots');

    // Galaxy click effect for buttons
    function initGalaxyClickEffect() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn, a.btn, button.btn');
        console.log('Initializing galaxy click effect, found buttons:', buttons.length);
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const rect = this.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                // Create or reuse effect element
                let effect = document.querySelector('.galaxy-click-effect');
                if (!effect) {
                    effect = document.createElement('div');
                    effect.className = 'galaxy-click-effect';
                    document.body.appendChild(effect);
                }
                
                // Reset and position
                effect.style.left = x + 'px';
                effect.style.top = y + 'px';
                effect.style.width = '0px';
                effect.style.height = '0px';
                effect.style.opacity = '0';
                effect.style.transform = 'translate(-50%, -50%)';
                effect.classList.remove('active');
                
                // Force reflow
                void effect.offsetWidth;
                
                // Trigger animation
                setTimeout(() => {
                    effect.classList.add('active');
                }, 10);
                
                // Remove after animation
                setTimeout(() => {
                    effect.classList.remove('active');
                    setTimeout(() => {
                        effect.style.width = '0px';
                        effect.style.height = '0px';
                        effect.style.opacity = '0';
                    }, 450);
                }, 450);
            });
        });
    }
    
    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalaxyClickEffect);
    } else {
        initGalaxyClickEffect();
    }

    // Control 7-second video clip for videography section
    const serviceVideo = document.querySelector('.service-video');
    if (serviceVideo) {
        serviceVideo.addEventListener('loadedmetadata', () => {
            // Set the video to loop from 0 to 7 seconds
            serviceVideo.addEventListener('timeupdate', () => {
                if (serviceVideo.currentTime >= 7) {
                    serviceVideo.currentTime = 0;
                }
            });
        });
    }

    // Remote Blob videos already use explicit poster images.
    // Avoid canvas frame extraction because cross-origin videos can taint the canvas.
});
