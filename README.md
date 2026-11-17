# 🦊 FoxVC Web Showcase

The official website for **FoxVC** — an independent, zero-overlap programming language created by Anay Upadhyay, featuring an exact 25-keyword lexicon, an embedded SQLite relational shelf, and a ~14 KB standalone C bytecode VM (`foxvm.c`).

---

## ⚡ What is FoxVC?

- **25 Exact Keywords:** Zero keyword ambiguity or synonym aliases (`act`, `emit`, `pack`, `mold`, `pick`, `alt`, `otherwise`, `pulse`, `cycle`, `spin`, `halt`, `skip`, `say`, `ask`, `guard`, `trap`, `fuse`, `lock`, `shift`, `blank`, `aye`, `nay`, `also`, `either`, `deny`).
- **Built-in SQLite Persistence:** Relational database operations (`dbOpen`, `dbExecute`, `dbQuery`, `dbClose`) without third-party drivers or ORMs.
- **Hardware 2D Raylib Graphics:** Standard graphics shelf bindings for 2D windowing, shape drawing, and delta-loop games.
- **~14 KB Standalone C Virtual Machine:** Pure C89/C99 implementation with a tiered memory arena and tail-call optimization.
- **Decoupled Web Model:** Experimental architecture separating semantic structure (`.fweb`), appearance (`.fskin`), and reactive state (`.flogic`).

---

## 🌐 Live WebAssembly Engine

To test FoxVC directly in your browser without installing anything, visit the official WebAssembly build hosted on GitHub Pages:

👉 **[https://anayupadhyay-all.github.io/FoxVC/](https://anayupadhyay-all.github.io/FoxVC/)**

---

## 📦 One-Line Installation

Linux, macOS, and Android (Termux):

```bash
curl -sSL https://raw.githubusercontent.com/AnayUpadhyay-all/FoxVC/main/install.sh | bash
```

---

## 📄 License

Created by **Anay Upadhyay**. Licensed under the [MIT License](LICENSE).  
Core Repository: [https://github.com/AnayUpadhyay-all/FoxVC](https://github.com/AnayUpadhyay-all/FoxVC)
