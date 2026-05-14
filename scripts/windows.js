/* ============================================================
 *  windows.js — drag, focus stacking, traffic-light controls,
 *               dock open/close + indicator dots
 * ============================================================ */

(() => {
  "use strict";

  /* ---------- focus stacking ---------- */
  let z = 100;
  const focusWindow = (win) => {
    z += 1;
    win.style.zIndex = z;
  };
  document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => focusWindow(win));
  });

  /* ---------- drag ---------- */
  document.querySelectorAll("[data-drag]").forEach((handle) => {
    const win = handle.closest(".window");
    if (!win) return;
    let startX, startY, offX, offY, dragging = false;

    const onDown = (e) => {
      if (e.target.closest(".ctrl")) return;
      dragging = true;
      win.classList.add("is-dragging");
      focusWindow(win);
      const rect = win.getBoundingClientRect();
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      startY = (e.touches ? e.touches[0].clientY : e.clientY);
      offX = rect.left;
      offY = rect.top;
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const cx = (e.touches ? e.touches[0].clientX : e.clientX);
      const cy = (e.touches ? e.touches[0].clientY : e.clientY);
      const nx = Math.max(0, offX + cx - startX);
      const ny = Math.max(28, offY + cy - startY);
      win.style.left = `${nx}px`;
      win.style.top = `${ny}px`;
    };
    const onUp = () => {
      dragging = false;
      win.classList.remove("is-dragging");
    };

    handle.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    handle.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  });

  /* ---------- traffic-light controls ---------- */
  document.querySelectorAll(".window").forEach((win) => {
    const close = win.querySelector(".ctrl--close");
    const min = win.querySelector(".ctrl--min");
    const max = win.querySelector(".ctrl--max");

    close?.addEventListener("click", (e) => {
      e.stopPropagation();
      win.classList.add("is-hidden");
    });
    min?.addEventListener("click", (e) => {
      e.stopPropagation();
      win.classList.add("is-hidden");
    });
    max?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!win.classList.contains("is-max")) {
        win.classList.add("is-max");
        win.style.top = "32px";
        win.style.left = "16px";
        win.style.setProperty("--w", "calc(100vw - 130px)");
        win.style.height = "calc(100vh - 80px)";
      } else {
        win.classList.remove("is-max");
        // remove inline overrides so CSS positions take over again
        ["top", "left", "height"].forEach((p) => win.style.removeProperty(p));
        win.style.removeProperty("--w");
      }
    });
  });

  /* ---------- dock: open + indicator dots ---------- */
  const dockIndicators = new Map();
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.open;
      const win = document.querySelector(`.window[data-window="${key}"]`);
      if (!win) return;
      win.classList.remove("is-hidden");
      focusWindow(win);
      win.animate(
        [
          { transform: "translateY(8px) scale(0.96)", filter: "blur(4px)", opacity: 0.7 },
          { transform: "translateY(0) scale(1)", filter: "blur(0)", opacity: 1 },
        ],
        { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" }
      );
      btn.closest(".dockicon")?.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-10px)" },
          { transform: "translateY(0)" },
        ],
        { duration: 380, easing: "cubic-bezier(.4,1.6,.6,1)" }
      );
    });

    if (btn.classList.contains("dockicon")) {
      const key = btn.dataset.open;
      if (key) dockIndicators.set(key, btn.querySelector(".di-dot"));
    }
  });

  const refreshDockDots = () => {
    document.querySelectorAll(".window").forEach((win) => {
      const dot = dockIndicators.get(win.dataset.window);
      if (!dot) return;
      dot.style.opacity = win.classList.contains("is-hidden") ? 0 : 0.8;
    });
  };
  refreshDockDots();
  const mo = new MutationObserver(refreshDockDots);
  document.querySelectorAll(".window").forEach((w) =>
    mo.observe(w, { attributes: true, attributeFilter: ["class"] })
  );
})();
