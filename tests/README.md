# Tests

End-to-end tests for the Gary The Gardener CLI tool, using Playwright's test runner.

## Setup

```bash
npm install
```

No browser installation needed — these are CLI-only tests (no browser contexts).

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (interactive)
npx playwright test --ui

# Run a specific test file
npx playwright test tests/e2e/cli-commands.spec.ts

# Run tests matching a name
npx playwright test -g "install --dry-run"

# Run with verbose output
npx playwright test --reporter=list
```

## Architecture

```
tests/
├── e2e/                          # Test specs
│   └── cli-commands.spec.ts      # All CLI command tests
├── support/
│   ├── fixtures/
│   │   └── index.ts              # tempDir + cli fixtures
│   └── helpers/
│       └── cli.ts                # Pure function: spawns CLI process
└── README.md
```

### Fixtures (`support/fixtures/index.ts`)

Two fixtures available in every test:

- **`tempDir`** — Creates an isolated temp directory per test. Automatically cleaned up after each test completes. This ensures tests never interfere with each other or with the real project directory.
- **`cli(args)`** — Runs `node bin/cli.js` with the given arguments in the temp directory. Returns `{ stdout, stderr, exitCode }`.

### Helpers (`support/helpers/cli.ts`)

Pure function `runCli(args, options)` that spawns the CLI as a child process. Framework-agnostic — can be used outside Playwright if needed.

- Sets `NO_COLOR=1` to strip ANSI codes from output for clean assertions
- 15-second timeout per invocation
- Returns structured `{ stdout, stderr, exitCode }`

## Best Practices

- **Test isolation**: Every test gets a fresh temp directory via the `tempDir` fixture. No shared state between tests.
- **Dry-run testing**: Use `--dry-run` flag to test CLI behavior without side effects when only checking output.
- **Assert on stdout/stderr**: Match on human-readable strings from CLI output.
- **Assert on file system**: Use `existsSync` to verify files were (or weren't) created.
- **Exit codes**: Always assert `exitCode` — 0 for success, 1 for errors.

## CI Integration

Tests run in parallel locally and serially in CI (configured in `playwright.config.ts`):

```yaml
# GitHub Actions example
- name: Run CLI tests
  run: npm run test:e2e
  env:
    CI: true
```

Reports generated:
- **HTML**: `playwright-report/` (open with `npx playwright show-report`)
- **JUnit XML**: `test-results/results.xml` (CI integration)
- **Console**: list reporter for terminal output

## Adding New Tests

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Import fixtures: `import { test, expect } from '../support/fixtures'`
3. Use `cli()` to run commands and assert on the result:

```typescript
test('my new test', async ({ cli, tempDir }) => {
  const result = await cli(['install', '--dry-run']);
  expect(result.stdout).toContain('expected output');
  expect(result.exitCode).toBe(0);
});
```
