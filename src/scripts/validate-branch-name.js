#!/usr/bin/env node
/* eslint-env node */
/* global console */

import { execSync } from 'node:child_process'
import { exit } from 'node:process'

/**
 * Validates branch names to follow conventional commit patterns
 * Valid formats:
 * - feat/header
 * - feat/header-component
 * - feat/header#32
 * - feat/header-component#123
 * - fix/bug-description
 * - chore/update-deps#456
 *
 * Invalid formats:
 * - feat-header (should use slash)
 * - 32-feat/header (can't start with number)
 * - feature/header (not a valid conventional type)
 */

const CONVENTIONAL_TYPES = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
]

const PROTECTED_BRANCHES = [
  'main',
  'master',
  'develop',
  'dev',
  'staging',
  'production',
]

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim()
  } catch (error) {
    console.error('❌ Error getting current branch:', error.message)
    exit(1)
  }
}

function validateBranchName(branchName) {
  // Skip validation for protected branches
  if (PROTECTED_BRANCHES.includes(branchName)) {
    return { valid: true, message: `Protected branch: ${branchName}` }
  }

  // Pattern: type/scope or type/scope#issue-number
  // Examples: feat/header, feat/header#32, fix/bug-description#123
  const pattern = new RegExp(
    `^(${CONVENTIONAL_TYPES.join('|')})\\/[a-z0-9][a-z0-9\\-]*(?:#\\d+)?$`
  )

  if (!pattern.test(branchName)) {
    let message = `❌ Invalid branch name: "${branchName}"\n\n`
    message += 'Branch names must follow conventional commit patterns:\n\n'
    message += '✅ Valid formats:\n'
    message += '  - feat/header\n'
    message += '  - feat/header-component\n'
    message += '  - feat/header#32\n'
    message += '  - fix/bug-description#123\n\n'
    message += '❌ Invalid formats:\n'
    message += '  - feat-header (use "/" not "-")\n'
    message += "  - 32-feat/header (can't start with number)\n"
    message += '  - feature/header (use valid conventional types)\n\n'
    message += `Valid types: ${CONVENTIONAL_TYPES.join(', ')}\n`

    return { valid: false, message }
  }

  return { valid: true, message: `✅ Valid branch name: ${branchName}` }
}

function main() {
  const currentBranch = getCurrentBranch()

  if (!currentBranch) {
    console.error('❌ Could not determine current branch')
    exit(1)
  }

  const result = validateBranchName(currentBranch)

  if (result.valid) {
    console.warn(result.message)
    exit(0)
  } else {
    console.error(result.message)
    exit(1)
  }
}

main()
