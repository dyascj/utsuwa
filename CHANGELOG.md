# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-26

### Added
- Semantic memory search using local embeddings (Transformers.js)
- Facts are now matched by meaning, not just keywords
- Auto-backfill embeddings for existing facts on upgrade
- Version number now injected from package.json at build time

### Changed
- Memory retrieval uses semantic similarity with keyword fallback
- Database schema updated to v3 (adds embedding field to facts)
- InfoModal and export now use centralized version from package.json

## [0.1.0] - 2026-01-24

### Added
- Initial release
- VRM avatar viewer with orbit controls
- 3D speech bubbles tracking model head position
- Multi-provider LLM support (23+ providers)
- Multi-provider TTS support (13+ providers)
- Audio-driven lip-sync
- VRMA-based animations (idle, talking, blinking)
- Companion system with multi-axis relationships
- 8-stage relationship progression (Stranger to Soulmate)
- Visual novel event system with choices
- Memory system (facts, sessions, working memory)
- Time-based mood and relationship decay/recovery
- Local-first IndexedDB storage with export/import
- Theme system with light/dark modes
- Voice input via Web Speech API
