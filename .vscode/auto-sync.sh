#!/bin/bash

echo "🔄 Auto syncing repository..."

# Check for local changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📦 Stashing local changes..."
    git stash push -m "auto-stash-before-pull"
    STASHED=true
else
    STASHED=false
fi

echo "⬇️ Pulling latest changes..."
git checkout origin main
git merge sumita_repo
git pull --rebase
git checkout sumita_repo

if [ "$STASHED" = true ]; then
    echo "📤 Re-applying stash..."
    git stash pop
fi

echo "✅ Sync complete (resolve conflicts if any)."