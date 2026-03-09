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
git merge vidhi_repo
git pull --rebase
git checkout vidhi_repo

if [ "$STASHED" = true ]; then
    echo "📤 Re-applying stash..."
    git stash pop
fi

echo "✅ Sync complete (resolve conflicts if any)."