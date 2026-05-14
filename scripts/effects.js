/* ============================================================
 *  effects.js — terminal type-on animation + skill bar fill
 * ============================================================ */

(() => {
  "use strict";

  /* ---------- expandable career items ---------- */
  document.querySelectorAll(".t-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".t-item");
      if (!item) return;
      const expanded = item.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  });

  /* ---------- skills bar fill on first visibility ---------- */
  const fillBar = (el) => {
    const v = el.getAttribute("data-fill");
    if (!v) return;
    requestAnimationFrame(() => el.style.setProperty("--fill", `${v}%`));
  };
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          fillBar(e.target);
          skillObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".sk-bar").forEach((b) => skillObserver.observe(b));

  /* ---------- terminal type-on ---------- */
  const term = document.getElementById("term");
  if (!term) return;

  const lines = [
    { t: 600 },
    { type: "boot", text: "swdrskOS 9.3.25 — kernel 26.0.0  ·  ttys001" },
    { type: "dim", text: "Last login: 2026-05-14 09:14 from 192.0.2.42" },
    { t: 280 },
    { type: "prompt", user: "ryosuke@swdrsk", path: "~", cmd: "whoami" },
    { type: "out", text: "ryosuke sawada — backend & ai engineer" },
    { t: 280 },
    { type: "prompt", user: "ryosuke@swdrsk", path: "~", cmd: "cat /etc/profile" },
    { type: "out", text: "UTokyo (Mechano-Informatics) → Simplex (Quant) → Spilavo (co-founder)" },
    { type: "out", text: "                            → Freelance → KARAKURI R&D (current)" },
    { t: 320 },
    { type: "prompt", user: "ryosuke@swdrsk", path: "~/stack", cmd: "ls -la" },
    { type: "out", text: "drwxr-xr-x  python/      django · fastapi · pytorch · strands" },
    { type: "out", text: "drwxr-xr-x  cloud/       aws · gcp · terraform · docker" },
    { type: "out", text: "drwxr-xr-x  web/         next.js · nuxt.js · flutter" },
    { type: "out", text: "drwxr-xr-x  data/        mysql · yolo · locust" },
    { t: 280 },
    { type: "prompt", user: "ryosuke@swdrsk", path: "~/now", cmd: "uptime" },
    { type: "ok", text: "  ↳ RAG sysytem prototyping / AI PoC / Research & Development" },
    { t: 260 },
    { type: "prompt", user: "ryosuke@swdrsk", path: "~", cmd: "echo $AVAILABILITY" },
    { type: "warn", text: "open to development, consulting & advisory inquiries." },
    { type: "prompt", user: "ryosuke@swdrsk", path: "~", cmd: "" },
    { type: "cursor" },
  ];

  const renderLine = (line) => {
    if (line.type === "cursor") {
      const span = document.createElement("span");
      span.className = "cur";
      term.appendChild(span);
      return;
    }
    if (line.type === "prompt") {
      const wrap = document.createElement("div");
      wrap.innerHTML = `<span class="prompt">${line.user}:</span><span class="dim">${line.path}</span><span class="prompt"> $ </span><span class="cmd"></span>`;
      term.appendChild(wrap);
      return wrap.querySelector(".cmd");
    }
    const div = document.createElement("div");
    div.className = line.type;
    div.textContent = line.text || "";
    term.appendChild(div);
  };

  const typeInto = (el, text) =>
    new Promise((resolve) => {
      let i = 0;
      const step = () => {
        if (i >= text.length) return resolve();
        el.textContent += text[i++];
        setTimeout(step, 24 + Math.random() * 32);
      };
      step();
    });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  (async () => {
    await sleep(1500);
    for (const line of lines) {
      if (line.t) { await sleep(line.t); continue; }
      const target = renderLine(line);
      if (line.type === "prompt" && line.cmd) {
        await typeInto(target, line.cmd);
        await sleep(180);
      }
      term.scrollTop = term.scrollHeight;
    }
  })();
})();
