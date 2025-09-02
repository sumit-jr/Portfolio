/* Theme toggle + persistence */
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");

  // Respect OS preference on first visit
  if (!saved) {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) root.classList.add("light");
  } else if (saved === "light") {
    root.classList.add("light");
  }

  const toggle = document.getElementById("themeToggle");
  toggle?.addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
  });
})();


/* Footer year */
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* Fade-in on scroll (respects reduced motion) */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.animate(
          [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 400, easing: "ease-out", fill: "forwards" }
        );
        observer.unobserve(e.target);
      });
    },
    { rootMargin: "-50px 0px -20% 0px", threshold: 0.01 }
  );

  document.querySelectorAll(".card, .section h2, .lead").forEach((el) => observer.observe(el));
})();

/* Publications: show DOI inline if present */
(function () {
  const doiLink = document.querySelector(".doi");
  const doiDisplay = document.getElementById("doiDisplay");
  if (doiLink && doiDisplay) {
    const doi = doiLink.getAttribute("data-doi");
    if (doi && !/xxxx/i.test(doi)) {
      doiDisplay.textContent = `(DOI: ${doi})`;
    }
  }
})();
