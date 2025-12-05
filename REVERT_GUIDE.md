# Git Revert Guide - ReadySold

This guide shows you how to easily revert to any previous version of the website.

## Recent Commits (Most Recent First)

### Latest: Contact & Terms Page Fixes
**Commit:** `76f8a5c`
**Date:** Latest
**Changes:**
- Fixed contact page to match home page branding
- Removed emojis from all pages
- Simplified contact page design
- Moved "Get In Touch" section to top
- Fixed navigation and footer on contact & terms pages

**To revert to this point:**
```bash
git reset --hard 76f8a5c
```

---

### Previous: Hero Section & Initial Pages
**Commit:** Check previous commit
**Changes:**
- Hero section redesign (white text, dark overlay, centered)
- Trust bar centering
- Created initial contact & terms pages

**To revert to BEFORE contact fixes (but keep hero changes):**
```bash
git reset --hard HEAD~1
```

---

## How to Revert Changes

### Option 1: Revert to a Specific Commit
```bash
# Replace COMMIT_HASH with the commit you want
git reset --hard COMMIT_HASH
```

### Option 2: Go Back One Step
```bash
# This takes you to the previous commit
git reset --hard HEAD~1
```

### Option 3: Go Back Multiple Steps
```bash
# Replace N with number of commits back
git reset --hard HEAD~N
```

### Option 4: View All Commits
```bash
# See all commit history
git log --oneline

# See last 10 commits with more detail
git log -10
```

## Important Notes

1. **Always check what you're reverting:**
   ```bash
   git log --oneline
   ```

2. **If you want to keep uncommitted changes:**
   ```bash
   git stash              # Save your changes
   git reset --hard XXX   # Revert
   git stash pop          # Restore your changes
   ```

3. **To see what changed in a commit:**
   ```bash
   git show COMMIT_HASH
   ```

4. **To compare current state with a commit:**
   ```bash
   git diff COMMIT_HASH
   ```

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `git log --oneline` | List all commits |
| `git reset --hard HEAD~1` | Go back 1 commit |
| `git reset --hard 76f8a5c` | Go to specific commit |
| `git status` | Check current state |
| `git diff` | See uncommitted changes |

## Emergency Restore

If something goes wrong and you need to restore:

```bash
# See all your past actions
git reflog

# Find the commit you want and reset to it
git reset --hard COMMIT_HASH
```

## Current Branch Info

You're on branch: `claude/automotive-website-design-01DwBEEhg1aYAvQfYZAi76Lr`

To see all branches:
```bash
git branch -a
```
