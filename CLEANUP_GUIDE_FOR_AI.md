# Space_KONTEXT - Project Cleanup Guide

> **Target Audience**: AI Coding Agents (Cursor, Claude, etc.)
> **Purpose**: Clean up development artifacts before production deployment
> **Safety Level**: Safe - archives files instead of deleting permanently

---

## Cleanup Overview

This project contains many files created during development that should be:
1. **Archived** (moved to safe location outside project)
2. **Removed** from Git tracking
3. **Added to .gitignore** to prevent future commits

**Goal**: Clean, production-ready codebase with only essential files.

---

## Current Project State

### Files to Clean Up

```
Space_KONTEXT/
├── AGENT.md                                    ← Old development notes
├── AGENTS.md                                   ← Old development notes
├── GEMINI.md                                   ← Old development notes
├── enhanced-drawing-features.plan.md          ← Old planning doc
├── EXPORT_IMPLEMENTATION_GUIDE.md             ← Old guide
├── sketchfab_integration_guide_for_cursor.md  ← Old integration guide
├── sketchfab_integration_guide_part_2.md      ← Old integration guide
├── SKETCHUP_MODELER_ROADMAP.md                ← Old roadmap
├── SYSTEM_GAPS_FIX_GUIDE.md                   ← Old guide
├── UNITS_DIMENSION_FIX_PLAN.md                ← Old planning doc
├── convert_dxf_to_png.sh                      ← Test script
├── convert_dxf_to_png_v2.sh                   ← Test script
├── test-data/                                 ← Test data directory
├── uploads/                                   ← Local file uploads (should be empty)
├── Public/                                    ← Possible duplicate of public/
└── ... other files
```

### Files to Keep

```
✅ DEPLOYMENT_GUIDE_FOR_AI.md                  ← New deployment guide
✅ DEPLOYMENT_CHECKLIST_USER.md                ← User deployment guide
✅ CLAUDE.md                                   ← Task Master integration
✅ README.md                                   ← Main project documentation
✅ src/                                        ← Source code
✅ public/                                     ← Static assets (lowercase)
✅ package.json                                ← Dependencies
✅ next.config.js                              ← Next.js config
✅ prisma/                                     ← Database schema
✅ .gitignore                                  ← Git ignore rules
✅ All config files (tsconfig.json, etc.)
```

---

## Cleanup Steps

### Step 1: Create Archive Directory

Create a safe location outside the project to store old files:

```bash
# Create archive directory on Desktop
mkdir -p ~/Desktop/Space_KONTEXT_Archive

# Create subdirectories for organization
mkdir -p ~/Desktop/Space_KONTEXT_Archive/old_docs
mkdir -p ~/Desktop/Space_KONTEXT_Archive/old_scripts
mkdir -p ~/Desktop/Space_KONTEXT_Archive/test_data
```

**Verification**:
```bash
ls -la ~/Desktop/Space_KONTEXT_Archive/
```

Should show:
```
old_docs/
old_scripts/
test_data/
```

---

### Step 2: Archive Old Documentation Files

Move old documentation and planning files to archive:

```bash
# Navigate to project root
cd /Users/jjc4/Desktop/Space_KONTEXT

# Archive old development docs
mv AGENT.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true
mv AGENTS.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true
mv GEMINI.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true

# Archive old planning documents
mv enhanced-drawing-features.plan.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true
mv UNITS_DIMENSION_FIX_PLAN.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true

# Archive old implementation guides
mv EXPORT_IMPLEMENTATION_GUIDE.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true
mv SYSTEM_GAPS_FIX_GUIDE.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true
mv SKETCHUP_MODELER_ROADMAP.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true

# Archive old integration guides
mv sketchfab_integration_guide_for_cursor.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true
mv sketchfab_integration_guide_part_2.md ~/Desktop/Space_KONTEXT_Archive/old_docs/ 2>/dev/null || true
```

**Note**: The `2>/dev/null || true` ensures the command doesn't fail if a file doesn't exist.

**Verification**:
```bash
ls ~/Desktop/Space_KONTEXT_Archive/old_docs/
```

Should show all the archived .md files.

---

### Step 3: Archive Test Scripts

Move test/development scripts to archive:

```bash
# Archive DXF conversion test scripts
mv convert_dxf_to_png.sh ~/Desktop/Space_KONTEXT_Archive/old_scripts/ 2>/dev/null || true
mv convert_dxf_to_png_v2.sh ~/Desktop/Space_KONTEXT_Archive/old_scripts/ 2>/dev/null || true
```

**Verification**:
```bash
ls ~/Desktop/Space_KONTEXT_Archive/old_scripts/
```

Should show:
```
convert_dxf_to_png.sh
convert_dxf_to_png_v2.sh
```

---

### Step 4: Handle Test Data Directory

**First, check if test-data contains anything important:**

```bash
# Check what's in test-data
ls -lah test-data/
```

**If it contains test files you might need later**, archive it:

```bash
# Archive entire test-data directory
mv test-data ~/Desktop/Space_KONTEXT_Archive/test_data/ 2>/dev/null || true
```

**If it's empty or contains disposable test files**, you can remove it:

```bash
# Remove test-data directory
rm -rf test-data 2>/dev/null || true
```

---

### Step 5: Check Public/ vs public/ Directories

Next.js expects a lowercase `public/` directory. Check if `Public/` (capital P) is a duplicate:

```bash
# Check if both exist
ls -ld public/ Public/ 2>/dev/null || true

# Compare contents
ls public/
ls Public/
```

**If Public/ is a duplicate or empty**:

```bash
# Archive it first (safety)
mv Public ~/Desktop/Space_KONTEXT_Archive/old_public 2>/dev/null || true
```

**If Public/ contains unique files**, merge them into `public/` (lowercase):

```bash
# Move contents to lowercase public/
cp -r Public/* public/ 2>/dev/null || true
# Then archive the uppercase version
mv Public ~/Desktop/Space_KONTEXT_Archive/old_public 2>/dev/null || true
```

---

### Step 6: Clean Uploads Directory

The `uploads/` directory was used for local file storage during development. In production, files go to Cloudflare R2.

**Check what's in uploads:**

```bash
ls -lah uploads/
```

**If it contains test files**:

```bash
# Archive any test files
mkdir -p ~/Desktop/Space_KONTEXT_Archive/old_uploads
cp -r uploads/* ~/Desktop/Space_KONTEXT_Archive/old_uploads/ 2>/dev/null || true

# Clean the uploads directory (keep the folder, remove contents)
rm -rf uploads/*
```

**Keep the uploads/ directory itself** (it's already in .gitignore and may be needed for local dev):

```bash
# Ensure .gitkeep exists to preserve directory
touch uploads/.gitkeep
```

---

### Step 7: Update .gitignore

Add patterns to prevent future commits of development artifacts:

**Read current .gitignore:**

```bash
cat .gitignore
```

**Append new rules:**

Create a backup first:

```bash
cp .gitignore .gitignore.backup
```

Then update .gitignore by appending these lines:

```bash
cat >> .gitignore << 'EOF'

# Development artifacts and old docs
*_archive/
*_Archive/
test-data/
Public/

# Old planning and guide documents (keep new deployment guides)
*.plan.md
*_GUIDE.md
*_ROADMAP.md
!DEPLOYMENT_GUIDE_FOR_AI.md
!DEPLOYMENT_CHECKLIST_USER.md
!CLEANUP_GUIDE_FOR_AI.md

# Test scripts
*.sh
!scripts/*.sh

# Temporary files
*.tmp
*.bak
*.backup

# Editor-specific files (add if not already present)
.cursor/
.claude/
.kiro/
.roo/
.trae/
.windsurf/
.zed/
.gemini/
.clinerules/
.kilo/
.taskmaster/tasks/*.txt
.taskmaster/reports/

# Environment files (verify these are already present)
.env
.env.local
.env.*.local
.env.backup
.env.backup2
.env.test

# Build artifacts
.next/
out/
build/
dist/

# Dependency directories (verify already present)
node_modules/

# Database files (verify already present)
postgres_data/
pgadmin_data/
*.db
*.sqlite
*.sqlite3

# OS files (verify already present)
.DS_Store
Thumbs.db

# File uploads (verify already present)
uploads/*
!uploads/.gitkeep
EOF
```

**Verification:**

```bash
# Check that .gitignore was updated
tail -20 .gitignore
```

---

### Step 8: Clean Git Status

Check what files are currently tracked or staged:

```bash
# See current git status
git status
```

**If Git shows deleted files** (from the cleanup), you need to stage these deletions:

```bash
# Stage all deletions
git add -u
```

**Check for any files that shouldn't be committed**:

```bash
# See what's about to be committed
git status
```

**Verify important files are NOT being removed**:
- `src/` directory should still exist ✓
- `package.json` should still exist ✓
- `DEPLOYMENT_GUIDE_FOR_AI.md` should still exist ✓
- `DEPLOYMENT_CHECKLIST_USER.md` should still exist ✓

---

### Step 9: Remove Tracked Files from Git History

Some old files may already be in Git. Remove them from tracking:

```bash
# Remove old docs from Git (if they were committed)
git rm --cached AGENT.md 2>/dev/null || true
git rm --cached AGENTS.md 2>/dev/null || true
git rm --cached GEMINI.md 2>/dev/null || true
git rm --cached enhanced-drawing-features.plan.md 2>/dev/null || true
git rm --cached EXPORT_IMPLEMENTATION_GUIDE.md 2>/dev/null || true
git rm --cached sketchfab_integration_guide*.md 2>/dev/null || true
git rm --cached SKETCHUP_MODELER_ROADMAP.md 2>/dev/null || true
git rm --cached SYSTEM_GAPS_FIX_GUIDE.md 2>/dev/null || true
git rm --cached UNITS_DIMENSION_FIX_PLAN.md 2>/dev/null || true

# Remove test scripts from Git
git rm --cached convert_dxf_to_png*.sh 2>/dev/null || true

# Remove test data directory from Git
git rm -r --cached test-data 2>/dev/null || true

# Remove Public/ if it exists
git rm -r --cached Public 2>/dev/null || true
```

**Note**: `git rm --cached` removes files from Git tracking but keeps them in your filesystem. Since we've already archived them, this is safe.

---

### Step 10: Verify Cleanup

**Check project structure:**

```bash
# List all non-ignored files in project root
ls -la /Users/jjc4/Desktop/Space_KONTEXT/
```

**Should NOT see**:
- ❌ AGENT.md, AGENTS.md, GEMINI.md
- ❌ Old planning docs (*.plan.md)
- ❌ Old guide docs (*_GUIDE.md, *_ROADMAP.md)
- ❌ Test scripts (convert_dxf_to_png*.sh)
- ❌ test-data/ directory
- ❌ Public/ directory (capital P)

**SHOULD see**:
- ✅ DEPLOYMENT_GUIDE_FOR_AI.md
- ✅ DEPLOYMENT_CHECKLIST_USER.md
- ✅ CLEANUP_GUIDE_FOR_AI.md
- ✅ CLAUDE.md
- ✅ README.md
- ✅ src/
- ✅ public/ (lowercase)
- ✅ package.json
- ✅ next.config.js
- ✅ prisma/
- ✅ .gitignore
- ✅ uploads/ (empty except .gitkeep)

**Check Git status:**

```bash
git status
```

Should show:
- Modified: `.gitignore`
- Deleted: All the old docs and test files
- Untracked: None (or only files that should be ignored)

**Verify archive:**

```bash
# Check archive has all the files
ls -R ~/Desktop/Space_KONTEXT_Archive/
```

Should show:
```
old_docs/
  AGENT.md
  AGENTS.md
  GEMINI.md
  enhanced-drawing-features.plan.md
  EXPORT_IMPLEMENTATION_GUIDE.md
  sketchfab_integration_guide_for_cursor.md
  sketchfab_integration_guide_part_2.md
  SKETCHUP_MODELER_ROADMAP.md
  SYSTEM_GAPS_FIX_GUIDE.md
  UNITS_DIMENSION_FIX_PLAN.md

old_scripts/
  convert_dxf_to_png.sh
  convert_dxf_to_png_v2.sh

test_data/
  [contents of test-data/ if it existed]
```

---

### Step 11: Final Git Check

Before committing, verify everything is correct:

```bash
# Show detailed status
git status

# Show what will be committed
git diff --cached

# List all tracked files (shouldn't include old docs)
git ls-files | grep -E "(AGENT|plan\.md|GUIDE\.md|ROADMAP|convert_dxf)" && echo "⚠️  Warning: Old files still tracked!" || echo "✅ Old files successfully removed from Git"
```

---

## Verification Checklist

After cleanup, verify:

- [ ] All old .md docs archived to `~/Desktop/Space_KONTEXT_Archive/old_docs/`
- [ ] All test scripts archived to `~/Desktop/Space_KONTEXT_Archive/old_scripts/`
- [ ] test-data/ archived or removed
- [ ] Public/ (capital P) archived or removed
- [ ] uploads/ is empty (except .gitkeep)
- [ ] .gitignore updated with new rules
- [ ] New deployment guides still present (DEPLOYMENT_*.md)
- [ ] CLAUDE.md still present
- [ ] README.md still present
- [ ] src/ directory intact
- [ ] public/ directory intact (lowercase)
- [ ] package.json intact
- [ ] `git status` shows only intended changes
- [ ] No old files appear in `git ls-files`

---

## What to Report Back

After completing cleanup, report:

1. **Files archived**: List what was moved to archive
2. **Files removed from Git**: List what was removed from tracking
3. **Current git status**: Output of `git status`
4. **Verification**: Confirm all checklist items
5. **Issues**: Any problems encountered

**Example report format**:

```
Cleanup completed successfully!

Archived:
- 10 documentation files to old_docs/
- 2 test scripts to old_scripts/
- test-data/ directory to archive

Removed from Git:
- All old .md guides and plans
- Test scripts
- test-data/ directory

Current git status:
- Modified: .gitignore
- Deleted: 12 old documentation and test files

All verification checks passed ✅

Project is now clean and ready for deployment!
```

---

## Safety Notes

**This cleanup is SAFE because**:

1. ✅ Files are **archived**, not deleted permanently
2. ✅ Archive is outside project directory (`~/Desktop/Space_KONTEXT_Archive/`)
3. ✅ Can restore any file if needed
4. ✅ Only removes from Git tracking, doesn't delete from disk (until archived)
5. ✅ .gitignore prevents accidental re-commits

**If anything goes wrong**:

```bash
# Restore from archive
cp ~/Desktop/Space_KONTEXT_Archive/old_docs/* /Users/jjc4/Desktop/Space_KONTEXT/

# Restore .gitignore backup
cp .gitignore.backup .gitignore

# Undo git changes (before commit)
git reset HEAD .gitignore
git checkout -- .
```

---

## Next Steps After Cleanup

1. **Commit the cleanup**:
   ```bash
   git add .gitignore
   git add -u  # Stage deletions
   git commit -m "Clean up development artifacts and update .gitignore"
   ```

2. **Verify build still works**:
   ```bash
   npm run build
   ```

3. **Proceed with deployment**:
   - Follow `DEPLOYMENT_CHECKLIST_USER.md`
   - Or have AI agent follow `DEPLOYMENT_GUIDE_FOR_AI.md`

---

## Troubleshooting

### Problem: Archive directory creation fails

**Solution**:
```bash
# Check if Desktop exists
ls ~/Desktop/

# If not, use Documents instead
mkdir -p ~/Documents/Space_KONTEXT_Archive/old_docs
mkdir -p ~/Documents/Space_KONTEXT_Archive/old_scripts
mkdir -p ~/Documents/Space_KONTEXT_Archive/test_data

# Then update all `mv` commands to use ~/Documents/Space_KONTEXT_Archive/
```

### Problem: "No such file or directory" errors

**Solution**: This is normal if some files don't exist. The `2>/dev/null || true` in commands prevents these from being errors.

### Problem: Public/ vs public/ both have different content

**Solution**:
```bash
# Merge directories
rsync -av Public/ public/
# Verify merge
diff -r Public/ public/
# If identical, archive Public/
mv Public ~/Desktop/Space_KONTEXT_Archive/old_public
```

### Problem: Git shows files as "deleted" but they still exist

**Solution**: This means files are archived (not in project) but Git remembers them. This is correct! Stage the deletions:
```bash
git add -u
```

### Problem: Can't find archived files later

**Solution**:
```bash
# Search for archived files
find ~/Desktop/Space_KONTEXT_Archive/ -name "*.md"
find ~/Desktop/Space_KONTEXT_Archive/ -name "*.sh"
```

---

**End of Cleanup Guide**

This guide safely archives development artifacts while preserving them for future reference. Execute steps sequentially and verify each step before proceeding.
