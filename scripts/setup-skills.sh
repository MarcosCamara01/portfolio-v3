#!/usr/bin/env bash
# Wire this repo's agent skills into the tools installed on this machine.
#
#   bash scripts/setup-skills.sh             # link into .claude/skills/
#   bash scripts/setup-skills.sh --global    # also link into ~/.claude/skills/
#   bash scripts/setup-skills.sh --dry-run
#
# The skills themselves live in .agents/skills/ and are committed. That is the
# tool-neutral location: Codex, Cline, Amp, Antigravity and others read it
# directly, so for those tools cloning the repo is enough and this script is not
# needed.
#
# Claude Code reads .claude/skills/ instead, so this script mirrors each skill
# there. The mirror is machine-local and gitignored. Run it once after cloning.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO_ROOT/.agents/skills"
MANIFEST_NAME=".managed-by-setup-skills"

DRY_RUN=false
GLOBAL=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --global)  GLOBAL=true ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

say() { printf '%s\n' "$*"; }
run() { if $DRY_RUN; then say "  [dry-run] $*"; else "$@"; fi; }

[ -d "$SRC" ] || { say "No skills found at $SRC"; exit 1; }

# Git Bash's `ln -s` silently copies unless winsymlinks is requested, so ask for
# a real symlink and let it fail when the OS will not allow one. On Windows a
# directory junction is the fallback: unlike a symlink it needs no elevation and
# no Developer Mode, and it tracks the source the same way.
try_symlink() {
  MSYS=winsymlinks:nativestrict ln -s "$1" "$2" 2>/dev/null && return 0
  command -v cygpath >/dev/null 2>&1 || return 1
  cmd //c mklink //J "$(cygpath -w "$2")" "$(cygpath -w "$1")" >/dev/null 2>&1
}

link_all() {
  local dest="$1" manifest="$1/$MANIFEST_NAME"
  say ""
  say "-> $dest"
  $DRY_RUN || mkdir -p "$dest"

  # Entries this script created previously; only those are safe to replace.
  local managed=""
  [ -f "$manifest" ] && managed="$(cat "$manifest")"
  is_managed() { printf '%s\n' "$managed" | grep -qxF "$1"; }

  # Drop dead symlinks and skills that no longer exist in the repo.
  for entry in "$dest"/*; do
    [ -e "$entry" ] || [ -L "$entry" ] || continue
    local name; name="$(basename "$entry")"
    [ "$name" = "$MANIFEST_NAME" ] && continue
    if [ -L "$entry" ] && [ ! -e "$entry" ]; then
      say "  dead  $name"; run rm -f "$entry"
    elif is_managed "$name" && [ ! -d "$SRC/$name" ]; then
      say "  gone  $name (removed from repo)"; run rm -rf "$entry"
    fi
  done

  local written=""
  for skill_dir in "$SRC"/*/; do
    local name target; name="$(basename "$skill_dir")"; target="$dest/$name"
    written="$written$name
"

    if [ -L "$target" ] || is_managed "$name"; then
      run rm -rf "$target"                 # ours: refresh it
    elif [ -e "$target" ]; then
      say "  skip  $name (unmanaged directory already there)"
      continue
    fi

    if $DRY_RUN; then
      say "  [dry-run] link $name"
    elif try_symlink "${skill_dir%/}" "$target"; then
      say "  link  $name"
    else
      cp -r "${skill_dir%/}" "$target"
      say "  copy  $name (no symlink support; re-run after each git pull)"
    fi
  done

  $DRY_RUN || printf '%s' "$written" > "$manifest"
}

say "skills: $SRC"
link_all "$REPO_ROOT/.claude/skills"
$GLOBAL && link_all "${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

say ""
say "Done. Restart your agent tool to pick up the changes."
