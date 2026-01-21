/* ==========================================================================
  Fournier Designer — main.js
  - Scroll reveal (IntersectionObserver)
  - Light/Dark mode toggle (with transition)
  - Sticky navbar state
  - Mobile menu
  - Scroll progress bar
  - Parallax (very light)
  - Magnetic buttons micro-interaction
  - Portfolio modal (dialog)
  - Formspree async submit + success message
  ========================================================================== */

(() => {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ---------------------------------------------------------------------------
  // Theme (light/dark) with smooth transition
  // ---------------------------------------------------------------------------
  const root = document.documentElement;
  const themeToggle = qs("#themeToggle");

  const THEME_KEY = "fd_theme";
  const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return "dark"; // default per brief
  };

  const setTheme = (theme) => {
    // soft transition (without flashing)
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 280);

    root.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    localStorage.setItem(THEME_KEY, theme);
  };

  // small helper style for smooth theme change
  const injectThemeTransition = () => {
    const s = document.createElement("style");
    s.textContent = `
      .theme-transition, .theme-transition * {
        transition: background-color 280ms cubic-bezier(.2,.8,.2,1),
                    color 280ms cubic-bezier(.2,.8,.2,1),
                    border-color 280ms cubic-bezier(.2,.8,.2,1),
                    box-shadow 280ms cubic-bezier(.2,.8,.2,1) !important;
      }
    `;
    document.head.appendChild(s);
  };

  injectThemeTransition();
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ---------------------------------------------------------------------------
  // Sticky navbar "scrolled" state
  // ---------------------------------------------------------------------------
  const nav = qs(".nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  // ---------------------------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------------------------
  const burger = qs("#burger");
  const mobileMenu = qs("#mobileMenu");
  const navLinks = qsa('.mobile-menu__inner a[href^="#"]', mobileMenu);

  const setMenuOpen = (open) => {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.hidden = !open;

    // prevent background scroll when menu open (mobile)
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    navLinks.forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });

    // close on Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });
  }

  // ---------------------------------------------------------------------------
  // Scroll progress bar
  // ---------------------------------------------------------------------------
  const progressBar = qs("#scrollProgressBar");
  const onScrollProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, p))}%`;
  };
  onScrollProgress();
  window.addEventListener("scroll", onScrollProgress, { passive: true });

  // ---------------------------------------------------------------------------
  // Scroll reveal (IntersectionObserver)
  // ---------------------------------------------------------------------------
  const revealEls = qsa("[data-reveal]");
  const applyDelayFallback = () => {
    // CSS attr() fallback: apply transition-delay inline
    revealEls.forEach((el) => {
      const d = el.getAttribute("data-reveal-delay");
      if (d) el.style.transitionDelay = `${Number(d)}ms`;
    });
  };
  applyDelayFallback();

  const reveal = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(reveal, {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    });
    revealEls.forEach((el) => io.observe(el));
  } else {
    // fallback: show all
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ---------------------------------------------------------------------------
  // Parallax (very light) on few elements
  // - uses requestAnimationFrame, updates only when scrolling
  // - disabled for reduced motion
  // ---------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  // ---------------------------------------------------------------------------
  // HERO CANVAS ORBS (A) — ultra light, mobile-safe
  // ---------------------------------------------------------------------------
  const canvas = qs("#heroCanvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    const hero = qs("#hero") || document.body;

    const rand = (a, b) => a + Math.random() * (b - a);

    const palette = [
      { h: 220, s: 90, l: 60, a: 0.10 }, // bleu
      { h: 355, s: 85, l: 58, a: 0.08 }, // rouge
      { h: 210, s: 100, l: 92, a: 0.05 } // blanc/bleuté
    ];

    const orbs = Array.from({ length: 7 }, () => {
      const p = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: rand(0.15, 0.85),
        y: rand(0.15, 0.85),
        r: rand(90, 190),
        vx: rand(-0.0009, 0.0009),
        vy: rand(-0.0007, 0.0007),
        p
      };
    });

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(280, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // soft background fade
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, w, h);

      for (const o of orbs) {
        // drift
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < 0.05 || o.x > 0.95) o.vx *= -1;
        if (o.y < 0.05 || o.y > 0.95) o.vy *= -1;

        const cx = o.x * w;
        const cy = o.y * h;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        g.addColorStop(0, `hsla(${o.p.h} ${o.p.s}% ${o.p.l}% / ${o.p.a})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Throttle animation when not in view
    let running = false;
    let raf = 0;

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver((entries) => {
      const vis = entries.some(e => e.isIntersecting);
      if (vis && !running) {
        running = true;
        loop();
      } else if (!vis && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0.05 });

    resize();
    io.observe(hero);
    window.addEventListener("resize", resize, { passive: true });

    // subtle parallax tie-in (optional)
    window.addEventListener("scroll", () => {
      // tiny opacity modulation for depth (cheap)
      const y = window.scrollY || 0;
      const t = Math.max(0, Math.min(1, 1 - y / 520));
      canvas.style.opacity = String(0.55 + t * 0.35);
    }, { passive: true });
  }

  const parallaxEls = qsa("[data-parallax]");
  let ticking = false;

  const updateParallax = () => {
    ticking = false;
    if (prefersReducedMotion) return;

    const y = window.scrollY || 0;
    const vh = window.innerHeight || 800;

    parallaxEls.forEach((el) => {
      const strength = Number(el.getAttribute("data-parallax")) || 0.08;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const rel = (center - vh / 2) / vh; // -0.5..0.5 approx
      const translate = -rel * 24 * strength; // keep subtle
      el.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0)`;
    });
  };

  const onScrollParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  };

  if (parallaxEls.length && !prefersReducedMotion) {
    updateParallax();
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    window.addEventListener("resize", onScrollParallax, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // Magnetic buttons (micro-interaction)
  // ---------------------------------------------------------------------------
  const magneticEls = qsa("[data-magnetic]");
  const MAGNET_STRENGTH = 10; // px max offset

  const setMagnet = (el, x, y) => {
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    // also push glow a bit
    const glow = el.querySelector(".btn__glow");
    if (glow) {
      glow.style.setProperty("--mx", `${x * 1.4}px`);
      glow.style.setProperty("--my", `${y * 1.4}px`);
    }
  };

  magneticEls.forEach((el) => {
    if (prefersReducedMotion) return;

    let rect = null;
    const onEnter = () => { rect = el.getBoundingClientRect(); };
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-MAGNET_STRENGTH, Math.min(MAGNET_STRENGTH, mx / 8));
      const y = Math.max(-MAGNET_STRENGTH, Math.min(MAGNET_STRENGTH, my / 8));
      setMagnet(el, x, y);
    };
    const onLeave = () => {
      el.style.transition = "transform 280ms cubic-bezier(.2,.8,.2,1)";
      setMagnet(el, 0, 0);
      window.setTimeout(() => { el.style.transition = ""; }, 280);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  });

  // ---------------------------------------------------------------------------
  // Portfolio modal (dialog)
  // ---------------------------------------------------------------------------
  const modal = qs("#projectModal");
  const modalTitle = qs("#modalTitle");
  const modalMeta = qs("#modalMeta");
  const modalDesc = qs("#modalDesc");
  const modalKicker = qs("#modalKicker");
  const modalBullets = qs("#modalBullets");

  const projects = {
    "main-dor": {
      kicker: "Projet réel",
      title: "La Main d’Or",
      meta: "Beauté — site one-page",
      desc: "Objectif : présenter l’activité clairement et faciliter la prise de contact. Une page structurée, lisible, avec un style premium et des animations légères.",
      bullets: [
        "Structure one-page (services, tarifs, contact)",
        "Design moderne + micro-interactions",
        "Optimisation responsive + performance",
        "SEO de base (balises, structure, meta)"
      ]
    },
    "placeholder-1": {
      kicker: "Placeholder",
      title: "Studio Éclat",
      meta: "Coaching — site one-page",
      desc: "Une landing orientée conversion avec un message clair, une proposition de valeur directe et un CTA très visible.",
      bullets: [
        "Hero orienté promesse + CTA",
        "Sections preuves / FAQ pour lever les doutes",
        "Formulaire simple et efficace"
      ]
    },
    "placeholder-2": {
      kicker: "Placeholder",
      title: "Atelier Nord",
      meta: "Artisan — mini-site 3 pages",
      desc: "Un mini-site propre pour inspirer confiance : présentation, services, contact. Navigation simple, lecture rapide.",
      bullets: [
        "Architecture 3 pages simple",
        "Design clair + mise en avant des services",
        "Base SEO + performance"
      ]
    }
  };

  const openModal = (key) => {
    if (!modal || !projects[key]) return;
    const p = projects[key];
    if (modalKicker) modalKicker.textContent = p.kicker;
    if (modalTitle) modalTitle.textContent = p.title;
    if (modalMeta) modalMeta.textContent = p.meta;
    if (modalDesc) modalDesc.textContent = p.desc;

    if (modalBullets) {
      modalBullets.innerHTML = "";
      p.bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        modalBullets.appendChild(li);
      });
    }

    // show dialog
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      // fallback
      modal.setAttribute("open", "true");
    }
  };

  const closeModal = () => {
    if (!modal) return;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  };

  qsa("[data-modal-open]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-project")));
  });

  qsa("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  if (modal) {
    // close when clicking backdrop
    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!isInside) closeModal();
    });
  }

  // ---------------------------------------------------------------------------
  // Contact form (Formspree) — async submit
  // ---------------------------------------------------------------------------
  const form = qs("#contactForm");
  const successEl = qs("#formSuccess");
  const errorEl = qs("#formError");

  const show = (el) => { if (el) el.hidden = false; };
  const hide = (el) => { if (el) el.hidden = true; };

  if (form && form.hasAttribute("data-formspree")) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hide(successEl);
      hide(errorEl);

      const action = form.getAttribute("action") || "";
      if (!action || action.includes("XXXXXXXX")) {
        // endpoint not set yet: fallback to mailto
        show(errorEl);
        if (errorEl) errorEl.textContent = "Formulaire non configuré (endpoint Formspree manquant). Écrivez-moi par email.";
        return;
      }

      const data = new FormData(form);

      try {
        const res = await fetch(action, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          show(successEl);
          form.reset();
          // micro feedback: scroll to message
          successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          show(errorEl);
        }
      } catch (err) {
        show(errorEl);
      }
    });
  }



  // ---------------------------------------------------------------------------
  // SPOTLIGHT tracking on cards (desktop only, very light)
  // ---------------------------------------------------------------------------
  const spotlightCards = qsa('.card[data-spotlight]');
  if (spotlightCards.length && window.matchMedia("(hover: hover)").matches) {
    spotlightCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--sx", `${x.toFixed(2)}%`);
        card.style.setProperty("--sy", `${y.toFixed(2)}%`);
      }, { passive: true });
    });
  }

  // ---------------------------------------------------------------------------
  // Year in footer
  // ---------------------------------------------------------------------------
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();