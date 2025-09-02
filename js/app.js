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

  function setActiveById(idOrNull) {
    for (const a of links) {
      const match = idOrNull && a.getAttribute("href") === `#${idOrNull}`;
      a.toggleAttribute("aria-current", !!match);
      a.classList.toggle("active", !!match);
    }
  }

  const header = document.querySelector("header");
  const headerH = () => (header ? header.offsetHeight : 80);
  const hero = document.querySelector(".hero");

  const onScroll = () => {
    const anchorY = headerH() + 8; // detection line below header
    // If near the very top (hero in view), clear any active item
    if (window.scrollY < Math.max(40, (hero?.offsetHeight || 400) * 0.35)) {
      setActiveById(null);
      return;
    }

    let current = null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      const top = rect.top - headerH();
      const bottom = rect.bottom - headerH();
      if (top <= 0 && bottom >= 0) { current = sec.id; break; }
    }
    setActiveById(current);
  };

  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (!id) setActiveById(null); else setActiveById(id);
  });

  onScroll();
})();

/* ==============================================================
   Projects hover gating: enable hover only when section is in view
   ============================================================== */
(function () {
  const sec = document.getElementById("projects");
  if (!sec) return;

  const setEnabled = (inView) => {
    sec.classList.toggle("hover-enabled", inView);
  };

  const io = new IntersectionObserver(
    ([entry]) => setEnabled(entry.isIntersecting && entry.intersectionRatio > 0.3),
    { threshold: [0, 0.3, 1] }
  );
  io.observe(sec);

  // Disable when jumping back to top
  window.addEventListener("hashchange", () => {
    if (location.hash === "" || location.hash === "#top") {
      sec.classList.remove("hover-enabled");
    }
  });

  if (window.scrollY < 50) sec.classList.remove("hover-enabled");
})();
