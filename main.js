/* ==============================================================================
   FoxVC Official Website Client Logic
   Syntax Highlighting, Interactive Code Tabs & Clipboard Utilities
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initShowcase();
  initCopyButtons();
});

const CODE_PRESETS = {
  fibonacci: {
    title: "fib.fox",
    desc: "Functions, variables, and tail-call optimized recursion in the native C VM.",
    code: `# FoxVC Core Syntax & Tail-Call Optimization
# Variables: lock (immutable) and shift (mutable)
lock target = 10
shift count = 0

# Functions declared with 'act', returned with 'emit'
act fib(n, a, b)
    pick n == 0
        emit a
    alt n == 1
        emit b
    otherwise
        # Tail-call optimized into a 1-cycle jump by foxvm.c
        emit fib(n - 1, b, a + b)

say "Computing Fibonacci(" + target + ")..."
lock result = fib(target, 0, 1)
say "Result: " + result`,
    output: `[foxvc] Executing with FoxCVM Native Bytecode Engine...
[foxvm.c] Standby linear arena initialized (8MB)
Computing Fibonacci(10)...
Result: 55
✓ Process finished with exit code 0 (latency: 0.18 ms).`
  },

  database: {
    title: "sqlite.fox",
    desc: "Built-in relational persistence via the SQLite standard shelf.",
    code: `# Embedded SQLite Persistence (Standard Library Shelf)
# Zero external packages or ORMs required
db = dbOpen("people.db")

# Create table
dbExecute(db, "CREATE TABLE IF NOT EXISTS people (id TEXT PRIMARY KEY, name TEXT, role TEXT)")

# Insert records with parameterized queries
lock id1 = uuid()
dbExecute(db, "INSERT INTO people VALUES (?, ?, ?)", [id1, "Anay Upadhyay", "Author"])
lock id2 = uuid()
dbExecute(db, "INSERT INTO people VALUES (?, ?, ?)", [id2, "Ada Lovelace", "Mathematician"])

# Query records
lock rows = dbQuery(db, "SELECT * FROM people ORDER BY name ASC")
say "Persisted count: " + len(rows)
say "First person: " + rows[0].name + " (" + rows[0].role + ")"`,
    output: `[Shelf: DB] Connected to SQLite (people.db)
[Shelf: DB] CREATE TABLE IF NOT EXISTS people
[Shelf: DB] INSERT [id='...', name='Anay Upadhyay', role='Author']
[Shelf: DB] INSERT [id='...', name='Ada Lovelace', role='Mathematician']
Persisted count: 2
First person: Ada Lovelace (Mathematician)
✓ SQLite transaction committed.`
  },

  graphics: {
    title: "graphics.fox",
    desc: "Raylib 2D hardware windowing and delta-time loop.",
    code: `# Raylib 2D Hardware Graphics Shelf
openWindow(800, 600, "FoxVC 2D Game Window")

shift player_x = 400
shift player_y = 300

pulse
    pick isKeyDown(262) # Right arrow
        player_x = player_x + 5
    pick isKeyDown(263) # Left arrow
        player_x = player_x - 5

    startFrame()
    drawBox(0, 0, 800, 600, "#07090E")
    drawCircle(player_x, player_y, 22, "#FF7A00")
    drawText("FoxVC Hardware 2D: Arrow Keys to Move", 20, 20, 16, "#F8FAFC")
    endFrame()`,
    output: `[Shelf: Graphics] Initializing native Raylib 5.0 window...
[OpenGL] Hardware 800x600 @ 60Hz VSync context created
[FoxVM] Continuous pulse loop active with delta-time smoothing
Render loop active: drawBox, drawCircle, drawText.`
  },

  web_demo: {
    title: "web_deck.fox",
    desc: "Decoupled Web Model: structure (fweb), skin (fskin), and logic (flogic).",
    code: `# Decoupled Web Model Architecture
# Structure is defined in .fweb, Skin in .fskin, Logic in .flogic

use "design.fskin"
use "app.flogic"

app = element "page"
set app "title" "FoxVC Dashboard"
apply app PageTheme

hdr = element "header"
title = element "heading" "Orbital Station Telemetry"
add hdr title
add app hdr

readout = element "text" "Reactor Pressure: Nominal"
btn = element "button" "Refresh Status"
bind btn "activate" "readout" "content" "Reactor Pressure: 1013 hPa"

add app readout
add app btn

mount app`,
    output: `[FoxVC Web Runtime] Mounted WebApplication
✓ Loaded semantic structure (.fweb)
✓ Applied visual theme rules (.fskin)
✓ Bound event dispatcher (.flogic)
Serving at http://127.0.0.1:8080/`
  }
};

/* FoxVC Syntax Highlighting Tokenizer */
function highlightFoxVC(code) {
  const keywords = new Set([
    'act', 'emit', 'pack', 'mold', 'pick', 'alt', 'otherwise',
    'pulse', 'cycle', 'spin', 'halt', 'skip', 'say', 'ask',
    'guard', 'trap', 'fuse', 'lock', 'shift', 'blank', 'aye',
    'nay', 'also', 'either', 'deny'
  ]);

  const builtins = new Set([
    'dbOpen', 'dbExecute', 'dbQuery', 'dbClose',
    'openWindow', 'closeWindow', 'startFrame', 'endFrame',
    'drawBox', 'drawCircle', 'drawText', 'isKeyDown',
    'time', 'uuid', 'len', 'readFile', 'writeFile', 'sleep',
    'element', 'set', 'apply', 'bind', 'mount', 'use'
  ]);

  const lines = code.split('\n');
  const highlightedLines = lines.map(line => {
    let result = '';
    let i = 0;
    const n = line.length;

    while (i < n) {
      // Comment
      if (line[i] === '#') {
        const comment = line.slice(i);
        result += `<span class="token-comment">${escapeHtml(comment)}</span>`;
        break;
      }

      // String literal
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < n && line[j] !== quote) {
          if (line[j] === '\\' && j + 1 < n) j += 2;
          else j++;
        }
        j = Math.min(j + 1, n);
        const str = line.slice(i, j);
        result += `<span class="token-string">${escapeHtml(str)}</span>`;
        i = j;
        continue;
      }

      // Identifier or Keyword
      if (/[a-zA-Z_]/.test(line[i])) {
        let j = i;
        while (j < n && /[a-zA-Z0-9_]/.test(line[j])) j++;
        const word = line.slice(i, j);

        if (keywords.has(word)) {
          result += `<span class="token-keyword">${escapeHtml(word)}</span>`;
        } else if (builtins.has(word)) {
          result += `<span class="token-builtin">${escapeHtml(word)}</span>`;
        } else if (j < n && line[j] === '(') {
          result += `<span class="token-fn">${escapeHtml(word)}</span>`;
        } else {
          result += escapeHtml(word);
        }
        i = j;
        continue;
      }

      // Number
      if (/[0-9]/.test(line[i])) {
        let j = i;
        while (j < n && /[0-9.]/.test(line[j])) j++;
        result += `<span class="token-number">${escapeHtml(line.slice(i, j))}</span>`;
        i = j;
        continue;
      }

      result += escapeHtml(line[i]);
      i++;
    }

    return result;
  });

  return highlightedLines.join('\n');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Showcase Tabs Controller */
let currentPresetKey = 'fibonacci';

function initShowcase() {
  const codeBox = document.getElementById('codeDisplay');
  const terminalBox = document.getElementById('terminalOutput');
  const runBtn = document.getElementById('btnRun');
  const tabs = document.querySelectorAll('.tab-btn');

  if (!codeBox || !terminalBox) return;

  function setPreset(key) {
    if (!CODE_PRESETS[key]) return;
    currentPresetKey = key;

    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === key);
    });

    const data = CODE_PRESETS[key];
    codeBox.innerHTML = highlightFoxVC(data.code);
    terminalBox.innerText = `// Ready to run. Click 'Run Sample' to execute simulated bytecode.`;
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      setPreset(t.dataset.tab);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      terminalBox.innerText = "Executing FoxVC bytecode engine...";
      runBtn.disabled = true;
      runBtn.innerText = "Running...";

      setTimeout(() => {
        terminalBox.innerText = CODE_PRESETS[currentPresetKey].output;
        runBtn.disabled = false;
        runBtn.innerText = "Run Sample";
      }, 250);
    });
  }

  setPreset('fibonacci');
}

/* Copy to Clipboard */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.style.color = "#34D399";
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.color = "";
        }, 2000);
      });
    });
  });
}
