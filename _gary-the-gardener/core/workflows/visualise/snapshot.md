# Save Snapshot

> Sub-flow triggered before any `garden_version` major bump or on explicit user request.

1. Read current `garden.md`. If absent, skip silently.
2. Write to `{project-root}/_gary-the-gardener/garden/snapshots/garden-v{garden_version}-{DD-MM-YYYY}.md`.
   Create the `snapshots/` directory if it doesn't exist.
3. Append to `history.jsonl`:
   ```jsonl
   {"ts":"{DD-MM-YYYY}","action":"snapshot","summary":"Snapshot saved before restructure","file":"garden-v{garden_version}-{DD-MM-YYYY}.md"}
   ```
4. Confirm to user: `📸 Snapshot saved: garden-v{garden_version}-{DD-MM-YYYY}.md`
