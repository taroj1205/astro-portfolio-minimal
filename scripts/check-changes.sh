#!/bin/bash

set -e

# Enable globstar for ** patterns
shopt -s globstar

# Default CI_IGNORE patterns
CI_IGNORE_DEFAULT="*.md
.gitignore
.gitattributes
.vscode/**"

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  --base-sha <sha>     Base commit SHA to compare against"
    echo "  --head-sha <sha>     Head commit SHA to compare to (default: HEAD)"
    echo "  --event-name <name>  Event name (pull_request or push)"
    echo "  --pr-base-sha <sha>  PR base SHA (used when event-name is pull_request)"
    echo "  --push-before <sha>  Push before SHA (used when event-name is push)"
    echo "  --ci-ignore <file>   File containing ignore patterns (default: use built-in patterns)"
    echo "  --output <format>    Output format: github|json|text (default: text)"
    echo "  --help               Show this help message"
    exit 1
}

# Parse command line arguments
BASE_SHA=""
HEAD_SHA="HEAD"
EVENT_NAME=""
PR_BASE_SHA=""
PUSH_BEFORE=""
CI_IGNORE_FILE=""
OUTPUT_FORMAT="text"

while [[ $# -gt 0 ]]; do
    case $1 in
        --base-sha)
            BASE_SHA="$2"
            shift 2
            ;;
        --head-sha)
            HEAD_SHA="$2"
            shift 2
            ;;
        --event-name)
            EVENT_NAME="$2"
            shift 2
            ;;
        --pr-base-sha)
            PR_BASE_SHA="$2"
            shift 2
            ;;
        --push-before)
            PUSH_BEFORE="$2"
            shift 2
            ;;
        --ci-ignore)
            CI_IGNORE_FILE="$2"
            shift 2
            ;;
        --output)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        --help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Determine BASE_SHA if not provided
if [[ -z "$BASE_SHA" && -n "$EVENT_NAME" ]]; then
    if [[ "$EVENT_NAME" == "pull_request" ]]; then
        BASE_SHA="$PR_BASE_SHA"
    elif [[ "$EVENT_NAME" == "push" ]]; then
        BASE_SHA="$PUSH_BEFORE"
    fi
fi

# Validate required parameters
if [[ -z "$BASE_SHA" ]]; then
    echo "Error: BASE_SHA is required (use --base-sha or --event-name with appropriate SHA)" >&2
    exit 1
fi

# Load CI_IGNORE patterns
if [[ -n "$CI_IGNORE_FILE" && -f "$CI_IGNORE_FILE" ]]; then
    CI_IGNORE=$(cat "$CI_IGNORE_FILE")
else
    CI_IGNORE="$CI_IGNORE_DEFAULT"
fi

# Get changed files
CHANGED=$(git diff --name-only "$BASE_SHA" "$HEAD_SHA")

# Filter out ignored patterns using glob matching
FILTERED=""
while IFS= read -r file; do
    [[ -n "$file" ]] || continue
    # Check if file matches any ignore pattern
    IGNORED=false
    while IFS= read -r pattern; do
        [[ -n "$pattern" ]] || continue
        if [[ $file == $pattern ]]; then
            IGNORED=true
            break
        fi
    done <<< "$CI_IGNORE"
    [[ "$IGNORED" == "false" ]] && FILTERED="$FILTERED$file"$'\n'
done <<< "$CHANGED"

# Remove trailing newline and check if any files remain
FILTERED=$(echo "$FILTERED" | sed '/^$/d')

# Output results based on format
case "$OUTPUT_FORMAT" in
    github)
        if [[ -z "$FILTERED" ]]; then
            echo "exists=false"
        else
            echo "exists=true"
        fi
        ;;
    json)
        if [[ -z "$FILTERED" ]]; then
            echo '{"exists": false, "changed_files": [], "filtered_files": []}'
        else
            # Convert to JSON arrays using bash (no jq dependency)
            CHANGED_JSON="["
            while IFS= read -r file; do
                [[ -n "$file" ]] || continue
                [[ "$CHANGED_JSON" != "[" ]] && CHANGED_JSON+=", "
                CHANGED_JSON+="\"$(echo "$file" | sed 's/\\/\\\\/g; s/"/\\"/g')\""
            done <<< "$CHANGED"
            CHANGED_JSON+="]"
            
            FILTERED_JSON="["
            while IFS= read -r file; do
                [[ -n "$file" ]] || continue
                [[ "$FILTERED_JSON" != "[" ]] && FILTERED_JSON+=", "
                FILTERED_JSON+="\"$(echo "$file" | sed 's/\\/\\\\/g; s/"/\\"/g')\""
            done <<< "$FILTERED"
            FILTERED_JSON+="]"
            
            echo "{\"exists\": true, \"changed_files\": $CHANGED_JSON, \"filtered_files\": $FILTERED_JSON}"
        fi
        ;;
    text|*)
        echo "Changed files:"
        if [[ -n "$CHANGED" ]]; then
            echo "$CHANGED" | sed 's/^/  /'
        else
            echo "  (none)"
        fi
        echo ""
        echo "Filtered files (after applying CI_IGNORE):"
        if [[ -n "$FILTERED" ]]; then
            echo "$FILTERED" | sed 's/^/  /'
            echo ""
            echo "Result: Changes detected - CI should run"
        else
            echo "  (none)"
            echo ""
            echo "Result: No relevant changes - CI can be skipped"
        fi
        ;;
esac

# Exit with appropriate code
if [[ -z "$FILTERED" ]]; then
    exit 1  # No changes to process
else
    exit 0  # Changes detected
fi 