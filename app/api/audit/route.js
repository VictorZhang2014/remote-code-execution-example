import { readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const runtime = 'nodejs';

async function countDirectEntries(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  return {
    files: entries.filter((entry) => entry.isFile()).length,
    directories: entries.filter((entry) => entry.isDirectory()).length,
    // Deliberately return counts only: no names, contents, or recursion.
  };
}

export async function POST(request) {
  // Two deliberate safety gates: this educational endpoint must never work in
  // a production build, and local users must explicitly opt in each time.
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.ENABLE_LOCAL_HOME_AUDIT !== 'I_UNDERSTAND'
  ) {
    return Response.json(
      { error: 'Local audit is disabled. See README.md.' },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);

  if (body?.operation !== 'count-direct-entries') {
    return Response.json({ error: 'Unsupported operation' }, { status: 400 });
  }

  const home = os.homedir();
  const [documents, ssh] = await Promise.all([
    countDirectEntries(path.join(home, 'Documents')),
    countDirectEntries(path.join(home, '.ssh')),
  ]);

  const result = {
    scope: 'local user home (counts only)',
    recursive: false,
    Documents: documents,
    '.ssh': ssh,
  };

  const output = [
    `Generated: ${new Date().toISOString()}`,
    'Scope: local user home; direct entries only; no names or contents',
    `Documents: ${documents.files} files, ${documents.directories} directories`,
    `.ssh: ${ssh.files} files, ${ssh.directories} directories`,
    '',
  ].join('\n');

  await writeFile(path.join(process.cwd(), 'audit-result.txt'), output, {
    encoding: 'utf8',
    mode: 0o600,
  });

  return Response.json({ ...result, savedTo: 'audit-result.txt' });
}
