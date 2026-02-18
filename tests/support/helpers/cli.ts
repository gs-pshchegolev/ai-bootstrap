import { execFile } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(thisDir, '../../../bin/cli.js');

export type CliResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

/**
 * Pure function: run the CLI with given args in a given working directory.
 * Returns stdout, stderr, and exit code.
 */
export function runCli(
  args: string[],
  options: { cwd: string; env?: Record<string, string> } = { cwd: process.cwd() },
): Promise<CliResult> {
  return new Promise((resolve) => {
    const child = execFile(
      process.execPath,
      [CLI_PATH, ...args],
      {
        cwd: options.cwd,
        env: { ...process.env, ...options.env, NO_COLOR: '1' },
        timeout: 15000,
      },
      (error, stdout, stderr) => {
        resolve({
          stdout: stdout.toString(),
          stderr: stderr.toString(),
          exitCode: error?.code ? Number(error.code) : child.exitCode ?? 0,
        });
      },
    );
  });
}
