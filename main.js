/* ==============================================================================
   FoxVC Showcase Interactive Playground
   Honest, Accurate Code Examples & WebAssembly Reference
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPlayground();
  initCopyButtons();
});

const CODE_PRESETS = {
  fibonacci: {
    title: "fib.fox — Core Syntax & Tail-Call Recursion",
    code: `# FoxVC Core Syntax Demo
# Variables: lock (immutable) and shift (mutable)
lock target = 10
shift count = 0

# Functions (act) and explicit return (emit)
act fib(n, a, b)
    pick n == 0
        emit a
    alt n == 1
        emit b
    otherwise
        # Tail-call optimized in the native C VM (foxvm.c)
        emit fib(n - 1, b, a + b)

say "Computing Fibonacci(" + target + ")..."
lock result = fib(target, 0, 1)
say "Result: " + result`,
    output: `[foxvc] Executing with FoxCVM Native Bytecode Engine...
Computing Fibonacci(10)...
Result: 55
✓ Process finished with exit code 0.`
  },

  database: {
    title: "sqlite.fox — Built-in SQLite Relational Persistence",
    code: `# Native SQLite embedded shelf (Zero external libraries needed)
db = dbOpen("people.db")

# Create table
dbExecute(db, "CREATE TABLE IF NOT EXISTS people (id TEXT PRIMARY KEY, name TEXT, role TEXT)")

# Insert records with parameterized queries
lock p1 = uuid()
dbExecute(db, "INSERT INTO people VALUES (?, ?, ?)", [p1, "Anay Upadhyay", "Author"])
lock p2 = uuid()
dbExecute(db, "INSERT INTO people VALUES (?, ?, ?)", [p2, "Ada Lovelace", "Mathematician"])

# Query records
lock rows = dbQuery(db, "SELECT * FROM people")
say "Persisted people count: " + len(rows)
say "First person: " + rows[0].name + " (" + rows[0].role + ")"`,
    output: `[Shelf: DB] Connected to SQLite (people.db)
[Shelf: DB] DDL: CREATE TABLE IF NOT EXISTS people
[Shelf: DB] Parameterized INSERT: [id='...', name='Anay Upadhyay', role='Author']
[Shelf: DB] Parameterized INSERT: [id='...', name='Ada Lovelace', role='Mathematician']
Persisted people count: 2
First person: Anay Upadhyay (Author)
✓ SQLite transaction committed.`
  },

  graphics: {
    title: "graphics.fox — Native Raylib 2D Hardware Windowing",
    code: `# Native Raylib 2D Graphics Shelf
openWindow(800, 600, "FoxVC 2D Window")

shift x = 400
shift y = 300

pulse
    pick isKeyDown(262) # Right arrow
        x = x + 4
    pick isKeyDown(263) # Left arrow
        x = x - 4

    startFrame()
    drawBox(0, 0, 800, 600, "#080B10")
    drawCircle(x, y, 20, "#FF7A00")
    drawText("FoxVC Hardware 2D: Arrow Keys to Move", 20, 20, 16, "#FFFFFF")
    endFrame()`,
    output: `[Shelf: Graphics] Initializing Raylib hardware window (800x600)...
[OpenGL] Hardware context initialized
[FoxVM] Continuous pulse delta-loop running at 60 FPS
Drawing frame buffer: 1 box, 1 circle, 1 text element.`
  },

  web_demo: {
    title: "web_demo.fox — Decoupled Web Model (fweb / fskin / flogic)",
    code: `# Decoupled Web Model Architecture
# Structure is in .fweb, Skin in .fskin, Logic in .flogic

use "design.fskin"
use "app.flogic"

app = element "page"
set app "title" "FoxVC Dashboard"
apply app PageTheme

hdr = element "header"
title = element "heading" "FoxVC Telemetry"
add hdr title
add app hdr

btn = element "button" "Refresh"
apply btn ActionButton
bind btn "activate" "counter" "increment"
add app btn

mount app`,
    output: `[FoxVC Web] Mounted application into FoxVC Web Runtime
✓ Loaded structure (.fweb)
✓ Applied visual theme rules (.fskin)
✓ Bound event listeners (.flogic)
Serving at http://127.0.0.1:8080`
  }
};

let currentTab = 'fibonacci';

function initPlayground() {
  const codeArea = document.getElementById('codeEditor');
  const terminalOut = document.getElementById('terminalOutput');
  const runBtn = document.getElementById('btnRun');
  const tabButtons = document.querySelectorAll('.tab-btn');

  if (!codeArea || !terminalOut) return;

  function loadTab(key) {
    if (!CODE_PRESETS[key]) return;
    currentTab = key;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === key);
    });
    codeArea.value = CODE_PRESETS[key].code;
    terminalOut.innerText = "// Ready. Click 'Run Sample' to execute simulated output.";
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadTab(btn.dataset.tab);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      terminalOut.innerText = "Running FoxVC bytecode engine...";
      runBtn.disabled = true;
      runBtn.innerText = "Running...";

      setTimeout(() => {
        terminalOut.innerText = CODE_PRESETS[currentTab].output;
        runBtn.disabled = false;
        runBtn.innerText = "Run Sample";
      }, 300);
    });
  }

  loadTab('fibonacci');
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerText;
        btn.innerText = "Copied!";
        btn.style.color = "#34D399";
        setTimeout(() => {
          btn.innerText = orig;
          btn.style.color = "";
        }, 2000);
      });
    });
  });
}
