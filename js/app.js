/* ---------- Utilities ---------- */
const $    = (sel, root = document) => root.querySelector(sel);
const $$   = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const on   = (el, ev, fn, opts)     => el && el.addEventListener(ev, fn, opts);
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Theme toggle + persistence ---------- */
(() => {
  const root   = document.documentElement;
  const toggle = $("#themeToggle");
  const saved  = localStorage.getItem("theme");

  if (!saved) {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      root.classList.add("light");
    }
  } else if (saved === "light") {
    root.classList.add("light");
  }

  if (toggle) {
    on(toggle, "click", () => {
      const isLight = root.classList.toggle("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  }
})();

/* ---------- Footer year ---------- */
(() => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ---------- Fade-in on scroll (respects reduced motion) ---------- */
(() => {
  if (prefersReducedMotion()) return;

  const targets = $$(".card, .section h2, .lead");
  if (!targets.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 400, easing: "ease-out", fill: "forwards" }
      );
      obs.unobserve(e.target);
    }
  }, { rootMargin: "-50px 0px -20% 0px", threshold: 0.01 });

  targets.forEach(el => io.observe(el));
})();

/* ---------- Nav: set aria-current on active section link ---------- */
(() => {
  const nav      = $("#primaryNav");
  if (!nav) return;

  const header   = $("header");
  const headerH  = () => (header ? header.offsetHeight : 80);
  const links    = $$("a[href^='#']", nav);
  const sections = links
    .map(a => $(a.getAttribute("href")))
    .filter(Boolean);
  const hero     = $(".hero");

  const setActiveById = (idOrNull) => {
    for (const a of links) {
      const match = idOrNull && a.getAttribute("href") === `#${idOrNull}`;
      a.toggleAttribute("aria-current", !!match);
      a.classList.toggle("active", !!match);
    }
  };

  const onScroll = () => {
    const nearTop = window.scrollY < Math.max(40, (hero?.offsetHeight || 400) * 0.35);
    if (nearTop) return setActiveById(null);

    let current = null;
    for (const sec of sections) {
      const rect   = sec.getBoundingClientRect();
      const top    = rect.top    - headerH();
      const bottom = rect.bottom - headerH();
      if (top <= 0 && bottom >= 0) { current = sec.id; break; }
    }
    setActiveById(current);
  };

  on(document, "scroll", onScroll, { passive: true });
  on(window, "resize", onScroll,   { passive: true });
  on(window, "hashchange", () => {
    const id = location.hash.replace("#", "");
    id ? setActiveById(id) : setActiveById(null);
  });

  onScroll();
})();

/* ---------- Hover gating: enable hover only when section is visible ---------- */
/* Applies to any section with class="hover-scope" (e.g., #projects, #works) */
(() => {
  const scopes = $$(".hover-scope");
  if (!scopes.length) return;

  const setEnabled = (el, inView) => {
    el.classList.toggle("hover-enabled", inView);
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      setEnabled(e.target, e.isIntersecting && e.intersectionRatio > 0.3);
    }
  }, { threshold: [0, 0.3, 1] });

  scopes.forEach(sec => {
    io.observe(sec);
    if (window.scrollY < 50) sec.classList.remove("hover-enabled");
  });

  on(window, "hashchange", () => {
    if (location.hash === "" || location.hash === "#top") {
      scopes.forEach(sec => sec.classList.remove("hover-enabled"));
    }
  });
})();

/* ---------- Mobile menu toggle (hamburger) ---------- */
(() => {
  const btn   = document.getElementById("menuToggle");
  const nav   = document.getElementById("primaryNav");
  const root  = document.documentElement;
  const hdr   = document.querySelector("header");
  if (!btn || !nav || !hdr) return;

  const setHeaderH = () => {
    const h = hdr.offsetHeight || 64;
    root.style.setProperty("--headerH", `${h}px`);
  };
  setHeaderH();
  window.addEventListener("resize", setHeaderH, { passive: true });

  const open = () => {
    document.body.classList.add("menu-open");
    btn.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-expanded", "false");
  };
  const toggle = () => {
    if (document.body.classList.contains("menu-open")) close();
    else open();
  };

  btn.addEventListener("click", toggle);
  // Close when clicking a link inside the nav
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });
  // Close on Escape, or when clicking outside
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("menu-open")) return;
    if (e.target.closest("header")) return; // clicks within header are fine
    close();
  });
})();