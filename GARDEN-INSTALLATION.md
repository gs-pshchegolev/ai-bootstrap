# Garden System Installation

Complete installation guide for setting up the Garden System in target repositories.

## Prerequisites

Before installing, ensure:

1. **Target repository has AGENTS.md**
   - If not, run [ai-bootstrapper.md](ai-bootstrapper.md) first

2. **Claude Code CLI is installed**
   - The garden system uses Claude Code's skill system

3. **Access to ai-bootstrap repository**
   - Either cloned locally or accessible remotely

## Installation Methods

Choose one of three methods based on your needs:

| Method | Use Case | Pros | Cons |
|--------|----------|------|------|
| **Direct Copy** | Production, standalone repos | ✅ Offline, simple, standalone | ⚠️ Manual updates |
| **Git Submodule** | Version tracking, multiple repos | ✅ Easy updates, consistent | ⚠️ Submodule complexity |
| **Symlink** | Local development only | ✅ Instant updates | ⚠️ Local only, can't commit |

---

## Method 1: Direct Copy (Recommended)

**Best for:** Production use, standalone repositories, offline work

Copies the entire garden system into your repository - fully self-contained.

### Steps

```bash
# Navigate to target repository
cd /path/to/target-repo

# Copy garden system source
mkdir -p _gs-gardener
cp -r /path/to/ai-bootstrap/_gs-gardener/ _gs-gardener/

# Copy skill command files
mkdir -p .claude/commands
cp /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit to repository
git add _gs-gardener .claude/commands/garden-*.md
git commit -m "feat: add garden system for AI config maintenance"
```

### Advantages

- ✅ **Fully standalone** - No external dependencies
- ✅ **Works offline** - All files are local
- ✅ **Easy to customize** - Per-repository modifications possible
- ✅ **Simple to understand** - All files visible in your repo

### Disadvantages

- ⚠️ **Manual updates** - When garden system improves, must manually re-copy
- ⚠️ **Storage duplication** - Each repo has its own copy

### Updating

To update to a newer version:

```bash
cd /path/to/target-repo

# Pull latest ai-bootstrap (if cloned locally)
cd /path/to/ai-bootstrap && git pull origin main
cd /path/to/target-repo

# Remove old version
rm -rf _gs-gardener
rm .claude/commands/garden-*.md

# Copy new version
cp -r /path/to/ai-bootstrap/_gs-gardener/ _gs-gardener/
cp /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit updates
git add _gs-gardener .claude/commands
git commit -m "chore: update garden system to latest version"
```

---

## Method 2: Git Submodule

**Best for:** Multiple repositories sharing the same version, centralized updates

Uses git submodules to track ai-bootstrap version in your repository.

### Steps

```bash
# Navigate to target repository
cd /path/to/target-repo

# Add ai-bootstrap as submodule
git submodule add https://github.com/your-org/ai-bootstrap.git _ai-bootstrap
git submodule update --init --recursive

# Create symlink to garden system
ln -s _ai-bootstrap/_gs-gardener _gs-gardener

# Copy command files
mkdir -p .claude/commands
cp _ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit
git add .gitmodules _ai-bootstrap _gs-gardener .claude/commands/garden-*.md
git commit -m "feat: add garden system via submodule"
```

### Advantages

- ✅ **Easy updates** - Just `git submodule update`
- ✅ **Version tracked** - Know exactly which version you're using
- ✅ **Consistent** - All target repos can use same version

### Disadvantages

- ⚠️ **Submodule complexity** - Requires git submodule knowledge
- ⚠️ **Network dependency** - Updates require network access
- ⚠️ **More complex setup** - Additional git commands needed

### Updating

To update to a newer version:

```bash
cd /path/to/target-repo

# Update submodule to latest
cd _ai-bootstrap
git pull origin main
cd ..

# Re-copy command files (if changed)
cp _ai-bootstrap/.claude/commands/garden-*.md .claude/commands/

# Commit the submodule update
git add _ai-bootstrap .claude/commands
git commit -m "chore: update garden system from ai-bootstrap"
```

---

## Method 3: Symlink (Local Development)

**Best for:** Local development when ai-bootstrap is on the same machine

Creates symbolic links to the ai-bootstrap repository - changes reflect immediately.

### Steps

```bash
# Navigate to target repository
cd /path/to/target-repo

# Create symlinks
ln -s /path/to/ai-bootstrap/_gs-gardener _gs-gardener
mkdir -p .claude/commands
ln -s /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/
```

### Advantages

- ✅ **Instant updates** - Changes to source reflect immediately
- ✅ **No copying** - Just symlinks

### Disadvantages

- ⚠️ **Local only** - Only works on your machine
- ⚠️ **Fragile** - Breaks if ai-bootstrap moves
- ⚠️ **Can't commit** - Symlinks don't work for other users

### Updating

No action needed - symlinks automatically point to latest version. Just pull ai-bootstrap:

```bash
cd /path/to/ai-bootstrap
git pull origin main
```

---

## Verification

After installation (any method), verify the garden system works:

```bash
cd /path/to/target-repo
claude /gardener
```

### Expected Output

```
🪴 Hello! I'm Gardner Gary (v1.1.0), your Repository Garden Keeper.

## 🌱 Garden Health Status

| Category | File | Status |
|----------|------|--------|
| Source of Truth | AGENTS.md | ✅ |
| Claude Code | CLAUDE.md | ✅ |
...

## 🛠️ Garden Maintenance Menu

[SY] 🔄 Sync - Check all wrapper files...
[AU] 🔍 Audit - Discover drift...
...
```

If you see Gardner Gary's menu, installation was successful! 🎉

## Configuration

Each installation includes a config file at [_gs-gardener/core/config.yaml](_gs-gardener/core/config.yaml).

### Default Configuration

```yaml
# Project details
project_name: your-repo-name
user_name: Your Name
communication_language: English

# File locations
agents_file: "{project-root}/AGENTS.md"
docs_directory: "{project-root}/docs"

# Constraints
agents_max_lines: 150
```

### Customization

Edit the config file to match your repository structure:

```bash
# Edit configuration
vim _gs-gardener/core/config.yaml

# Restart gardener for changes to take effect
claude /gardener
```

## Troubleshooting

### "Cannot find workflow.md"

**Cause:** `_gs-gardener/` directory is missing or incomplete

**Fix:**
1. Verify `_gs-gardener/` exists: `ls _gs-gardener/core/workflows/`
2. If using submodule: `git submodule update --init`
3. If direct copy: Re-copy from ai-bootstrap
4. Check structure: `_gs-gardener/core/workflows/{workflow-name}/workflow.md` must exist

### "Gardener doesn't display menu"

**Cause:** Gardener agent file missing or command has wrong path

**Fix:**
1. Verify agent exists: `ls _gs-gardener/core/agents/gardener.md`
2. Check command file: `cat .claude/commands/garden-agent-gardener.md`
3. Try direct invoke: `claude @_gs-gardener/core/agents/gardener.md`

### "Skill not found: garden-sync"

**Cause:** Command files not in `.claude/commands/`

**Fix:**
```bash
# Check if commands exist
ls .claude/commands/garden-*.md

# Re-copy if missing
mkdir -p .claude/commands
cp /path/to/ai-bootstrap/.claude/commands/garden-*.md .claude/commands/
```

### Skills show but workflows fail

**Cause:** `_gs-gardener/` directory path wrong or missing

**Fix:**
```bash
# Verify structure
ls _gs-gardener/core/workflows/

# Check permissions
chmod -R u+r _gs-gardener/

# Verify _gs-gardener/ is in project root (same level as .claude/)
pwd
ls -la | grep _gs-gardener
```

---

## Next Steps

- Read [Usage Guide](GARDEN-GUIDE.md) for usage patterns and maintenance schedules
- Run `/gardener` to start interactive maintenance
- See [GARDEN-SYSTEM.md](GARDEN-SYSTEM.md) for quick reference

🪴 Installation complete! Happy gardening!
