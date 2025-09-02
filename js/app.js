/* ==============================================================
   Theme toggle + persistence
   ============================================================== */
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");

  if (!saved) {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) root.classList.add("light");
  } else if (saved === "light") {
    root.classList.add("light");
  }

  const toggle = document.getElementById("themeToggle");
  toggle?.addEventListener("click", () => {
    const isLight = root.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
})();

/* ==============================================================
   Footer year
   ============================================================== */
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ==============================================================
   Fade-in on scroll (respects reduced motion)
   ============================================================== */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.animate(
          [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 400, easing: "ease-out", fill: "forwards" }
        );
        obs.unobserve(e.target);
      }
    },
    { rootMargin: "-50px 0px -20% 0px", threshold: 0.01 }
  );

  document.querySelectorAll(".card, .section h2, .lead").forEach((el) => observer.observe(el));
})();

/* ==============================================================
   Publications: show DOI inline if present
   ============================================================== */
(function () {
  const doiLink = document.querySelector(".doi");
  const doiDisplay = document.getElementById("doiDisplay");
  if (doiLink && doiDisplay) {
    const doi = doiLink.getAttribute("data-doi");
    if (doi && !/xxxx/i.test(doi)) doiDisplay.textContent = `(DOI: ${doi})`;
  }
})();

/* ==============================================================
   Nav: set aria-current on active section link
   ============================================================== */
(function () {
  const nav = document.getElementById("primaryNav");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a[href^='#']"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function setActiveById(id) {
    for (const a of links) {
      const match = a.getAttribute("href") === `#${id}`;
      a.toggleAttribute("aria-current", match);
      a.classList.toggle("active", match);
    }
  }

  const onScroll = () => {
    let current = null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 96 && rect.bottom >= 96) {
        current = sec.id;
        break;
      }
    }
    if (current) setActiveById(current);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (id) setActiveById(id);
  });
  onScroll();
})();
