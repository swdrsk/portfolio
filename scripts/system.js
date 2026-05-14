/* ============================================================
 *  system.js — theme toggle, language toggle, menubar clock
 * ============================================================ */

(() => {
  "use strict";

  const html = document.documentElement;

  /* ---------- theme ---------- */
  const storedTheme = (() => {
    try { return localStorage.getItem("theme"); } catch { return null; }
  })();
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  html.setAttribute("data-theme", storedTheme || (prefersDark ? "dark" : "light"));

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  });

  /* ---------- language ---------- */
  const storedLang = (() => {
    try { return localStorage.getItem("lang"); } catch { return null; }
  })();
  const browserLang = (navigator.language || "en").toLowerCase().startsWith("ja")
    ? "ja"
    : "en";
  html.setAttribute("data-lang", storedLang || browserLang);

  document.getElementById("langToggle")?.addEventListener("click", () => {
    const next = html.getAttribute("data-lang") === "ja" ? "en" : "ja";
    html.setAttribute("data-lang", next);
    try { localStorage.setItem("lang", next); } catch {}
  });

  /* ---------- clock ---------- */
  const clockEl = document.getElementById("clock");
  const pad = (n) => String(n).padStart(2, "0");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const tickClock = () => {
    if (!clockEl) return;
    const d = new Date();
    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    clockEl.textContent =
      `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}  ${h}:${pad(d.getMinutes())} ${ampm}`;
  };
  tickClock();
  setInterval(tickClock, 1000);
})();
