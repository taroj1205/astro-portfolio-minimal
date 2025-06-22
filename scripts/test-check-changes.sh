#!/bin/bash

set -e

echo "Testing check-changes.sh script..."
echo "=================================="

# Create a temporary git repository for testing
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

git init
git config user.email "test@example.com"
git config user.name "Test User"

# Create initial commit
echo "Initial content" > README.md
echo "Some code" > src/main.js
mkdir -p .vscode
echo '{"setting": true}' > .vscode/settings.json
git add .
git commit -m "Initial commit"
INITIAL_SHA=$(git rev-parse HEAD)

# Make changes to test filtering
echo "Updated README" > README.md          # Should be ignored (*.md)
echo "Updated code" > src/main.js          # Should NOT be ignored
echo '{"new": true}' > .vscode/launch.json # Should be ignored (.vscode/**)
git add .
git commit -m "Test changes"
CURRENT_SHA=$(git rev-parse HEAD)

echo "Test 1: Testing with mixed changes (some ignored, some not)"
echo "Base SHA: $INITIAL_SHA"
echo "Head SHA: $CURRENT_SHA"
echo ""

# Test the script (using absolute path to the original script)
SCRIPT_PATH="$OLDPWD/scripts/check-changes.sh"

echo "Running: $SCRIPT_PATH --base-sha $INITIAL_SHA --head-sha $CURRENT_SHA --output text"
"$SCRIPT_PATH" --base-sha "$INITIAL_SHA" --head-sha "$CURRENT_SHA" --output text
RESULT=$?
echo "Exit code: $RESULT (0=changes detected, 1=no relevant changes)"
echo ""

echo "Test 2: Testing GitHub Actions format"
echo "Running: $SCRIPT_PATH --base-sha $INITIAL_SHA --head-sha $CURRENT_SHA --output github"
"$SCRIPT_PATH" --base-sha "$INITIAL_SHA" --head-sha "$CURRENT_SHA" --output github
echo ""

echo "Test 3: Testing JSON format"
echo "Running: $SCRIPT_PATH --base-sha $INITIAL_SHA --head-sha $CURRENT_SHA --output json"
"$SCRIPT_PATH" --base-sha "$INITIAL_SHA" --head-sha "$CURRENT_SHA" --output json
echo ""

# Test with only ignored files
git reset --soft HEAD~1
echo "Only README updated" > README.md
git add .
git commit -m "Only ignored changes"
ONLY_IGNORED_SHA=$(git rev-parse HEAD)

echo "Test 4: Testing with only ignored files"
echo "Running: $SCRIPT_PATH --base-sha $INITIAL_SHA --head-sha $ONLY_IGNORED_SHA --output text"
"$SCRIPT_PATH" --base-sha "$INITIAL_SHA" --head-sha "$ONLY_IGNORED_SHA" --output text
RESULT=$?
echo "Exit code: $RESULT (should be 1 for no relevant changes)"
echo ""

# Clean up
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

echo "Test completed! You can also test manually with:"
echo "  ./scripts/check-changes.sh --base-sha <commit1> --head-sha <commit2>"
echo "  ./scripts/check-changes.sh --event-name pull_request --pr-base-sha <sha> --head-sha <sha>"
echo "  ./scripts/check-changes.sh --event-name push --push-before <sha> --head-sha <sha>" 