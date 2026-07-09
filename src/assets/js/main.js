/* G Flexipack — shared site behaviours. Every block is null-guarded so this
   one file runs safely on every page. */
(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- scroll reveal ----------
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((el) => revealIO.observe(el));

  // ---------- stat counters (count up when visible) ----------
  const counterEls = document.querySelectorAll(".counter-num");
  if (counterEls.length) {
    const fmt = (n, comma) => (comma ? n.toLocaleString("en-IN") : String(n));
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        counterIO.unobserve(e.target);
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const comma = !!el.dataset.comma;
        if (reduceMotion) { el.textContent = fmt(target, comma) + suffix; return; }
        const t0 = performance.now();
        const DURATION = 1300;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / DURATION);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(target * eased), comma) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counterEls.forEach((el) => counterIO.observe(el));
  }

  // ---------- nav scroll-progress bar ----------
  const navProgress = document.getElementById("navProgress");
  if (navProgress) {
    const syncProgress = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const t = max > 0 ? h.scrollTop / max : 0;
      navProgress.style.width = t * 100 + "%";
    };
    window.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("resize", syncProgress);
    syncProgress();
  }

  // ---------- formats rail: arrows, drag, scrubber + counter ----------
  const rail = document.getElementById("formatRail");
  if (rail) {
    const prevBtn = document.getElementById("railPrev");
    const nextBtn = document.getElementById("railNext");
    const railFill = document.getElementById("railFill");
    const railCurrent = document.getElementById("railCurrent");
    const PANEL_COUNT = rail.querySelectorAll(".r-card").length;
    const panelStep = () => {
      const card = rail.querySelector(".r-card");
      return card ? card.getBoundingClientRect().width + 18 : 320;
    };
    if (prevBtn) prevBtn.addEventListener("click", () => rail.scrollBy({ left: -panelStep(), behavior: "smooth" }));
    if (nextBtn) nextBtn.addEventListener("click", () => rail.scrollBy({ left: panelStep(), behavior: "smooth" }));

    const syncRail = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      if (prevBtn) prevBtn.disabled = rail.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = rail.scrollLeft >= max - 4;
      const t = max > 0 ? rail.scrollLeft / max : 0;
      if (railFill) railFill.style.width = 8 + t * 92 + "%";
      if (railCurrent) {
        const current = Math.min(PANEL_COUNT, 1 + Math.round(t * (PANEL_COUNT - 1)));
        railCurrent.textContent = String(current).padStart(2, "0");
      }
    };
    rail.addEventListener("scroll", syncRail, { passive: true });
    window.addEventListener("resize", syncRail);
    syncRail();

    let dragStartX = 0, dragScrollLeft = 0, dragging = false, moved = false;
    rail.addEventListener("pointerdown", (e) => {
      dragging = true; moved = false;
      dragStartX = e.clientX;
      dragScrollLeft = rail.scrollLeft;
      rail.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = dragScrollLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      dragging = false;
      rail.classList.remove("is-dragging");
    });
    rail.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);
  }

  // ---------- industries accordion — hover opens on desktop, tap everywhere ----------
  const accPanels = document.querySelectorAll(".acc-panel");
  if (accPanels.length) {
    const openAcc = (target) => accPanels.forEach((p) => p.classList.toggle("is-open", p === target));
    const accDesktop = () => window.matchMedia("(min-width: 901px)").matches;
    accPanels.forEach((p) => {
      p.addEventListener("mouseenter", () => { if (accDesktop()) openAcc(p); });
      p.addEventListener("click", () => {
        if (!accDesktop() && p.classList.contains("is-open")) { p.classList.remove("is-open"); return; }
        openAcc(p);
      });
    });
  }

  // ---------- infrastructure scrollytelling — active step drives the pinned shot ----------
  const scStage = document.getElementById("scStage");
  if (scStage) {
    const shots = scStage.querySelectorAll(".sc-shot");
    const scSteps = document.querySelectorAll(".sc-step");
    const setShot = (n) => shots.forEach((s) => s.classList.toggle("is-active", s.dataset.shot === n));
    const scIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          scSteps.forEach((s) => s.classList.remove("is-active"));
          e.target.classList.add("is-active");
          setShot(e.target.dataset.step);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    scSteps.forEach((s) => scIO.observe(s));
  }

  // ---------- anatomy scrollytelling ("Inside the Film") ----------
  const stack = document.getElementById("filmStack");
  if (stack) {
    const steps = document.querySelectorAll(".a-step");
    const stepIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          steps.forEach((s) => s.classList.remove("is-active"));
          e.target.classList.add("is-active");
          stack.setAttribute("data-step", e.target.dataset.step);
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px" });
    steps.forEach((s) => stepIO.observe(s));
  }
})();
