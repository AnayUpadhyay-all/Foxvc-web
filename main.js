/* ==============================================================================
   FoxVC Marketing Platform & Interactive Engine Simulation
   Zero-Dependency Vanilla JavaScript
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initPlayground();
  initCopyButtons();
  initBenchmarkAnimations();
});

/* ------------------------------------------------------------------------------
   1. Interactive Particle Background Canvas
   ------------------------------------------------------------------------------ */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(Math.floor((width * height) / 18000), 70);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(255, 122, 0,' : 'rgba(0, 242, 254,'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = `rgba(255, 122, 0, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ------------------------------------------------------------------------------
   2. Interactive Playground Engine Simulation
   ------------------------------------------------------------------------------ */
const CODE_PRESETS = {
  fibonacci: {
    title: "main.fox (Tail-Call Optimized Recursion)",
    code: `# FoxVC v2.0 Tail-Call Optimized Fibonacci Engine
# 25-Keyword Exact Lexicon: act, lock, shift, spin, emit, say

act fib(n, a, b)
    pick n == 0
        emit a
    alt n == 1
        emit b
    otherwise
        # Tail-call optimization transforms this into 1-cycle jump!
        emit fib(n - 1, b, a + b)

lock start_time = time()
lock result = fib(1000, 0, 1)
lock elapsed = time() - start_time

say "✓ Computed Fibonacci(1000) using FoxCVM Native Arena"
say "Result: " + result
say "Execution latency: " + elapsed + " seconds"`,
    output: `[FoxCVM 2.0] Arena pre-warmed: 8MB standby pool (0 ns alloc)
[Compiler] Tail-call recursion verified: fib() -> 1-cycle native jump
[Runtime] Executing in 14 KB standalone ELF...

✓ Computed Fibonacci(1000) using FoxCVM Native Arena
Result: 434665576869374564356885276750406258059536...
Execution latency: 0.000184 seconds

✓ Process finished with exit code 0.`
  },

  database: {
    title: "database.fox (Native Embedded SQLite Persistence)",
    code: `# FoxVC Embedded Relational Database Module
# Zero-config relational persistence, parameterized queries, and sandbox confinement

db = dbOpen("production.db")

dbExecute(db, "CREATE TABLE IF NOT EXISTS developers (id TEXT PRIMARY KEY, name TEXT, role TEXT, rating REAL)")

act register_engineer(name, role, rating)
    lock dev_id = uuid()
    dbExecute(db, "INSERT INTO developers VALUES (?, ?, ?, ?)", [dev_id, name, role, rating])
    emit dev_id

register_engineer("Anay Upadhyay", "Creator & Systems Architect", 99.8)
register_engineer("Ada Lovelace", "Algorithm Pioneer", 99.9)

lock all_devs = dbQuery(db, "SELECT * FROM developers WHERE rating > ?", [90])
say "Total Persisted Engineers: " + len(all_devs)
cycle i from 0 to len(all_devs)
    say "• " + all_devs[i].name + " (" + all_devs[i].role + ")"`,
    output: `[Shelf: DB] Connected to embedded SQLite SQLite3Engine (URI=False)
[Shelf: DB] Executed DDL: CREATE TABLE IF NOT EXISTS developers
[Shelf: DB] Parameterized INSERT: [dev_id='6a3f12...', name='Anay Upadhyay', rating=99.8]
[Shelf: DB] Parameterized INSERT: [dev_id='8d910a...', name='Ada Lovelace', rating=99.9]

Total Persisted Engineers: 2
• Anay Upadhyay (Creator & Systems Architect)
• Ada Lovelace (Algorithm Pioneer)

✓ SQLite Transaction committed (2 rows affected).`
  },

  web: {
    title: "people.fweb & people.fskin (Decoupled Web Architecture)",
    code: `# FoxVC Decoupled Web Model (main.fweb)
# Unites Structure (.fweb), Appearance (.fskin), and Reactive Logic (.flogic)

use "design.fskin"
use "app.flogic"

app = element "page"
set app "title" "FoxVC Mission Portal"
apply app PageTheme

hdr = element "header"
title = element "heading" "FoxVC Autonomous Telemetry"
apply title BrandHeading
add hdr title
add app hdr

deck = element "container"
apply deck ResponsiveGrid

card1 = element "card"
readout = element "text" "Reactor Pressure: Nominal (1013 hPa)"
apply readout MetricText
purge_btn = element "button" "Engage Cryo Purge"
apply purge_btn ActionButton
bind purge_btn "activate" "readout" "content" "Cryo Purge Active: 980 hPa"

add card1 readout
add card1 purge_btn
add deck card1
add app deck

mount app`,
    output: `[F-Web Parser] Loaded structure: people.fweb
[F-Skin Engine] Applied cascading skin: design.fskin (PageTheme, ResponsiveGrid)
[F-Logic Runtime] State mounted: 2 reactive triggers registered
[HTTP Server] Bound to 127.0.0.1:8080 (Loopback only)

🚀 Live Web Application mounted in FoxVC Web Runtime!
✓ Streamed zero-dependency semantic HTML5 & responsive glassmorphism.
✓ Event dispatcher bound: 'activate' -> 'readout.content'.`
  },

  graphics: {
    title: "game.fox (Raylib 2D Hardware Acceleration)",
    code: `# FoxVC Native 2D Hardware Game Loop
# Zero-overhead Raylib hardware graphics shelf

openWindow(800, 600, "FoxVC 2D Engine")

shift player_x = 400
shift player_y = 300

pulse
    pick isKeyDown(262) # Right Arrow
        player_x = player_x + 5
    pick isKeyDown(263) # Left Arrow
        player_x = player_x - 5

    startFrame()
    drawBox(0, 0, 800, 600, "#080A0F")
    drawCircle(player_x, player_y, 25, "#FF7A00")
    drawText("FoxVC Hardware 2D: 120 FPS", 20, 20, 18, "#FFFFFF")
    endFrame()`,
    output: `[Shelf: Graphics] Initializing native Raylib 5.0 hardware window...
[OpenGL] Context created: 800x600 @ 120Hz VSync
[Audio] MiniAudio backend initialized
[FoxVM] Continuous pulse loop active with delta-time smoothing

Rendering 2D Hardware Frame Buffer...
FPS: 120.2 | VRAM: 3.4 MB | Draw Calls: 3
Zero Garbage Collection pauses detected.`
  },

  ai: {
    title: "ai_agent.fox (Autonomous AI Agent Orchestration)",
    code: `# FoxVC Native AI & LLM Agent Orchestration Shelf
# Zero-dependency local Ollama & Cloud LLM interface

lock prompt = "Design an ultra-fast in-memory cache algorithm"

say "Querying local LLM agent via FoxVC AI Shelf..."
lock response = aiPrompt("deepseek-r1:latest", prompt)

say "================ AI RESPONSE ================"
say response
say "============================================="

# Automated code review check
lock audit = aiAgent("CodeAuditor", "Audit memory safety in foxvm.c")
say "Safety Audit Verdict: " + audit.status`,
    output: `[Shelf: AI] Connecting to local Ollama agent at localhost:11434...
[HTTP Client] REST POST /api/generate (stream=False)
✓ Latency: 142 ms (Tokens/sec: 84.2)

================ AI RESPONSE ================
To design an ultra-fast cache in FoxVC:
1. Utilize the Tiered Chained Memory Arena with 1-cycle pointer bump allocation.
2. Structure keys as FoxPack schemas with fixed hash slots.
3. Eliminate Garbage Collection latency by resetting the standby arena at frame boundaries.
=============================================

Safety Audit Verdict: PASS (Zero unbounded memory allocations detected).`
  }
};

let currentPreset = 'fibonacci';

function initPlayground() {
  const codeArea = document.getElementById('codeEditor');
  const terminalOut = document.getElementById('terminalOutput');
  const runBtn = document.getElementById('btnRun');
  const presetButtons = document.querySelectorAll('.preset-btn');

  if (!codeArea || !terminalOut) return;

  function loadPreset(key) {
    currentPreset = key;
    presetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === key);
    });
    codeArea.value = CODE_PRESETS[key].code;
    terminalOut.innerHTML = `<span class="out-dim">// Ready to execute. Click 'Run FoxVC' or press Ctrl+Enter</span>\n<span class="out-orange">// Mode: FoxCVM Standalone Native C Execution (Sub-millisecond)</span>`;
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadPreset(btn.dataset.preset);
    });
  });

  // Run Code Simulation
  runBtn.addEventListener('click', () => {
    executeCode();
  });

  codeArea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeCode();
    }
  });

  function executeCode() {
    terminalOut.innerHTML = `<span class="out-orange">⚡ Compiling FoxVC AST tokens into 3-address register bytecode...</span>\n<span class="out-dim">[foxvm.c] Allocating arena standby memory block...</span>\n`;
    runBtn.disabled = true;
    runBtn.innerHTML = `<span>⚙ Running...</span>`;

    setTimeout(() => {
      const presetData = CODE_PRESETS[currentPreset];
      terminalOut.innerHTML = `<span class="out-success">${presetData.output}</span>`;
      runBtn.disabled = false;
      runBtn.innerHTML = `<span>▶ Run FoxVC</span>`;
    }, 450);
  }

  loadPreset('fibonacci');
}

/* ------------------------------------------------------------------------------
   3. One-Click Copy Tool
   ------------------------------------------------------------------------------ */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.dataset.copy;
      navigator.clipboard.writeText(targetText).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span>✓ Copied!</span>`;
        btn.style.borderColor = 'var(--accent-green)';
        btn.style.color = 'var(--accent-green)';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2200);
      });
    });
  });
}

/* ------------------------------------------------------------------------------
   4. Benchmark Bar Animations on Scroll
   ------------------------------------------------------------------------------ */
function initBenchmarkAnimations() {
  const bars = document.querySelectorAll('.metric-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach(bar => {
          const targetWidth = bar.dataset.width || '10%';
          bar.style.width = targetWidth;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const benchmarkCard = document.querySelector('.benchmark-card');
  if (benchmarkCard) {
    observer.observe(benchmarkCard);
  }
}
