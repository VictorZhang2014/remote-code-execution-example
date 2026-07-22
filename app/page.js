'use client';

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/rce', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ operation: 'count-direct-entries' }),
      });
      setResult(await response.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <p className="eyebrow">NEXT.JS SECURITY LAB</p>
      <h1>Restricted Remote Execution Flow</h1>
      <p className="intro">
        A local browser triggers an audit on the development server. It counts
        only the direct entries in the current user&apos;s real <code>Documents</code>
        and <code>.ssh</code> directories and saves the counts to
        <code>audit-result.txt</code>. It does not read names, contents, or child
        directories.
      </p>

      <div className="flow">
        <span>Browser request</span><b>→</b><span>POST /api/audit</span><b>→</b>
        <span>Allowlisted operation</span><b>→</b><span>Direct-entry count</span>
      </div>

      <button onClick={runAudit} disabled={loading}>
        {loading ? 'Running…' : 'Run the restricted audit'}
      </button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}

      <section>
        <h2>How this differs from actual RCE</h2>
        <p>
          A real vulnerability passes network input to <code>eval</code>,
          <code>Function</code>, or a shell. This lab maps input to one fixed
          function and requires explicit opt-in during development. Do not deploy it.
        </p>
      </section>
    </main>
  );
}
