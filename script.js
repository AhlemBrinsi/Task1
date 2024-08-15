document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('nav');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Function to handle navigation clicks
    function handleNavClick(event) {
        const href = event.target.getAttribute('href');

        if (href.startsWith("#")) {
            // Allow default behavior for in-page links
            return;
        }

        event.preventDefault(); // Prevent default anchor behavior for external links
        updateContent(href);
    }

    // Function to update content based on the clicked link
    async function updateContent(href) {
        try {
            const response = await fetch(href);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const content = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const newContent = doc.querySelector('section').innerHTML;
            const newCssLink = doc.querySelector('link[rel="stylesheet"]').getAttribute('href');

            // Update the main content
            const mainContent = document.querySelector('section');
            mainContent.innerHTML = newContent;

            // Update CSS dynamically
            const head = document.querySelector('head');
            const existingDynamicCssLinks = head.querySelectorAll('link[data-dynamic="true"]');
            existingDynamicCssLinks.forEach(link => link.remove());

            const newLinkElement = document.createElement('link');
            newLinkElement.rel = 'stylesheet';
            newLinkElement.href = newCssLink;
            newLinkElement.setAttribute('data-dynamic', 'true');
            head.appendChild(newLinkElement);
        } catch (error) {
            console.error('Error loading the content:', error);
            mainContent.innerHTML = '<h1>Content could not be loaded.</h1>';
        }
    }

    // Add event listeners to navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
});
