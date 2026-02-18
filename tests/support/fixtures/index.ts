import { test as base, expect } from '@playwright/test';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runCli, type CliResult } from '../helpers/cli';

type CliFixtures = {
  /** Isolated temp directory for each test — cleaned up automatically */
  tempDir: string;
  /** Run the CLI in the temp directory */
  cli: (args: string[]) => Promise<CliResult>;
};

export const test = base.extend<CliFixtures>({
  tempDir: async ({}, use) => {
    const dir = mkdtempSync(join(tmpdir(), 'gary-test-'));
    await use(dir);
    rmSync(dir, { recursive: true, force: true });
  },

  cli: async ({ tempDir }, use) => {
    await use((args: string[]) => runCli(args, { cwd: tempDir }));
  },
});

export { expect };
