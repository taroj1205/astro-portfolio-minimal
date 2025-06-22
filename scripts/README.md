# Scripts Documentation

This directory contains utility scripts for the project.

## Scripts Overview

- `validate-branch-name.js` - Validates branch naming conventions
- `check-changes.sh` - CI change detection and filtering
- `test-check-changes.sh` - Test suite for the change detection script

---

# Branch Naming Conventions

This project enforces strict branch naming conventions using automated validation.

## Valid Branch Name Formats

✅ **Allowed patterns:**

- `feat/header` - Feature branches
- `feat/header-component` - Feature with dash-separated words
- `feat/header#32` - Feature with issue number
- `fix/bug-description#123` - Bug fix with issue number
- `chore/update-deps` - Maintenance tasks
- `docs/readme-update` - Documentation changes

## Invalid Branch Name Formats

❌ **Not allowed:**

- `feat-header` - Use `/` not `-` to separate type from scope
- `32-feat/header` - Cannot start with numbers
- `feature/header` - Must use valid conventional commit types
- `feat/Header` - Scope must be lowercase
- `feat/header component` - No spaces in scope

## Conventional Types

The following conventional commit types are supported:

- `build` - Build system changes
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `docs` - Documentation
- `feat` - New features
- `fix` - Bug fixes
- `perf` - Performance improvements
- `refactor` - Code refactoring
- `revert` - Reverting changes
- `style` - Code style changes
- `test` - Adding/updating tests

## Protected Branches

The following branches skip validation:

- `main`
- `master`
- `develop`
- `dev`
- `staging`
- `production`

## Validation Triggers

Branch names are validated automatically on:

- **Post-checkout** - When switching branches
- **Pre-push** - Before pushing to remote

## Manual Validation

You can manually validate your current branch name:

```bash
bun validate-branch
# or run directly:
bunx validate-branch-name.js
```

## Examples

```bash
# Valid branch names
git checkout -b feat/user-authentication
git checkout -b fix/navbar-responsiveness#45
git checkout -b chore/update-dependencies
git checkout -b docs/api-documentation

# Invalid branch names (will be rejected)
git checkout -b feat-user-auth        # ❌ Use / not -
git checkout -b 123-feat/header       # ❌ Can't start with number
git checkout -b feature/header        # ❌ Use 'feat' not 'feature'
git checkout -b feat/Header            # ❌ Scope must be lowercase
```

---

# CI Change Detection Script

The `check-changes.sh` script is used by the CI pipeline to determine if changes require running quality checks. It filters out files that match ignore patterns (like `*.md`, `.vscode/**`) to avoid unnecessary CI runs.

## Usage

```bash
./scripts/check-changes.sh [OPTIONS]
```

### Options

- `--base-sha <sha>` - Base commit SHA to compare against
- `--head-sha <sha>` - Head commit SHA to compare to (default: HEAD)
- `--event-name <name>` - Event name (`pull_request` or `push`)
- `--pr-base-sha <sha>` - PR base SHA (used when event-name is pull_request)
- `--push-before <sha>` - Push before SHA (used when event-name is push)
- `--ci-ignore <file>` - File containing ignore patterns (default: built-in patterns)
- `--output <format>` - Output format: `github|json|text` (default: text)
- `--help` - Show help message

### Default Ignore Patterns

The script ignores these file patterns by default:

- `*.md` - Markdown files
- `.gitignore`
- `.gitattributes`
- `.vscode/**` - VS Code settings

## Testing

### Quick Test

Run the automated test suite to verify the script works correctly:

```bash
./scripts/test-check-changes.sh
```

This creates a temporary git repository, makes various types of changes, and tests all output formats.

### Manual Testing

Test with your current repository changes:

```bash
# Test changes between HEAD and previous commit
./scripts/check-changes.sh --base-sha HEAD~1 --head-sha HEAD

# Test changes between two specific commits
./scripts/check-changes.sh --base-sha abc123 --head-sha def456

# Test as if it were a pull request
./scripts/check-changes.sh --event-name pull_request \
  --pr-base-sha main --head-sha feature-branch

# Test as if it were a push event
./scripts/check-changes.sh --event-name push \
  --push-before abc123 --head-sha HEAD
```

### Output Formats

#### Text Format (Default)

```bash
./scripts/check-changes.sh --base-sha HEAD~1 --output text
```

Shows detailed information about changed and filtered files.

#### GitHub Actions Format

```bash
./scripts/check-changes.sh --base-sha HEAD~1 --output github
```

Outputs `exists=true` or `exists=false` for use in GitHub Actions.

#### JSON Format

```bash
./scripts/check-changes.sh --base-sha HEAD~1 --output json
```

Returns structured JSON with changed files and filtering results.

### Exit Codes

- `0` - Changes detected (CI should run)
- `1` - No relevant changes (CI can be skipped)

### Example Test Scenarios

```bash
# Scenario 1: Only documentation changes (should skip CI)
echo "Updated docs" > README.md
git add README.md && git commit -m "docs(readme): update readme"
./scripts/check-changes.sh --base-sha HEAD~1
git reset --soft HEAD~1
# Expected: exit code 1, "No relevant changes"

# Scenario 2: Code changes (should run CI)
echo "console.log('hello')" > src/main.js
git add src/main.js && git commit -m "feat(logging): add logging"
./scripts/check-changes.sh --base-sha HEAD~1
git reset --soft HEAD~1
# Expected: exit code 0, "Changes detected"

# Scenario 3: Mixed changes (should run CI if any non-ignored files changed)
echo "Updated docs" > README.md
echo "new code" > src/app.js
git add . && git commit -m "feat(app): update app and docs"
./scripts/check-changes.sh --base-sha HEAD~1
git reset --soft HEAD~1
# Expected: exit code 0, "Changes detected" (due to src/app.js)
```

### Custom Ignore Patterns

Create a custom ignore file:

```bash
# Create custom ignore patterns
cat > custom-ignore.txt << EOF
*.test.js
docs/**
temp/**
EOF

# Use custom patterns
./scripts/check-changes.sh --base-sha HEAD~1 --ci-ignore custom-ignore.txt
```

## Integration with CI

The script is used in `.github/workflows/ci-pipeline.yml`:

```yaml
- name: Filter Changed Files
  id: filter
  shell: bash
  run: |
    OUTPUT=$(./scripts/check-changes.sh \
      --event-name "${{ github.event_name }}" \
      --pr-base-sha "${{ github.event.pull_request.base.sha }}" \
      --push-before "${{ github.event.before }}" \
      --head-sha "${{ github.sha }}" \
      --output github)
    echo "$OUTPUT" >> "$GITHUB_OUTPUT"
```
