#!/usr/bin/env bash
# Einmalig: playwright-core in ein Arbeitsverzeichnis außerhalb des Repos installieren (Chrome kommt vom System).
OUT="${1:-${TMPDIR:-/tmp}/omniforge-spieler}"
mkdir -p "$OUT" && cd "$OUT" && { [ -f package.json ] || npm init -y >/dev/null; } && npm i playwright-core --silent && echo "bereit: $OUT"
