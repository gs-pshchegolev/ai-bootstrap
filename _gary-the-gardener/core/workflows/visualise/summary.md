# Summary & Suggestions

> Sub-flow triggered when user types `[S]` from the garden map footer.

Read all tracked entities and produce a structured documentation summary (~140–180 lines) followed by 3 prioritised improvement suggestions.

### Step 1: Read Entities

For each entity in `docsmap.yaml`, read the file (up to 60 lines). Note: title/purpose, key topics covered, and any quality signals (stubs, TODOs, missing sections, very short content).

### Step 2: Write Summary Block

Output a structured markdown summary grouped by area. Format:

```
## Documentation Summary — {DD-MM-YYYY}

### {area.emoji} {area.label}
| Doc | Readiness | About |
|-----|-----------|-------|
| {label} | {emoji} | {1-2 sentence description} |
...

### {next area...}
```

One table per area. Descriptions are 1–2 sentences — what the doc covers and whether it feels complete or thin. Target output: ~140–180 lines total.

### Step 3: Generate 3 Suggestions

Based on patterns observed (seeds, thin grown docs, missing areas, duplicate coverage, no cross-references), produce exactly 3 actionable improvement suggestions:

```
1️⃣ **{Action verb + target}** — {why it matters and what to do}
2️⃣ **{Action verb + target}** — {why it matters and what to do}
3️⃣ **{Action verb + target}** — {why it matters and what to do}
```

Prioritise by impact. Name specific files or areas where possible.

### Step 4: Footer

End with `AskUserQuestion`:
- Run suggestion #1 (label it with the specific action)
- Browse an area
- Update garden
- Done
