---
title: Desktop Guide
description: How to use the Utsuwa desktop application with overlay mode.
---

# Desktop Guide

Utsuwa Desktop is a native application that brings your AI companion to your desktop with a transparent overlay mode. Your companion can float over other applications, always visible while you work.

> **Beta Notice:** The desktop app is currently on the `feature/desktop` branch and has only been tested on macOS. Windows and Linux support is planned.

## Installation

### Prerequisites

- Node.js 22+
- [Rust toolchain](https://rustup.rs/) (for Tauri)
- pnpm

### Building from Source

```bash
# Clone and switch to desktop branch
git clone https://github.com/dyascj/utsuwa.git
cd utsuwa
git checkout feature/desktop

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

The app will launch with both a development server and the native window.

## Features

### Main Window

The main window provides the full Utsuwa experience — same as the web version with all features:

- VRM avatar with animations
- Chat interface
- Settings and configuration
- Memory and relationship systems

A blue **monitor icon** in the top-right corner launches overlay mode.

### Overlay Mode

Overlay mode detaches your companion into a transparent, always-on-top window:

- **Transparent Background**: Only the character is visible; everything else is see-through
- **Always on Top**: The companion stays visible over all other windows
- **Draggable**: Click and drag anywhere on the character to reposition
- **Floating Chat**: Click the chat icon at the bottom to expand a chat input
- **Speech Bubbles**: Responses appear as speech bubbles near the character
- **Status Indicator**: The mood/relationship status pill appears above the chat icon

#### Controls

| Action | How |
|--------|-----|
| Move character | Click and drag on the character |
| Open chat | Click the chat icon at the bottom |
| Send message | Type and press Enter |
| Close chat | Send a message (auto-collapses) |
| Exit overlay | Click the X button in the top-right corner |

### Switching Between Modes

- **Main → Overlay**: Click the blue monitor icon in the top-right
- **Overlay → Main**: Click the X button in the overlay's top-right corner

Both windows share the same data — your conversation, memories, and relationship state persist across modes.

## Current Limitations

The desktop app is in beta. Some features are not yet implemented:

| Feature | Status |
|---------|--------|
| macOS support | ✅ Tested |
| Windows support | ⏳ Planned |
| Linux support | ⏳ Planned |
| Click-through transparency | ❌ Disabled (blocks UI) |
| Global hotkeys | 🔧 Infrastructure ready |
| Position persistence | ⏳ Planned |
| System tray | ⏳ Planned |

## Troubleshooting

### App won't start

Make sure you have Rust installed:

```bash
rustc --version
```

If not installed, run:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Overlay background not transparent

This can happen if the renderer isn't properly configured. Try:

1. Exit and relaunch the app
2. Make sure you're on the latest `feature/desktop` branch

### Character facing wrong direction

The camera is locked in overlay mode. If the character appears rotated, exit overlay and re-enter.

### Can't interact with overlay UI

The X button and chat icon should always be clickable. If they're not responding, the window may have lost focus — click anywhere on the overlay first.

## Technical Details

The desktop app uses:

- **Tauri v2** — Rust-based framework for native apps
- **Same SvelteKit codebase** — No fork, shared components
- **Platform detection** — `isTauri()` checks for Tauri environment
- **Multi-window** — Main window + overlay window managed separately

For architecture details, see [Architecture Overview](/docs/technology/architecture).
