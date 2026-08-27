const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navigation-indicator-container a");
let isScrolling = false;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Skip observer updates while smooth scrolling
      if (isScrolling) return;

      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach((link) => link.classList.remove("active"));

        // Find and highlight the matching link by href
        const targetId = entry.target.id;
        const activeLink = document.querySelector(
          `.navigation-indicator-container a[href="#${targetId}"]`,
        );

        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  {
    threshold: 0,
    rootMargin: "0px 0px -50% 0px", // Triggers when top half of viewport reaches section
  },
);

sections.forEach((section) => observer.observe(section));

// Add click handler for immediate active state
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    isScrolling = true;
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    // Re-enable observer after scroll completes (adjust timing as needed)
    setTimeout(() => {
      isScrolling = false;
    }, 1000); // 1 second should cover most smooth scrolls
  });
});
