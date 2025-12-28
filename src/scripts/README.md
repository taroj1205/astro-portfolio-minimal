# Scripts Documentation

This directory contains utility scripts for the project.

## Scripts Overview

- `validate-branch-name.js` - Validates branch naming conventions

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
