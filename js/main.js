/* ============================================================
   SAVITHA K — Portfolio interactivity
   - Reveal-on-scroll
   - Chart.js radar + line telemetry
   - Live metric simulation
   - Interactive shell terminal
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 60, 400) + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ============================================================
     Chart.js theming helpers
     ============================================================ */
  const CYAN = "#00f0ff";
  const AMETHYST = "#a855f7";
  const GRID = "rgba(154, 147, 199, 0.15)";
  const TICK = "rgba(233, 230, 255, 0.55)";

  function hexToRgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }

  // soft neon glow behind chart strokes
  const glow = {
    id: "neonGlow",
    beforeDatasetsDraw(chart) {
      const { ctx } = chart;
      ctx.save();
      ctx.shadowColor = hexToRgba(chart.$glowColor || CYAN, 0.9);
      ctx.shadowBlur = 14;
    },
    afterDatasetsDraw(chart) {
      chart.ctx.restore();
    },
  };

  if (window.Chart) Chart.register(glow);

  /* ---------- Chart A: Radar (skill proficiency) ---------- */
  const radarCanvas = document.getElementById("radarChart");
  if (radarCanvas && window.Chart) {
    const c = radarCanvas.getContext("2d");
    const radar = new Chart(c, {
      type: "radar",
      data: {
        labels: ["Java", "Python", "JavaScript", "Web (HTML/CSS)", "C", "Cloud / DB"],
        datasets: [
          {
            label: "Proficiency",
            data: [85, 80, 88, 90, 78, 72],
            fill: true,
            backgroundColor: hexToRgba(AMETHYST, 0.22),
            borderColor: AMETHYST,
            borderWidth: 2,
            pointBackgroundColor: CYAN,
            pointBorderColor: "#fff",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: GRID },
            grid: { color: GRID },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { display: false, stepSize: 25 },
            pointLabels: {
              color: TICK,
              font: { size: 11, family: "Inter" },
            },
          },
        },
      },
    });
    radar.$glowColor = AMETHYST;
  }

  /* ---------- Chart B: Line (live traffic ingestion) ---------- */
  const lineCanvas = document.getElementById("lineChart");
  let lineChart = null;
  if (lineCanvas && window.Chart) {
    const ctx = lineCanvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 190);
    grad.addColorStop(0, hexToRgba(CYAN, 0.35));
    grad.addColorStop(1, hexToRgba(CYAN, 0));

    const N = 24;
    const seed = [];
    let base = 40;
    for (let i = 0; i < N; i++) {
      base += (Math.random() - 0.45) * 14;
      base = Math.max(12, Math.min(96, base));
      seed.push(Math.round(base));
    }

    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: seed.map((_, i) => `${i}`),
        datasets: [
          {
            label: "req/s",
            data: seed,
            borderColor: CYAN,
            backgroundColor: grad,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            grid: { color: GRID },
            ticks: { color: TICK, font: { size: 10 }, maxTicksLimit: 5 },
            suggestedMin: 0,
            suggestedMax: 110,
          },
        },
      },
    });
    lineChart.$glowColor = CYAN;

    // stream new data
    setInterval(() => {
      const d = lineChart.data.datasets[0].data;
      let next = d[d.length - 1] + (Math.random() - 0.45) * 16;
      next = Math.round(Math.max(12, Math.min(100, next)));
      d.push(next);
      d.shift();
      lineChart.update("none");
    }, 1600);
  }

  /* ---------- Live metric counters ---------- */
  const mVisitors = document.getElementById("m-visitors");
  const mRps = document.getElementById("m-rps");
  const mLat = document.getElementById("m-lat");
  setInterval(() => {
    if (mVisitors) mVisitors.textContent = 110 + Math.floor(Math.random() * 60);
    if (mRps) mRps.textContent = 30 + Math.floor(Math.random() * 40);
    if (mLat) mLat.textContent = 28 + Math.floor(Math.random() * 24) + "ms";
  }, 2000);

  /* ============================================================
     Interactive Shell Terminal
     ============================================================ */
  const termBody = document.getElementById("term-body");
  const termInput = document.getElementById("term-input");
  const inputLine = termBody ? termBody.querySelector(".term-input-line") : null;

  const PROMPT_HTML =
    '<span class="prompt">guest@savitha-portfolio</span>' +
    '<span class="out-white">:</span><span class="path">~</span>' +
    '<span class="out-white">$</span> ';

  function scrollBottom() {
    termBody.scrollTop = termBody.scrollHeight;
  }

  function printBlock(html) {
    const div = document.createElement("div");
    div.className = "term-line";
    div.innerHTML = html;
    termBody.insertBefore(div, inputLine);
  }

  function echoCommand(cmd) {
    printBlock(
      PROMPT_HTML + '<span class="cmd">' + escapeHtml(cmd) + "</span>"
    );
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  const COMMANDS = {
    help() {
      return [
        '<span class="out-cyan">Available commands</span>',
        '  <span class="out-green">about</span>     — background &amp; profile summary',
        '  <span class="out-green">skills</span>    — languages, tools &amp; database modules',
        '  <span class="out-green">projects</span>  — featured project specifications',
        '  <span class="out-green">contact</span>   — email &amp; social links',
        '  <span class="out-green">clear</span>     — clear the console viewport',
      ].join("\n");
    },
    about() {
      return [
        '<span class="out-white">SAVITHA K</span> — B.Tech Information Technology Student',
        'Government College of Engineering, Erode · <span class="out-cyan">CGPA 8.6/10</span>',
        "",
        'Aspiring software developer focused on secure, data-driven web',
        'applications — role-based portals, cloud-deployed auth systems and',
        'clean, delightful interfaces. Certified across C, Java &amp; Oracle Cloud.',
      ].join("\n");
    },
    skills() {
      return [
        '<span class="out-cyan">Core Languages</span>',
        '  Java · Python · JavaScript · HTML · CSS · C',
        "",
        '<span class="out-cyan">Platforms &amp; Tools</span>',
        '  Oracle Cloud (OCI) · Git/GitHub · Firebase · Power BI · Canva',
        "",
        '<span class="out-cyan">Database Modules</span>',
        '  MySQL · Firebase Realtime/Firestore',
      ].join("\n");
    },
    projects() {
      return [
        '<span class="out-amethyst">[1] College Connect</span> — Web Portal for Students &amp; Administration',
        '    Tech: HTML, CSS, JavaScript, Firebase Stack',
        '    Centralized communication matrix · digital attendance &amp; marks',
        '    logging · leave-request approval workflows · role-based auth.',
        "",
        '<span class="out-amethyst">[2] Secure User Profile Management System</span>',
        '    Tech: HTML, Bootstrap, JavaScript, PHP, MySQL, AWS EC2',
        '    Secure login protocols · session-based auth states · Gmail-only',
        '    Regex validation · profile image uploads.',
      ].join("\n");
    },
    contact() {
      return [
        '<span class="out-cyan">Email   </span> savithak2006@gmail.com',
        '<span class="out-cyan">GitHub  </span> https://github.com/Savi2604',
        '<span class="out-cyan">LinkedIn</span> https://www.linkedin.com/in/savitha-k-44169a357',
      ].join("\n");
    },
    clear() {
      termBody.querySelectorAll(".term-line").forEach((n) => n.remove());
      return null;
    },
  };

  const ALIASES = { ls: "help", "?": "help", whoami: "about", cls: "clear" };

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (cmd === "") return;
    echoCommand(raw.trim());
    const key = ALIASES[cmd] || cmd;
    if (COMMANDS[key]) {
      const out = COMMANDS[key]();
      if (out !== null) printBlock(out);
    } else {
      printBlock(
        '<span class="out-muted">command not found: </span>' +
          escapeHtml(cmd) +
          '<span class="out-muted"> — type </span><span class="out-green">help</span>'
      );
    }
    scrollBottom();
  }

  // command history
  const history = [];
  let hIndex = -1;

  if (termInput) {
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = termInput.value;
        if (val.trim() !== "") {
          history.push(val.trim());
          hIndex = history.length;
        }
        runCommand(val);
        termInput.value = "";
      } else if (e.key === "ArrowUp") {
        if (history.length && hIndex > 0) {
          hIndex--;
          termInput.value = history[hIndex];
          e.preventDefault();
        }
      } else if (e.key === "ArrowDown") {
        if (hIndex < history.length - 1) {
          hIndex++;
          termInput.value = history[hIndex];
        } else {
          hIndex = history.length;
          termInput.value = "";
        }
        e.preventDefault();
      }
    });

    // keep focus on click anywhere in terminal body
    termBody.addEventListener("click", () => termInput.focus());

    // boot banner
    printBlock(
      [
        '<span class="out-cyan">╔══════════════════════════════════════════════╗</span>',
        '<span class="out-cyan">║</span>   SAVITHA-PORTFOLIO SHELL  ·  v1.0             <span class="out-cyan">║</span>',
        '<span class="out-cyan">╚══════════════════════════════════════════════╝</span>',
        'Welcome. Type <span class="out-green">help</span> to list available commands.',
        "",
      ].join("\n")
    );

    // auto focus on load (deferred so it doesn't hijack scroll)
    window.addEventListener("load", () => {
      setTimeout(() => termInput.focus({ preventScroll: true }), 300);
    });
  }
})();
