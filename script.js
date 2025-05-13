document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Dark mode toggle
    const themeToggle = document.querySelector('.theme-toggle');

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');

        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);

        // Update icon
        themeToggle.innerHTML = isDarkMode ?
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project Filtering Functionality
    function setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.dataset.filter;

                // Filter projects
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.dataset.category === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });

                // Reflow grid after filtering
                setTimeout(() => {
                    const projectGrid = document.querySelector('.project-grid');
                    projectGrid.style.display = 'none';
                    projectGrid.offsetHeight; // Trigger reflow
                    projectGrid.style.display = 'grid';
                }, 300);
            });
        });
    }

    // Make project cards clickable
    function setupProjectCardClicks() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function (e) {
                // Don't navigate if clicking on links inside the card
                if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                    return;
                }

                // Get the first link in the card (assuming it's the demo/case study link)
                const projectLink = this.querySelector('.project-links a');
                if (projectLink) {
                    window.open(projectLink.href, '_blank');
                }
            });
        });
    }

    // Form submission
    document.getElementById("contactForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        fetch("https://formspree.io/f/xrbqywzn", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    alert("Message sent successfully!");
                    document.getElementById("contactForm").reset();
                } else {
                    response.json().then(data => {
                        alert(data?.errors?.[0]?.message || "Failed to send message.");
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("There was an error sending your message.");
            });
    });

    // Animate progress bars on scroll
    const animateOnScroll = function () {
        const progressBars = document.querySelectorAll('.progress');

        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.8);

            if (isVisible && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
                const width = bar.style.width;
                bar.style.width = '0';

                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    };

    // Initialize all functionality
    setupProjectFilters();
    setupProjectCardClicks();

    // Run once on page load
    animateOnScroll();

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
});